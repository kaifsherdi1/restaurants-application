const Redis = require('ioredis');
const logger = require('../utils/logger');

let redis;
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  redis.on('error', (err) => {
    logger.warn(`Redis connection failed (${err.message}). Cart using in-memory fallback.`);
    const RedisMock = require('../utils/redisMock');
    redis.get = async (key) => redisMockInstance.get(key);
    redis.setex = async (key, ttl, val) => redisMockInstance.setex(key, ttl, val);
    redis.del = async (key) => redisMockInstance.del(key);
  });
  const redisMockInstance = new (require('../utils/redisMock'))();
} catch (err) {
  logger.warn('Redis client initialization failed. Using in-memory store.');
  redis = new (require('../utils/redisMock'))();
}

const CART_TTL = 7 * 24 * 60 * 60; // 7 days

const getCartKey = (userId) => `cart:${userId}`;

// GET /api/v1/cart
const getCart = async (req, res) => {
  const userId = req.headers['x-user-id'];
  const cartData = await redis.get(getCartKey(userId));
  const cart = cartData ? JSON.parse(cartData) : { items: [], restaurantId: null, restaurantName: null };
  
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.discountedPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  res.json({ success: true, data: { cart: { ...cart, subtotal, itemCount: cart.items.reduce((s, i) => s + i.quantity, 0) } } });
};

// POST /api/v1/cart/add
const addToCart = async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { item, restaurantId, restaurantName, restaurantWhatsapp } = req.body;

  const cartData = await redis.get(getCartKey(userId));
  let cart = cartData ? JSON.parse(cartData) : { items: [], restaurantId: null, restaurantName: null, restaurantWhatsapp: null };

  // Clear cart if different restaurant
  if (cart.restaurantId && cart.restaurantId !== restaurantId) {
    cart = { items: [], restaurantId: null, restaurantName: null, restaurantWhatsapp: null };
  }

  cart.restaurantId = restaurantId;
  cart.restaurantName = restaurantName;
  cart.restaurantWhatsapp = restaurantWhatsapp;

  const existingIndex = cart.items.findIndex(i => i.menuItemId === item.menuItemId);
  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += item.quantity || 1;
  } else {
    cart.items.push({ ...item, quantity: item.quantity || 1 });
  }

  await redis.setex(getCartKey(userId), CART_TTL, JSON.stringify(cart));
  
  const subtotal = cart.items.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);
  res.json({ success: true, message: 'Added to cart', data: { cart: { ...cart, subtotal } } });
};

// PUT /api/v1/cart/update
const updateCartItem = async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { menuItemId, quantity } = req.body;

  const cartData = await redis.get(getCartKey(userId));
  if (!cartData) return res.status(404).json({ success: false, message: 'Cart not found' });

  const cart = JSON.parse(cartData);
  const idx = cart.items.findIndex(i => i.menuItemId === menuItemId);

  if (idx < 0) return res.status(404).json({ success: false, message: 'Item not in cart' });

  if (quantity <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].quantity = quantity;
  }

  if (cart.items.length === 0) {
    cart.restaurantId = null;
    cart.restaurantName = null;
  }

  await redis.setex(getCartKey(userId), CART_TTL, JSON.stringify(cart));
  const subtotal = cart.items.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);
  res.json({ success: true, data: { cart: { ...cart, subtotal } } });
};

// DELETE /api/v1/cart/remove/:menuItemId
const removeFromCart = async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { menuItemId } = req.params;

  const cartData = await redis.get(getCartKey(userId));
  if (!cartData) return res.status(404).json({ success: false, message: 'Cart not found' });

  const cart = JSON.parse(cartData);
  cart.items = cart.items.filter(i => i.menuItemId !== menuItemId);

  if (cart.items.length === 0) {
    cart.restaurantId = null;
    cart.restaurantName = null;
  }

  await redis.setex(getCartKey(userId), CART_TTL, JSON.stringify(cart));
  res.json({ success: true, message: 'Item removed', data: { cart } });
};

// DELETE /api/v1/cart/clear
const clearCart = async (req, res) => {
  const userId = req.headers['x-user-id'];
  await redis.del(getCartKey(userId));
  res.json({ success: true, message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
