const mongoose = require('mongoose');
const slugify = require('slugify');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  ownerId: {
    type: String,
    required: [true, 'Owner ID is required'],
    index: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  cuisines: [{
    type: String,
    trim: true
  }],
  address: {
    street: String,
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    fullAddress: String
  },
  geoLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number']
  },
  phoneNumber: String,
  email: String,
  logo: {
    url: String,
    publicId: String
  },
  coverImage: {
    url: String,
    publicId: String
  },
  images: [{
    url: String,
    publicId: String
  }],
  openingTime: {
    type: String,
    default: '09:00'
  },
  closingTime: {
    type: String,
    default: '22:00'
  },
  openDays: {
    type: [String],
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  deliveryRadius: {
    type: Number,
    default: 5,
    min: 0,
    max: 50
  },
  deliveryTime: {
    min: { type: Number, default: 20 },
    max: { type: Number, default: 45 }
  },
  minimumOrder: {
    type: Number,
    default: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  averageRating: {
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
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  tags: [String],
  fssaiLicense: String,
  gstNumber: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  socialLinks: {
    instagram: String,
    facebook: String,
    website: String
  },
  primaryColor: {
    type: String,
    default: '#FF6B35'
  }
}, {
  timestamps: true
});

// Indexes
restaurantSchema.index({ geoLocation: '2dsphere' });
restaurantSchema.index({ slug: 1 });
restaurantSchema.index({ ownerId: 1 });
restaurantSchema.index({ city: 1, cuisines: 1 });
restaurantSchema.index({ isActive: 1, isOpen: 1 });
restaurantSchema.index({ name: 'text', description: 'text', cuisines: 'text' });

// Pre-save: generate slug
restaurantSchema.pre('save', async function(next) {
  if (this.isModified('name')) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await mongoose.model('Restaurant').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
  }
  if (this.address) {
    this.address.fullAddress = [
      this.address.street,
      this.address.landmark,
      this.address.city,
      this.address.state,
      this.address.pincode
    ].filter(Boolean).join(', ');
  }
  next();
});

// Virtual: isCurrentlyOpen
restaurantSchema.virtual('isCurrentlyOpen').get(function() {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  return this.isOpen && this.openDays.includes(day) &&
    currentTime >= this.openingTime && currentTime <= this.closingTime;
});

restaurantSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
