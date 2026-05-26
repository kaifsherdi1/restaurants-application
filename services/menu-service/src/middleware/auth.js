const jwt = require('jsonwebtoken');
const protect = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (userId) { req.userId = userId; req.userRole = req.headers['x-user-role']; return next(); }
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });
  try {
    const d = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = d.userId; req.userRole = d.role;
    req.headers['x-user-id'] = d.userId; req.headers['x-user-role'] = d.role;
    next();
  } catch { res.status(401).json({ success: false, message: 'Invalid token' }); }
};
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.headers['x-user-role'] || req.userRole)) return res.status(403).json({ success: false, message: 'Forbidden' });
  next();
};
module.exports = { protect, requireRole };
