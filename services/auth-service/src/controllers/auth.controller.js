const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { publishEvent } = require('../config/rabbitmq');
const logger = require('../utils/logger');

const generateTokens = (user) => {
  const payload = { userId: user._id, email: user.email, role: user.role };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

// POST /api/v1/auth/register
const register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const verifyToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role === 'restaurant_owner' ? 'restaurant_owner' : 'customer',
    emailVerificationToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
    emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000
  });

  // Publish event
  await publishEvent('user.registered', {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verifyToken,
    clientUrl: process.env.CLIENT_URL
  });

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshTokens.push(refreshToken);
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: { user, accessToken, refreshToken }
  });
};

// POST /api/v1/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account has been deactivated' });
  }

  user.lastLogin = Date.now();
  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshTokens.push(refreshToken);
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken, refreshToken }
  });
};

// POST /api/v1/auth/refresh
const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(401).json({ success: false, message: 'Refresh token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const { accessToken, refreshToken: newRefresh } = generateTokens(user);
    user.refreshTokens = user.refreshTokens.filter(t => t !== token);
    user.refreshTokens.push(newRefresh);
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, data: { accessToken, refreshToken: newRefresh } });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};

// POST /api/v1/auth/logout
const logout = async (req, res) => {
  const { refreshToken: token } = req.body;
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user && token) {
        user.refreshTokens = user.refreshTokens.filter(t => t !== token);
        await user.save({ validateBeforeSave: false });
      }
    } catch {}
  }

  res.json({ success: true, message: 'Logged out successfully' });
};

// GET /api/v1/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Email verified successfully' });
};

// POST /api/v1/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  await publishEvent('user.password_reset', {
    name: user.name,
    email: user.email,
    resetToken,
    clientUrl: process.env.CLIENT_URL
  });

  res.json({ success: true, message: 'Password reset email sent' });
};

// PUT /api/v1/auth/reset-password/:token
const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  res.json({ success: true, message: 'Password reset successful' });
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  const userId = req.headers['x-user-id'];
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: { user } });
};

module.exports = { register, login, refreshToken, logout, verifyEmail, forgotPassword, resetPassword, getMe };
