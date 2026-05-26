const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['order', 'view', 'search', 'click'], required: true },
  restaurantId: { type: String, index: true },
  customerId: String,
  amount: Number,
  items: Array,
  metadata: mongoose.Schema.Types.Mixed,
  date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

analyticsSchema.index({ restaurantId: 1, eventType: 1, date: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
