const Restaurant = require('../models/Restaurant');
const { publishEvent } = require('../config/rabbitmq');
const { getRedis } = require('../config/redis');
const logger = require('../utils/logger');

const CACHE_TTL = 300; // 5 minutes

// GET /api/v1/restaurants
const getRestaurants = async (req, res) => {
  const {
    page = 1, limit = 12, city, cuisine, search, minRating,
    isVeg, isOpen, sortBy = 'rating', lat, lng, radius = 10,
    plan, featured
  } = req.query;

  const redis = getRedis();
  const cacheKey = `restaurants:${JSON.stringify(req.query)}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  }

  const query = { isActive: true };
  if (city) query['address.city'] = new RegExp(city, 'i');
  if (cuisine) query.cuisines = { $in: [new RegExp(cuisine, 'i')] };
  if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
  if (isOpen === 'true') query.isOpen = true;
  if (featured === 'true') query.isFeatured = true;

  if (search) {
    query.$text = { $search: search };
  }

  let sort = {};
  switch (sortBy) {
    case 'rating': sort = { averageRating: -1 }; break;
    case 'delivery_time': sort = { 'deliveryTime.min': 1 }; break;
    case 'price_low': sort = { minimumOrder: 1 }; break;
    case 'price_high': sort = { minimumOrder: -1 }; break;
    case 'newest': sort = { createdAt: -1 }; break;
    default: sort = { isFeatured: -1, averageRating: -1 };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [restaurants, total] = await Promise.all([
    Restaurant.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
    Restaurant.countDocuments(query)
  ]);

  const result = {
    success: true,
    data: {
      restaurants,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  };

  if (redis) await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  res.json(result);
};

// GET /api/v1/restaurants/nearby
const getNearbyRestaurants = async (req, res) => {
  const { lat, lng, radius = 10, page = 1, limit = 12 } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false, message: 'Latitude and longitude required' });

  const restaurants = await Restaurant.find({
    isActive: true,
    geoLocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
        $maxDistance: parseFloat(radius) * 1000
      }
    }
  }).skip((parseInt(page) - 1) * parseInt(limit)).limit(parseInt(limit)).lean();

  res.json({ success: true, data: { restaurants } });
};

// GET /api/v1/restaurants/:slug
const getRestaurantBySlug = async (req, res) => {
  const redis = getRedis();
  const cacheKey = `restaurant:${req.params.slug}`;

  if (redis) {
    const cached = await redis.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));
  }

  const restaurant = await Restaurant.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

  const result = { success: true, data: { restaurant } };
  if (redis) await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  res.json(result);
};

// GET /api/v1/restaurants/:id
const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).lean();
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
  res.json({ success: true, data: { restaurant } });
};

// POST /api/v1/restaurants
const createRestaurant = async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];

  if (role !== 'restaurant_owner' && role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only restaurant owners can create restaurants' });
  }

  // Check plan limits
  const existingCount = await Restaurant.countDocuments({ ownerId, isActive: true });
  const plan = req.body.subscriptionPlan || 'free';
  if (plan === 'free' && existingCount >= 1) {
    return res.status(403).json({ success: false, message: 'Free plan allows only 1 restaurant. Upgrade to Premium.' });
  }

  const restaurant = await Restaurant.create({ ...req.body, ownerId });

  await publishEvent('restaurant.created', {
    restaurantId: restaurant._id,
    name: restaurant.name,
    ownerId,
    city: restaurant.address?.city
  });

  res.status(201).json({ success: true, message: 'Restaurant created', data: { restaurant } });
};

// PUT /api/v1/restaurants/:id
const updateRestaurant = async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

  if (restaurant.ownerId !== ownerId && role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  const updated = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true, runValidators: true }
  );

  const redis = getRedis();
  if (redis) {
    await redis.del(`restaurant:${updated.slug}`);
  }

  await publishEvent('restaurant.updated', { restaurantId: updated._id, ownerId });

  res.json({ success: true, message: 'Restaurant updated', data: { restaurant: updated } });
};

// DELETE /api/v1/restaurants/:id
const deleteRestaurant = async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });

  if (restaurant.ownerId !== ownerId && role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  restaurant.isActive = false;
  await restaurant.save();

  res.json({ success: true, message: 'Restaurant deleted' });
};

// GET /api/v1/restaurants/owner/my
const getOwnerRestaurants = async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const restaurants = await Restaurant.find({ ownerId, isActive: true }).lean();
  res.json({ success: true, data: { restaurants } });
};

// PATCH /api/v1/restaurants/:id/toggle-status
const toggleRestaurantStatus = async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const restaurant = await Restaurant.findOne({ _id: req.params.id, ownerId });
  if (!restaurant) return res.status(404).json({ success: false, message: 'Not found' });

  restaurant.isOpen = !restaurant.isOpen;
  await restaurant.save();

  res.json({ success: true, data: { isOpen: restaurant.isOpen } });
};

// POST /api/v1/restaurants/:id/upload-logo
const uploadLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { logo: { url: req.file.path, publicId: req.file.filename } },
    { new: true }
  );

  res.json({ success: true, data: { logo: restaurant.logo } });
};

// POST /api/v1/restaurants/:id/upload-cover
const uploadCover = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { coverImage: { url: req.file.path, publicId: req.file.filename } },
    { new: true }
  );

  res.json({ success: true, data: { coverImage: restaurant.coverImage } });
};

// GET /api/v1/restaurants/search/suggestions
const getSearchSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, data: [] });

  const suggestions = await Restaurant.find(
    { $text: { $search: q }, isActive: true },
    { name: 1, slug: 1, logo: 1, address: 1, cuisines: 1, score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } }).limit(8).lean();

  res.json({ success: true, data: suggestions });
};

module.exports = {
  getRestaurants, getNearbyRestaurants, getRestaurantBySlug, getRestaurantById,
  createRestaurant, updateRestaurant, deleteRestaurant, getOwnerRestaurants,
  toggleRestaurantStatus, uploadLogo, uploadCover, getSearchSuggestions
};
