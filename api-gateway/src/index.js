require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const { verifyToken } = require('./middleware/auth');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// ─── Middleware ───────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Global Rate Limiter ──────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth requests, please try again later.' }
});

app.use(globalLimiter);

// ─── Service URLs ─────────────────────────────────────────────────
const SERVICES = {
  auth:       process.env.AUTH_SERVICE_URL       || 'http://localhost:3001',
  users:      process.env.USER_SERVICE_URL        || 'http://localhost:3002',
  restaurants:process.env.RESTAURANT_SERVICE_URL  || 'http://localhost:3003',
  menu:       process.env.MENU_SERVICE_URL         || 'http://localhost:3004',
  cart:       process.env.CART_SERVICE_URL         || 'http://localhost:3006',
  orders:     process.env.ORDER_SERVICE_URL        || 'http://localhost:3007',
  analytics:  process.env.ANALYTICS_SERVICE_URL   || 'http://localhost:3009',
  reviews:    process.env.REVIEW_SERVICE_URL       || 'http://localhost:3010',
  location:   process.env.LOCATION_SERVICE_URL    || 'http://localhost:3011',
};

// ─── Proxy factory ───────────────────────────────────────────────
const proxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(502).json({ success: false, message: 'Service temporarily unavailable' });
      }
    }
  });

// ─── Routes ──────────────────────────────────────────────────────
app.use('/api/v1/auth',        authLimiter, proxy(SERVICES.auth));
app.use('/api/v1/users',       verifyToken, proxy(SERVICES.users));
app.use('/api/v1/restaurants', proxy(SERVICES.restaurants));
app.use('/api/v1/menu',        proxy(SERVICES.menu));
app.use('/api/v1/cart',        verifyToken, proxy(SERVICES.cart));
app.use('/api/v1/orders',      verifyToken, proxy(SERVICES.orders));
app.use('/api/v1/analytics',   verifyToken, proxy(SERVICES.analytics));
app.use('/api/v1/reviews',     proxy(SERVICES.reviews));
app.use('/api/v1/location',    proxy(SERVICES.location));

// ─── Health ───────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  const redisPing = await redis.ping().catch(() => 'DOWN');
  res.json({
    status: 'ok',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    redis: redisPing === 'PONG' ? 'UP' : 'DOWN',
    services: Object.keys(SERVICES)
  });
});

// ─── 404 ──────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Error handler ───────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ─── Socket.io for real-time notifications ───────────────────────
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-restaurant', (restaurantId) => {
    socket.join(`restaurant:${restaurantId}`);
  });

  socket.on('join-user', (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in other parts
app.set('io', io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
});

module.exports = { app, server, io };
