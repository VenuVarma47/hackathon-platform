/**
 * JWT Token Generator Utility
 * Hackathon Management Platform
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JSON Web Token (JWT) signed with user ID
 * @param {string} id - Mongoose User ObjectId
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'hackathon_platform_jwt_secret_key_2026_secure',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d'
    }
  );
};

module.exports = generateToken;
