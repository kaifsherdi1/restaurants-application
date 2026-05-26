require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');
const restaurantRoutes = require('./routes/restaurant.routes');
const { connectRabbitMQ } = require('./config/rabbitmq');
const { connectRedis } = require('./config/redis');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('combined', { stream: { write: (m) => logger.info(m.trim()) } }));

app.use('/api/v1/restaurants', restaurantRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'restaurant-service' }));

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ success: false, message: err.message });
});

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('✅ Connected to MongoDB (restaurants-db)');
  await connectRabbitMQ();
  await connectRedis();
  const PORT = process.env.PORT || 3003;
  app.listen(PORT, () => logger.info(`🚀 Restaurant Service on port ${PORT}`));
};

start().catch(err => { logger.error(err); process.exit(1); });
module.exports = app;
