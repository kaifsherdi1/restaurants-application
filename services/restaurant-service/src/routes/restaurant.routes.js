const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/restaurant.controller');
const { protect, requireRole } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public
router.get('/', ctrl.getRestaurants);
router.get('/nearby', ctrl.getNearbyRestaurants);
router.get('/search/suggestions', ctrl.getSearchSuggestions);
router.get('/slug/:slug', ctrl.getRestaurantBySlug);
router.get('/:id', ctrl.getRestaurantById);

// Owner
router.get('/owner/my', protect, ctrl.getOwnerRestaurants);
router.post('/', protect, requireRole('restaurant_owner', 'admin'), ctrl.createRestaurant);
router.put('/:id', protect, ctrl.updateRestaurant);
router.delete('/:id', protect, ctrl.deleteRestaurant);
router.patch('/:id/toggle-status', protect, ctrl.toggleRestaurantStatus);
router.post('/:id/upload-logo', protect, upload.single('logo'), ctrl.uploadLogo);
router.post('/:id/upload-cover', protect, upload.single('cover'), ctrl.uploadCover);

module.exports = router;
