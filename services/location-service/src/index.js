require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { connectRabbitMQ } = require('./config/rabbitmq');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'location-service' }));

app.get('/api/v1/location/current', (req, res) => {
  res.json({ success: true, message: 'Location fetched (mocked)' });
});

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found' }));

const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info('Connected to MongoDB');
    } else {
      logger.warn('Running without MongoDB');
    }
    
    if (process.env.RABBITMQ_URL) {
      await connectRabbitMQ();
    }

    const PORT = process.env.PORT || 3011;
    app.listen(PORT, () => {
      logger.info(`Location Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(`Start failed: ${err.message}`);
    process.exit(1);
  }
};

start();
