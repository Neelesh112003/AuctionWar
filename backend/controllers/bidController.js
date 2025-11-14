const db = require('../config/db');

// Place a bid
const placeBid = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const { auction_id, amount } = req.body;
    const user_id = req.user.id;

    // Validate inputs
    if (!auction_id || !amount) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide auction ID and bid amount' 
      });
    }

    // Check if auction is active and ongoing
    const [auctions] = await connection.query(
      'SELECT * FROM auctions WHERE id = ? AND status = "active" AND end_time > NOW()',
      [auction_id]
    );

    if (auctions.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Auction not found or already ended' 
      });
    }

    const auction = auctions[0];

    // Prevent self-bidding
    if (auction.seller_id === user_id) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot bid on your own auction' 
      });
    }

    // Get current highest bid or starting bid
    const [highestBids] = await connection.query(
      'SELECT MAX(amount) as highest FROM bids WHERE auction_id = ?',
      [auction_id]
    );

    const currentHighest = highestBids[0].highest || auction.starting_bid;

    // Validate bid amount is higher
    if (amount <= currentHighest) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Bid must be higher than current bid of ${currentHighest} points` 
      });
    }

    // Check user points balance
    if (req.user.points < amount) {
      await connection.rollback();
      return res.status(400).json({ 
        success: false, 
        message: `Insufficient points. You have ${req.user.points} points but need ${amount} points` 
      });
    }

    // Insert new bid
    const [result] = await connection.query(
      'INSERT INTO bids (auction_id, user_id, amount) VALUES (?, ?, ?)',
      [auction_id, user_id, amount]
    );

    // Update current highest bid in auctions
    await connection.query(
      'UPDATE auctions SET current_bid = ? WHERE id = ?',
      [amount, auction_id]
    );

    await connection.commit();

    // Emit new bid event via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(`auction-${auction_id}`).emit('newBid', {
        auction_id,
        amount,
        bidder: req.user.username,
        bidder_id: user_id,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: {
        id: result.insertId,
        auction_id,
        amount,
        bidder: req.user.username
      }
    });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ 
      success: false, 
      message: 'Error placing bid' 
    });
  } finally {
    connection.release();
  }
};

// Get bids by current user
const getUserBids = async (req, res) => {
  try {
    const [bids] = await db.query(`
      SELECT 
        b.*,
        a.title as auction_title,
        a.status as auction_status,
        a.end_time,
        a.image_url,
        a.category,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid,
        CASE 
          WHEN b.amount = (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) 
          THEN true 
          ELSE false 
        END as is_winning
      FROM bids b
      JOIN auctions a ON b.auction_id = a.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bids' 
    });
  }
};

// Get bids by auction ID
const getBidsByAuction = async (req, res) => {
  const { auctionId } = req.params;
  try {
    const [bids] = await db.query(`
      SELECT 
        b.*,
        u.username as bidder_name
      FROM bids b
      JOIN users u ON b.user_id = u.id
      WHERE b.auction_id = ?
      ORDER BY b.amount DESC, b.created_at DESC
    `, [auctionId]);

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bids for auction'
    });
  }
};

module.exports = { placeBid, getUserBids, getBidsByAuction };
