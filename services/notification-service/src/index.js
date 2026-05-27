require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const { connectRabbitMQ } = require('./config/rabbitmq');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Not found' }));

const start = async () => {
  try {
    if (process.env.RABBITMQ_URL) {
      await connectRabbitMQ();
    }

    const PORT = process.env.PORT || 3008;
    app.listen(PORT, () => {
      logger.info(`Notification Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(`Start failed: ${err.message}`);
    process.exit(1);
  }
};

start();
