const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload with user ID
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: process.env.JWT_EXPIRE || '7d' // Expiry time
    }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET); // Verify token
  } catch (error) {
    return null; // Invalid token
  }
};

module.exports = { generateToken, verifyToken }; // Export functions
