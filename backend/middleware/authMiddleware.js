/**
 * Authentication & Role Authorization Middleware
 * Hackathon Management Platform
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes and verify JWT tokens
 */
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string from header "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token payload using secret
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'hackathon_platform_jwt_secret_key_2026_secure'
      );

      // Fetch user from DB excluding password and attach to request object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User account associated with this token no longer exists.'
        });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token.'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no Bearer token provided.'
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Authorization Middleware
 * @param  {...string} roles - Permitted user roles (e.g. 'Admin', 'Organizer', 'Judge', 'Participant')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required prior to authorization.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is forbidden from accessing this resource.`
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize
};
