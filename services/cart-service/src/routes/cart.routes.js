const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', ctrl.getCart);
router.post('/add', ctrl.addToCart);
router.put('/update', ctrl.updateCartItem);
router.delete('/remove/:menuItemId', ctrl.removeFromCart);
router.delete('/clear', ctrl.clearCart);

module.exports = router;
