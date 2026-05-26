const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountedPrice: Number,
  quantity: { type: Number, required: true, min: 1 },
  isVeg: Boolean,
  customizations: [{
    name: String,
    option: String,
    additionalPrice: Number
  }],
  subtotal: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  restaurantId: {
    type: String,
    required: true,
    index: true
  },
  restaurantName: String,
  restaurantWhatsapp: String,
  customerId: String,
  customerName: { type: String, required: true },
  customerPhone: String,
  customerEmail: String,
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    fullAddress: String
  },
  orderType: {
    type: String,
    enum: ['delivery', 'pickup', 'dine_in'],
    default: 'delivery'
  },
  specialInstructions: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  whatsappMessageSent: {
    type: Boolean,
    default: false
  },
  whatsappUrl: String,
  source: {
    type: String,
    enum: ['web', 'mobile', 'whatsapp'],
    default: 'web'
  },
  couponCode: String,
  estimatedDeliveryTime: Number,
  actualDeliveryTime: Date
}, {
  timestamps: true
});

// Pre-save: generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const timestamp = Date.now().toString().slice(-6);
    this.orderNumber = `ORD${timestamp}${(count + 1).toString().padStart(4, '0')}`;
  }
  // Calculate subtotal per item
  this.items.forEach(item => {
    const price = item.discountedPrice || item.price;
    const customizationCost = item.customizations?.reduce((sum, c) => sum + (c.additionalPrice || 0), 0) || 0;
    item.subtotal = (price + customizationCost) * item.quantity;
  });
  next();
});

orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
