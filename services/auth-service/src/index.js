require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');
const { connectRabbitMQ } = require('./config/rabbitmq');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(mongoSanitize());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.use('/api/v1/auth', authRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found' }));

app.use((err, req, res, next) => {
  logger.error(err.stack);
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: err.message });
  if (err.code === 11000) return res.status(400).json({ success: false, message: 'Duplicate field value' });
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info('Connected to MongoDB (auth-db)');
    } else {
      logger.warn('MONGO_URI not set – running without database');
    }
    if (process.env.RABBITMQ_URL) {
      await connectRabbitMQ().catch(e => logger.warn('RabbitMQ optional – skipping: ' + e.message));
    }
  } catch (err) {
    logger.warn('Startup warning: ' + err.message);
  }

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => logger.info(`Auth Service running on port ${PORT}`));
};

start();
module.exports = app;
