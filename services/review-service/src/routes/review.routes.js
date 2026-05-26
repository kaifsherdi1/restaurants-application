const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/review.controller');
const { protect } = require('../middleware/auth');

router.get('/restaurant/:restaurantId', ctrl.getReviews);
router.post('/', protect, ctrl.createReview);
router.put('/:id/reply', protect, ctrl.replyToReview);
router.delete('/:id', protect, ctrl.deleteReview);

module.exports = router;
