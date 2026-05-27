require('dotenv').config();
require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');
const menuRoutes = require('./routes/menu.routes');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(morgan('combined', { stream: { write: m => logger.info(m.trim()) } }));
app.use('/api/v1/menu', menuRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'menu-service' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

const start = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      logger.info('Connected to MongoDB (menu-db)');
    } else {
      logger.warn('MONGO_URI not set – running without database');
    }
  } catch (err) {
    logger.warn('Startup warning: ' + err.message);
  }

  const PORT = process.env.PORT || 3004;
  app.listen(PORT, () => logger.info(`Menu Service on port ${PORT}`));
};

start();
module.exports = app;
