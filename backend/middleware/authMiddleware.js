const { verifyToken } = require('../config/jwt');
const db = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token'
        });
      }

      const [users] = await db.query(
        'SELECT id, username, email, phone, points, created_at FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = users[0];
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
