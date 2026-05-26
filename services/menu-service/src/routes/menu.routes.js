const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/menu.controller');
const { protect } = require('../middleware/auth');

// Categories
router.get('/restaurants/:restaurantId/categories', ctrl.getCategories);
router.post('/categories', protect, ctrl.createCategory);
router.put('/categories/:id', protect, ctrl.updateCategory);
router.delete('/categories/:id', protect, ctrl.deleteCategory);

// Menu
router.get('/restaurants/:restaurantId', ctrl.getMenuByRestaurant);
router.get('/restaurants/:restaurantId/bestsellers', ctrl.getBestsellers);
router.get('/search', ctrl.searchMenuItems);
router.get('/items/:id', ctrl.getMenuItem);
router.post('/items', protect, ctrl.createMenuItem);
router.put('/items/:id', protect, ctrl.updateMenuItem);
router.delete('/items/:id', protect, ctrl.deleteMenuItem);
router.patch('/items/:id/toggle', protect, ctrl.toggleAvailability);

module.exports = router;
