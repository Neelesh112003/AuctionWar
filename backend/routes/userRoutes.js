const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const userProfile = { ...req.user, coins: req.user.points };
    delete userProfile.points;

    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile' 
    });
  }
});

// @desc    Get user's auctions
// @route   GET /api/users/my-auctions
// @access  Private
router.get('/my-auctions', protect, async (req, res) => {
  try {
    const [auctions] = await db.query(`
      SELECT 
        a.*,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as total_bids,
        (SELECT u.username FROM bids b 
         JOIN users u ON b.user_id = u.id 
         WHERE b.auction_id = a.id 
         ORDER BY b.amount DESC LIMIT 1) as highest_bidder
      FROM auctions a
      WHERE a.seller_id = ?
      ORDER BY a.created_at DESC
    `, [req.user.id]);

    const formattedAuctions = auctions.map(auction => ({
      ...auction,
      current_bid: auction.highest_bid || auction.current_bid
    }));

    res.json({
      success: true,
      count: formattedAuctions.length,
      data: formattedAuctions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching auctions' 
    });
  }
});

// @desc    Get user coins balance
// @route   GET /api/users/coins
// @access  Private
router.get('/coins', protect, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT points FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, coins: rows[0].points });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coins' });
  }
});

module.exports = router;
