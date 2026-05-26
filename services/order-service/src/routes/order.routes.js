const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');

router.post('/whatsapp-url', ctrl.generateWhatsAppOrderUrl);
router.post('/', protect, ctrl.createOrder);
router.get('/my', protect, ctrl.getMyOrders);
router.get('/restaurant/:restaurantId', protect, ctrl.getRestaurantOrders);
router.get('/analytics/restaurant/:restaurantId', protect, ctrl.getOrderAnalytics);
router.get('/:id', protect, ctrl.getOrder);
router.patch('/:id/status', protect, ctrl.updateOrderStatus);

module.exports = router;
