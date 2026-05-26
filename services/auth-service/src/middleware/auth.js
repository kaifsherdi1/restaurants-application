const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const auth = req.headers['authorization'] || req.headers['x-user-id'];
  const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;
  const userIdHeader = req.headers['x-user-id'];

  if (userIdHeader && !token) {
    // Called from API Gateway (already verified)
    req.userId = userIdHeader;
    return next();
  }

  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.headers['x-user-role'] || req.userRole)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

module.exports = { protect, requireRole };
