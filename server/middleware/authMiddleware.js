const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for Token in Headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key');
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) return next();
    } catch (error) {
      console.warn('⚠️ Token verification failed, falling back to guest mode.');
    }
  }

  // GUEST MODE: If no token or failed token, assign a default user to bypass restrictions
  try {
    // Find the first user or an admin user to act as guest
    const guestUser = await User.findOne({ role: 'admin' }) || await User.findOne();
    
    if (guestUser) {
      req.user = guestUser;
      return next();
    }
  } catch (error) {
    console.error('Guest Mode Error:', error);
  }

  // If absolutely no users exist, we still can't proceed because models need a user ID
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token and no guest user available' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
