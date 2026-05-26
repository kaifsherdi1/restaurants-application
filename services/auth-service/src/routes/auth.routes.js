const express = require('express');
const router = express.Router();
const {
  register, login, refreshToken, logout,
  verifyEmail, forgotPassword, resetPassword, getMe
} = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validations/auth.validation');
const { protect } = require('../middleware/auth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
