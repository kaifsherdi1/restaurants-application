require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const cartRoutes = require('./routes/cart.routes');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/v1/cart', cartRoutes);
app.get('/health', (_, res) => res.json({ status: 'ok', service: 'cart-service' }));
app.use((err, req, res, next) => res.status(500).json({ success: false, message: err.message }));

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => logger.info(`🚀 Cart Service on port ${PORT}`));
module.exports = app;
