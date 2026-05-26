const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const role = req.headers['x-user-role'];

  if (userId) {
    req.userId = userId;
    req.userRole = role;
    return next();
  }

  const auth = req.headers['authorization'];
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-role'] = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  const role = req.headers['x-user-role'] || req.userRole;
  if (!roles.includes(role)) return res.status(403).json({ success: false, message: 'Forbidden' });
  next();
};

module.exports = { protect, requireRole };
