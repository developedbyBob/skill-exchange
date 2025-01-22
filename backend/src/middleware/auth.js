// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    console.log('\n=== AUTH MIDDLEWARE ===');
    console.log('Authorization Header:', req.headers.authorization);
    
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token);
    }

    if (!token) {
      console.error('No token found');
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
        details: 'No token provided'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      const user = await User.findById(decoded.id).select('-password');
      console.log('User found:', user);
      
      if (!user) {
        console.error('No user found with decoded ID:', decoded.id);
        return res.status(401).json({
          success: false,
          error: 'User not found',
          details: `No user exists with ID: ${decoded.id}`
        });
      }

      // Attach user to request object
      req.user = user;

      console.log('=== END AUTH MIDDLEWARE ===\n');
      next();
    } catch (error) {
      console.error('Token verification error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      let errorMessage = 'Not authorized to access this route';
      if (error.name === 'JsonWebTokenError') {
        errorMessage = 'Invalid token';
      } else if (error.name === 'TokenExpiredError') {
        errorMessage = 'Token expired';
      }

      return res.status(401).json({
        success: false,
        error: errorMessage,
        details: error.message
      });
    }
  } catch (error) {
    console.error('Unexpected auth middleware error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      success: false,
      error: 'Server Error',
      details: error.message
    });
  }
};

module.exports = protect;