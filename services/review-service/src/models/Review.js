const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurantId: { type: String, required: true, index: true },
  menuItemId: String,
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerAvatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, maxlength: 1000 },
  photos: [{ url: String, publicId: String }],
  orderItemNames: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  ownerReply: {
    message: String,
    repliedAt: Date
  }
}, { timestamps: true });

reviewSchema.index({ restaurantId: 1, rating: -1 });
reviewSchema.index({ restaurantId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
