const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized, no token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const sellerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'seller') return next();
  return res.status(403).json({ message: 'Access denied. Sellers only.' });
};

const buyerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'buyer') return next();
  return res.status(403).json({ message: 'Access denied. Buyers only.' });
};

module.exports = { protect, sellerOnly, buyerOnly };
