require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { connectRabbitMQ, subscribeEvent } = require('./config/rabbitmq');
const Analytics = require('./models/Analytics');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/v1/analytics', analyticsRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'analytics-service' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('✅ Connected to MongoDB (analytics-db)');
  await connectRabbitMQ();

  // Subscribe to order events for analytics tracking
  await subscribeEvent('analytics-order-queue', 'order.created', async (data) => {
    await Analytics.create({
      eventType: 'order',
      restaurantId: data.restaurantId,
      customerId: data.customerId,
      amount: data.totalAmount,
      items: data.items,
      metadata: data
    });
  });

  const PORT = process.env.PORT || 3009;
  app.listen(PORT, () => logger.info(`🚀 Analytics Service on port ${PORT}`));
};

start().catch(err => { logger.error(err); process.exit(1); });
module.exports = app;
