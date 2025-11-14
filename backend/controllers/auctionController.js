const db = require('../config/db');

// Get all active auctions
const getAllAuctions = async (req, res) => {
  try {
    const [auctions] = await db.query(`
      SELECT 
        a.*,
        u.username as seller_name,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as total_bids
      FROM auctions a
      JOIN users u ON a.seller_id = u.id
      WHERE a.status = 'active' AND a.end_time > NOW()
      ORDER BY a.created_at DESC
    `);

    // Prefer highest bid if exists
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
};

// Get auction by ID with bids
const getAuctionById = async (req, res) => {
  try {
    const [auctions] = await db.query(`
      SELECT 
        a.*,
        u.username as seller_name,
        u.email as seller_email,
        u.phone as seller_phone
      FROM auctions a
      JOIN users u ON a.seller_id = u.id
      WHERE a.id = ?
    `, [req.params.id]);

    if (auctions.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Auction not found' 
      });
    }

    const [bids] = await db.query(`
      SELECT 
        b.*,
        u.username as bidder_name
      FROM bids b
      JOIN users u ON b.user_id = u.id
      WHERE b.auction_id = ?
      ORDER BY b.amount DESC, b.created_at DESC
    `, [req.params.id]);

    res.json({
      success: true,
      data: {
        auction: auctions[0],
        bids
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching auction details' 
    });
  }
};

// Get bids by auction ID only
const getBidsByAuctionId = async (req, res) => {
  try {
    const [bids] = await db.query(`
      SELECT 
        b.*,
        u.username as bidder_name
      FROM bids b
      JOIN users u ON b.user_id = u.id
      WHERE b.auction_id = ?
      ORDER BY b.amount DESC, b.created_at DESC
    `, [req.params.id]);

    res.json({
      success: true,
      data: bids
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching bids' 
    });
  }
};

// Create new auction
const createAuction = async (req, res) => {
  try {
    const { title, description, starting_bid, end_time, category } = req.body;
    const seller_id = req.user.id;

    // Handle optional image upload
    let image_url = null;
    if (req.file) {
      image_url = req.file.filename;
    }

    // Validate required fields
    if (!title || !starting_bid || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, starting bid and end time'
      });
    }

    if (starting_bid < 1) {
      return res.status(400).json({
        success: false,
        message: 'Starting bid must be at least 1 point'
      });
    }

    const endDate = new Date(end_time);
    if (endDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'End time must be in the future'
      });
    }

    const [result] = await db.query(
      `INSERT INTO auctions 
      (title, description, starting_bid, current_bid, end_time, seller_id, image_url, category, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        starting_bid,
        starting_bid,
        end_time,
        seller_id,
        image_url,
        category || 'Other',
        'active'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Auction created successfully',
      data: {
        id: result.insertId,
        title,
        starting_bid,
        end_time,
        category: category || 'Other',
        image_url
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating auction'
    });
  }
};

// Search auctions with filters
const searchAuctions = async (req, res) => {
  try {
    const { query, category } = req.query;

    let sql = `
      SELECT 
        a.*,
        u.username as seller_name,
        (SELECT MAX(amount) FROM bids WHERE auction_id = a.id) as highest_bid,
        (SELECT COUNT(*) FROM bids WHERE auction_id = a.id) as total_bids
      FROM auctions a
      JOIN users u ON a.seller_id = u.id
      WHERE a.status = 'active' AND a.end_time > NOW()
    `;

    const params = [];

    if (query) {
      sql += ' AND (a.title LIKE ? OR a.description LIKE ?)';
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm);
    }

    if (category && category !== 'All') {
      sql += ' AND a.category = ?';
      params.push(category);
    }

    sql += ' ORDER BY a.created_at DESC';

    const [auctions] = await db.query(sql, params);

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
      message: 'Error searching auctions' 
    });
  }
};

// Complete auction transaction and notifications
const completeAuction = async (auctionId) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [auctionRows] = await connection.query('SELECT * FROM auctions WHERE id = ?', [auctionId]);
    if (auctionRows.length === 0) throw new Error('Auction not found');
    const auction = auctionRows[0];

    if (auction.status === 'completed') {
      throw new Error('Auction already completed');
    }

    const [bids] = await connection.query(
      'SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC',
      [auctionId]
    );

    if (bids.length === 0) {
      await connection.query('UPDATE auctions SET status = ? WHERE id = ?', ['completed', auctionId]);
      await connection.commit();
      return;
    }

    const winnerBid = bids[0];
    const winnerId = winnerBid.user_id;
    const winnerAmount = winnerBid.amount;
    const sellerId = auction.seller_id;

    const [winner] = await connection.query('SELECT points FROM users WHERE id = ?', [winnerId]);
    if (winner.length === 0) throw new Error('Winner user not found');
    if (winner[0].points < winnerAmount) throw new Error('Winner has insufficient coins');

    await connection.query('UPDATE users SET points = points - ? WHERE id = ?', [winnerAmount, winnerId]);

    const [seller] = await connection.query('SELECT points FROM users WHERE id = ?', [sellerId]);
    if (seller.length === 0) throw new Error('Seller not found');

    await connection.query('UPDATE users SET points = points + ? WHERE id = ?', [winnerAmount, sellerId]);

    await connection.query('UPDATE auctions SET status = ? WHERE id = ?', ['completed', auctionId]);

    // Notify seller
    await connection.query(`
      INSERT INTO notifications (user_id, auction_id, type, message)
      VALUES (?, ?, 'auction_complete', ?)`,
      [
        sellerId,
        auctionId,
        `Your auction "${auction.title}" has completed. Winner is bidder ID ${winnerId}.`
      ]
    );

    // Notify winner
    await connection.query(`
      INSERT INTO notifications (user_id, auction_id, type, message)
      VALUES (?, ?, 'win', ?)`,
      [
        winnerId,
        auctionId,
        `You won the auction "${auction.title}" with a bid of ${winnerAmount} points.`
      ]
    );

    // Notify other bidders
    for (let i = 1; i < bids.length; i++) {
      const lossBid = bids[i];
      await connection.query(`
      INSERT INTO notifications (user_id, auction_id, type, message)
      VALUES (?, ?, 'loss', ?)`,
        [
          lossBid.user_id,
          auctionId,
          `You lost the auction "${auction.title}". Winner is bidder ID ${winnerId}.`
        ]
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Cancel an auction
const cancelAuction = async (req, res) => {
  try {
    const auctionId = req.params.id;
    const userId = req.user.id;

    const [auctions] = await db.query('SELECT * FROM auctions WHERE id = ?', [auctionId]);
    if (auctions.length === 0) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const auction = auctions[0];

    if (auction.seller_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this auction' });
    }

    if (auction.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Auction already cancelled' });
    }

    await db.query('UPDATE auctions SET status = ? WHERE id = ?', ['cancelled', auctionId]);

    res.json({ success: true, message: 'Auction cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { 
  getAllAuctions, 
  getAuctionById, 
  getBidsByAuctionId,
  createAuction,
  searchAuctions,
  cancelAuction
};
