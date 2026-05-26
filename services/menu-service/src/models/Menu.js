const mongoose = require('mongoose');
const slugify = require('slugify');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuCategory'
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: 100
  },
  slug: { type: String, lowercase: true },
  description: { type: String, maxlength: 500 },
  images: [{
    url: String,
    publicId: String
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: 0
  },
  isVeg: {
    type: Boolean,
    required: true,
    default: true
  },
  spiceLevel: {
    type: String,
    enum: ['none', 'mild', 'medium', 'hot', 'extra_hot'],
    default: 'medium'
  },
  preparationTime: {
    type: Number,
    default: 20,
    min: 0
  },
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  customizationOptions: [{
    name: String,
    required: { type: Boolean, default: false },
    multiSelect: { type: Boolean, default: false },
    options: [{
      label: String,
      additionalPrice: { type: Number, default: 0 }
    }]
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  tags: [String],
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
menuItemSchema.index({ restaurantId: 1, categoryId: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ slug: 1 });

menuItemSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const menuCategorySchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  name: { type: String, required: true, trim: true },
  description: String,
  image: { url: String, publicId: String },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const MenuCategory = mongoose.model('MenuCategory', menuCategorySchema);

module.exports = { MenuItem, MenuCategory };
