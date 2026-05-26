const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', protect, ctrl.getDashboard);
router.get('/platform', protect, ctrl.getPlatformStats);

module.exports = router;
