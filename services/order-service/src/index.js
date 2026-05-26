require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const orderRoutes = require('./routes/order.routes');
const { connectRabbitMQ } = require('./config/rabbitmq');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/v1/orders', orderRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'order-service' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  logger.info('✅ Connected to MongoDB (orders-db)');
  await connectRabbitMQ();
  const PORT = process.env.PORT || 3007;
  app.listen(PORT, () => logger.info(`🚀 Order Service on port ${PORT}`));
};

start().catch(err => { logger.error(err); process.exit(1); });
module.exports = app;
