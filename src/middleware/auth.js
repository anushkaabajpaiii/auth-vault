const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Support standard header key in any case
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'No access token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 🔐 Verify access token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from DB and attach to request
    const user = await User.findById(decoded.sub).select('-passwordHash');
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: 'User is inactive or no longer exists' });
    }

    // make both user and decoded token available to next middleware/route
    req.user = user;
    req.auth = decoded; // contains sub, role, email, iat, exp

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired access token' });
  }
};

// Role-based access control
const requireRole = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: insufficient permissions',
      });
    }
    next();
  };
};

module.exports = { auth, requireRole };
