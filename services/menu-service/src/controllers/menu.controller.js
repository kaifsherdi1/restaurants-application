const { MenuItem, MenuCategory } = require('../models/Menu');
const logger = require('../utils/logger');

// ─── Categories ───────────────────────────────────────────────────

const getCategories = async (req, res) => {
  const { restaurantId } = req.params;
  const categories = await MenuCategory.find({ restaurantId, isActive: true })
    .sort({ sortOrder: 1, name: 1 }).lean();
  res.json({ success: true, data: { categories } });
};

const createCategory = async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const category = await MenuCategory.create({ ...req.body });
  res.status(201).json({ success: true, data: { category } });
};

const updateCategory = async (req, res) => {
  const category = await MenuCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, data: { category } });
};

const deleteCategory = async (req, res) => {
  await MenuCategory.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true, message: 'Category deleted' });
};

// ─── Menu Items ───────────────────────────────────────────────────

const getMenuByRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const { category, isVeg, search, available } = req.query;

  const query = { restaurantId, isAvailable: true };
  if (category) query.categoryId = category;
  if (isVeg === 'true') query.isVeg = true;
  if (isVeg === 'false') query.isVeg = false;
  if (available === 'false') delete query.isAvailable;
  if (search) query.$text = { $search: search };

  const items = await MenuItem.find(query)
    .sort({ isBestSeller: -1, sortOrder: 1, name: 1 }).lean();

  // Group by category
  const categories = await MenuCategory.find({ restaurantId, isActive: true })
    .sort({ sortOrder: 1 }).lean();

  const grouped = categories.map(cat => ({
    ...cat,
    items: items.filter(item => item.categoryId?.toString() === cat._id.toString())
  }));

  // Uncategorized items
  const categorizedIds = items
    .filter(i => i.categoryId)
    .map(i => i.categoryId.toString());
  const uncategorized = items.filter(i => !i.categoryId);

  if (uncategorized.length) {
    grouped.push({ name: 'Other', items: uncategorized });
  }

  res.json({ success: true, data: { menu: grouped, totalItems: items.length } });
};

const getMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: { item } });
};

const createMenuItem = async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, data: { item } });
};

const updateMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: { item } });
};

const deleteMenuItem = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Item deleted' });
};

const toggleAvailability = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Not found' });
  item.isAvailable = !item.isAvailable;
  await item.save();
  res.json({ success: true, data: { isAvailable: item.isAvailable } });
};

const searchMenuItems = async (req, res) => {
  const { q, isVeg, maxPrice, restaurantId } = req.query;
  const query = {};
  if (q) query.$text = { $search: q };
  if (isVeg !== undefined) query.isVeg = isVeg === 'true';
  if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };
  if (restaurantId) query.restaurantId = restaurantId;
  query.isAvailable = true;

  const items = await MenuItem.find(query)
    .sort(q ? { score: { $meta: 'textScore' } } : { isBestSeller: -1 })
    .limit(50).lean();

  res.json({ success: true, data: { items } });
};

const getBestsellers = async (req, res) => {
  const { restaurantId } = req.params;
  const items = await MenuItem.find({ restaurantId, isBestSeller: true, isAvailable: true })
    .sort({ totalOrders: -1 }).limit(10).lean();
  res.json({ success: true, data: { items } });
};

module.exports = {
  getCategories, createCategory, updateCategory, deleteCategory,
  getMenuByRestaurant, getMenuItem, createMenuItem, updateMenuItem,
  deleteMenuItem, toggleAvailability, searchMenuItems, getBestsellers
};
