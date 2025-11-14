const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { generateToken } = require('../config/jwt');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    // Validate required inputs
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide username, email and password' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user exists by email or username
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      const field = existingUsers[0].email === email ? 'email' : 'username';
      return res.status(400).json({ 
        success: false, 
        message: `User already exists with this ${field}` 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user with default points
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, phone, points) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone || null, 1000]
    );

    // Generate JWT token
    const token = generateToken(result.insertId);

    res.status(201).json({
      success: true,
      message: 'User registered successfully! You received 1000 free points.',
      data: {
        id: result.insertId,
        username,
        email,
        phone: phone || null,
        points: 1000,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// Login existing user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input presence
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        points: user.points,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Get current authenticated user
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = { register, login, getMe };
