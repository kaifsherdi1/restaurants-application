// Centralized mock data – replace with real API calls
export const RESTAURANTS = [
  {
    id: '1', slug: 'burger-singh', name: 'Burger Singh', cuisines: ['Burgers', 'Fast Food'],
    address: { city: 'New Delhi', fullAddress: 'Connaught Place, New Delhi - 110001' },
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop',
    averageRating: 4.3, totalReviews: 2840, deliveryTime: { min: 25, max: 40 },
    minimumOrder: 149, deliveryFee: 30, isOpen: true, isFeatured: true, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'premium',
    tags: ['Trending', 'Best Sellers']
  },
  {
    id: '2', slug: 'biryani-by-kilo', name: 'Biryani By Kilo', cuisines: ['Biryani', 'North Indian'],
    address: { city: 'Mumbai', fullAddress: 'Bandra West, Mumbai - 400050' },
    logo: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=400&fit=crop',
    averageRating: 4.6, totalReviews: 5120, deliveryTime: { min: 35, max: 50 },
    minimumOrder: 299, deliveryFee: 0, isOpen: true, isFeatured: true, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'enterprise',
    tags: ['Free Delivery', 'Top Rated']
  },
  {
    id: '3', slug: 'belgian-waffle', name: 'The Belgian Waffle Co.', cuisines: ['Waffles', 'Desserts', 'Cafe'],
    address: { city: 'Bangalore', fullAddress: 'Indiranagar, Bangalore - 560038' },
    logo: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=800&h=400&fit=crop',
    averageRating: 4.4, totalReviews: 3200, deliveryTime: { min: 20, max: 35 },
    minimumOrder: 199, deliveryFee: 40, isOpen: true, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'premium',
    tags: ['Desserts', 'Must Try']
  },
  {
    id: '4', slug: 'chaayos', name: 'Chaayos', cuisines: ['Tea', 'Snacks', 'Cafe'],
    address: { city: 'Gurgaon', fullAddress: 'Cyber City, Gurgaon - 122002' },
    logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    averageRating: 4.2, totalReviews: 1890, deliveryTime: { min: 15, max: 30 },
    minimumOrder: 99, deliveryFee: 20, isOpen: true, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'premium',
    tags: ['Quick Bites', 'Tea Lovers']
  },
  {
    id: '5', slug: 'wow-momo', name: 'Wow! Momo', cuisines: ['Momos', 'Chinese', 'Fast Food'],
    address: { city: 'Kolkata', fullAddress: 'Park Street, Kolkata - 700016' },
    logo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=400&fit=crop',
    averageRating: 4.1, totalReviews: 4560, deliveryTime: { min: 20, max: 35 },
    minimumOrder: 120, deliveryFee: 25, isOpen: true, isFeatured: true, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'premium',
    tags: ['Bestseller', 'Trending']
  },
  {
    id: '6', slug: 'haldirams', name: "Haldiram's", cuisines: ['North Indian', 'Sweets', 'Snacks'],
    address: { city: 'New Delhi', fullAddress: 'Laxmi Nagar, New Delhi - 110092' },
    logo: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
    averageRating: 4.5, totalReviews: 8900, deliveryTime: { min: 30, max: 50 },
    minimumOrder: 200, deliveryFee: 0, isOpen: true, isFeatured: true, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'enterprise',
    tags: ['Legacy Brand', 'Free Delivery']
  },
  {
    id: '7', slug: 'barbeque-nation', name: 'Barbeque Nation', cuisines: ['BBQ', 'Grill', 'North Indian'],
    address: { city: 'Hyderabad', fullAddress: 'Banjara Hills, Hyderabad - 500034' },
    logo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    averageRating: 4.7, totalReviews: 6200, deliveryTime: { min: 40, max: 60 },
    minimumOrder: 499, deliveryFee: 0, isOpen: false, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'enterprise',
    tags: ['Premium Dining', 'Grill']
  },
  {
    id: '8', slug: 'madras-cafe', name: 'Madras Cafe', cuisines: ['South Indian', 'Dosa', 'Filter Coffee'],
    address: { city: 'Chennai', fullAddress: 'T Nagar, Chennai - 600017' },
    logo: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&h=400&fit=crop',
    averageRating: 4.4, totalReviews: 3400, deliveryTime: { min: 20, max: 35 },
    minimumOrder: 99, deliveryFee: 15, isOpen: true, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'premium',
    tags: ['Authentic', 'South Indian']
  },
  {
    id: '9', slug: 'keventers', name: 'Keventers', cuisines: ['Milkshakes', 'Desserts', 'Beverages'],
    address: { city: 'Mumbai', fullAddress: 'Juhu Beach Road, Mumbai - 400049' },
    logo: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=400&fit=crop',
    averageRating: 4.0, totalReviews: 2100, deliveryTime: { min: 15, max: 25 },
    minimumOrder: 99, deliveryFee: 20, isOpen: true, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'free',
    tags: ['Milkshakes', 'Classic']
  },
  {
    id: '10', slug: 'nic-ice-creams', name: 'NIC Ice Creams', cuisines: ['Ice Cream', 'Desserts'],
    address: { city: 'Pune', fullAddress: 'Koregaon Park, Pune - 411001' },
    logo: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&h=400&fit=crop',
    averageRating: 4.5, totalReviews: 1780, deliveryTime: { min: 20, max: 30 },
    minimumOrder: 120, deliveryFee: 30, isOpen: true, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'free',
    tags: ['Natural', 'Artisanal']
  },
  {
    id: '11', slug: 'pizza-wings', name: 'Pizza Wings', cuisines: ['Pizza', 'Wings', 'Fast Food'],
    address: { city: 'Bangalore', fullAddress: 'Koramangala, Bangalore - 560034' },
    logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
    averageRating: 4.2, totalReviews: 2890, deliveryTime: { min: 30, max: 45 },
    minimumOrder: 199, deliveryFee: 35, isOpen: true, isFeatured: false, isVerified: false,
    whatsappNumber: '7483192591', subscriptionPlan: 'free',
    tags: ['Pizza', 'Wings']
  },
  {
    id: '12', slug: 'cafe-coffee-day', name: 'Cafe Coffee Day', cuisines: ['Coffee', 'Cafe', 'Snacks'],
    address: { city: 'Bangalore', fullAddress: 'MG Road, Bangalore - 560001' },
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=80&h=80&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=400&fit=crop',
    averageRating: 3.9, totalReviews: 5600, deliveryTime: { min: 20, max: 30 },
    minimumOrder: 99, deliveryFee: 20, isOpen: true, isFeatured: false, isVerified: true,
    whatsappNumber: '7483192591', subscriptionPlan: 'free',
    tags: ['Coffee', 'Casual']
  }
]

export const MENU_ITEMS: Record<string, any[]> = {
  '1': [ // Burger Singh
    { id: 'm1', name: 'Amritsari Chicken Burger', price: 199, discountedPrice: 169, isVeg: false, isBestSeller: true, spiceLevel: 'medium', preparationTime: 15, description: 'Crispy chicken patty with amritsari spices', rating: 4.4, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
    { id: 'm2', name: 'Paneer Patiala Burger', price: 169, discountedPrice: null, isVeg: true, isBestSeller: true, spiceLevel: 'mild', preparationTime: 12, description: 'Juicy paneer patty with patiala sauce', rating: 4.2, image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop' },
    { id: 'm3', name: 'Loaded French Fries', price: 129, discountedPrice: 99, isVeg: true, isBestSeller: false, spiceLevel: 'mild', preparationTime: 8, description: 'Crispy fries loaded with cheese and spices', rating: 4.1, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
    { id: 'm4', name: 'Double Cheese Burger', price: 249, discountedPrice: null, isVeg: false, isBestSeller: false, spiceLevel: 'medium', preparationTime: 18, description: 'Double patty with extra cheese', rating: 4.3, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop' },
    { id: 'm5', name: 'Cold Coffee', price: 89, discountedPrice: null, isVeg: true, isBestSeller: false, spiceLevel: 'none', preparationTime: 5, description: 'Chilled coffee with ice cream', rating: 4.0, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
  ],
  '2': [ // Biryani by Kilo
    { id: 'm6', name: 'Chicken Dum Biryani (1kg)', price: 499, discountedPrice: 449, isVeg: false, isBestSeller: true, spiceLevel: 'medium', preparationTime: 45, description: 'Slow-cooked dum biryani served in handi', rating: 4.7, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop' },
    { id: 'm7', name: 'Mutton Biryani (1kg)', price: 699, discountedPrice: null, isVeg: false, isBestSeller: true, spiceLevel: 'hot', preparationTime: 60, description: 'Tender mutton pieces in aromatic rice', rating: 4.8, image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400&h=300&fit=crop' },
    { id: 'm8', name: 'Veg Biryani (1kg)', price: 399, discountedPrice: 349, isVeg: true, isBestSeller: false, spiceLevel: 'medium', preparationTime: 40, description: 'Fresh vegetables in fragrant basmati rice', rating: 4.3, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop' },
    { id: 'm9', name: 'Raita', price: 79, discountedPrice: null, isVeg: true, isBestSeller: false, spiceLevel: 'none', preparationTime: 5, description: 'Creamy yogurt with cucumber', rating: 4.0, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop' },
    { id: 'm10', name: 'Gulab Jamun', price: 99, discountedPrice: null, isVeg: true, isBestSeller: false, spiceLevel: 'none', preparationTime: 5, description: 'Soft milk dumplings in sugar syrup', rating: 4.5, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c18bb5?w=400&h=300&fit=crop' },
  ],
  '3': [ // Belgian Waffle
    { id: 'm11', name: 'Classic Chocolate Waffle', price: 199, discountedPrice: 179, isVeg: true, isBestSeller: true, spiceLevel: 'none', preparationTime: 10, description: 'Crispy waffle with Belgian chocolate sauce', rating: 4.5, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=300&fit=crop' },
    { id: 'm12', name: 'Nutella Waffle', price: 229, discountedPrice: null, isVeg: true, isBestSeller: true, spiceLevel: 'none', preparationTime: 10, description: 'Golden waffle with Nutella and banana', rating: 4.6, image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=400&h=300&fit=crop' },
    { id: 'm13', name: 'Strawberry Waffle', price: 219, discountedPrice: null, isVeg: true, isBestSeller: false, spiceLevel: 'none', preparationTime: 10, description: 'Fresh strawberries with cream', rating: 4.3, image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop' },
  ],
}

export const CATEGORIES = [
  { name: 'Biryani', emoji: '🍛', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
  { name: 'Pizza', emoji: '🍕', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
  { name: 'Burgers', emoji: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
  { name: 'South Indian', emoji: '🫓', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=200&h=200&fit=crop' },
  { name: 'Chinese', emoji: '🥟', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&h=200&fit=crop' },
  { name: 'Desserts', emoji: '🍰', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=200&h=200&fit=crop' },
  { name: 'Cafe', emoji: '☕', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop' },
  { name: 'Rolls', emoji: '🌯', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop' },
]

export const CITIES = ['All Cities', 'New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Gurgaon']
