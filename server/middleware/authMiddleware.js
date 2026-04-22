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

  // No token found or verification failed
  req.user = null;

  // SECURITY GUARD: Allow GET requests for guests to browse public content.
  // Block any mutations (POST, PUT, DELETE) if no valid user is attached.
  if (req.method !== 'GET' && !token) {
    return res.status(401).json({ message: 'Authentication required for this action.' });
  }

  return next();
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
