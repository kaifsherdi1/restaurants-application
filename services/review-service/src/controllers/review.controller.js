const Review = require('../models/Review');

const getReviews = async (req, res) => {
  const { restaurantId } = req.params;
  const { page = 1, limit = 10, rating, sort = 'newest' } = req.query;
  const query = { restaurantId, isApproved: true };
  if (rating) query.rating = parseInt(rating);

  const sortMap = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, highest: { rating: -1 }, lowest: { rating: 1 } };

  const [reviews, total, avgResult] = await Promise.all([
    Review.find(query).sort(sortMap[sort] || { createdAt: -1 }).skip((parseInt(page)-1)*parseInt(limit)).limit(parseInt(limit)).lean(),
    Review.countDocuments(query),
    Review.aggregate([{ $match: { restaurantId, isApproved: true } }, { $group: { _id: null, avg: { $avg: '$rating' }, counts: { $push: '$rating' } } }])
  ]);

  const ratingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (avgResult[0]?.counts) avgResult[0].counts.forEach(r => ratingBreakdown[r]++);

  res.json({ success: true, data: { reviews, total, averageRating: avgResult[0]?.avg?.toFixed(1) || 0, ratingBreakdown, pagination: { page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total/parseInt(limit)) } } });
};

const createReview = async (req, res) => {
  const customerId = req.headers['x-user-id'];
  const existing = await Review.findOne({ restaurantId: req.body.restaurantId, customerId });
  if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this restaurant' });
  const review = await Review.create({ ...req.body, customerId });
  res.status(201).json({ success: true, data: { review } });
};

const replyToReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { ownerReply: { message: req.body.message, repliedAt: new Date() } }, { new: true });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  res.json({ success: true, data: { review } });
};

const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Review deleted' });
};

module.exports = { getReviews, createReview, replyToReview, deleteReview };
