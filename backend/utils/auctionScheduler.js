const cron = require('node-cron');
const db = require('../config/db');

// Complete auction function
const completeAuction = async (auctionId, io) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Get auction details
    const [auctionRows] = await connection.query(
      'SELECT * FROM auctions WHERE id = ?', 
      [auctionId]
    );
    
    if (auctionRows.length === 0) {
      throw new Error('Auction not found');
    }
    
    const auction = auctionRows[0];

    if (auction.status === 'completed') {
      throw new Error('Auction already completed');
    }

    // Get all bids ordered by highest amount
    const [bids] = await connection.query(
      'SELECT * FROM bids WHERE auction_id = ? ORDER BY amount DESC',
      [auctionId]
    );

    if (bids.length === 0) {
      // Mark auction as completed with no winner
      await connection.query(
        'UPDATE auctions SET status = ? WHERE id = ?', 
        ['completed', auctionId]
      );
      await connection.commit();

      // Emit socket event
      if (io) {
        io.to(`auction-${auctionId}`).emit('auctionCompleted', {
          auctionId,
          message: 'Auction ended with no bids',
          winner: null
        });
      }
      
      return;
    }

    // Get winner details
    const winnerBid = bids[0];
    const winnerId = winnerBid.user_id;
    const winnerAmount = winnerBid.amount;
    const sellerId = auction.seller_id;

    // Check winner has enough points
    const [winner] = await connection.query(
      'SELECT points, username FROM users WHERE id = ?', 
      [winnerId]
    );
    
    if (winner.length === 0) {
      throw new Error('Winner user not found');
    }
    
    if (winner[0].points < winnerAmount) {
      throw new Error(`Winner has insufficient points. Has: ${winner[0].points}, Needs: ${winnerAmount}`);
    }

    // Deduct points from winner
    await connection.query(
      'UPDATE users SET points = points - ? WHERE id = ?', 
      [winnerAmount, winnerId]
    );

    // Add points to seller
    await connection.query(
      'UPDATE users SET points = points + ? WHERE id = ?', 
      [winnerAmount, sellerId]
    );

    // Update auction status and winner
    await connection.query(
      'UPDATE auctions SET status = ?, winner_id = ? WHERE id = ?', 
      ['completed', winnerId, auctionId]
    );

    await connection.commit();

    // Emit real-time notifications via Socket.io
    if (io) {
      // Notify auction room
      io.to(`auction-${auctionId}`).emit('auctionCompleted', {
        auctionId,
        winnerId,
        winnerName: winner[0].username,
        winnerAmount,
        message: `Auction completed! Winner: ${winner[0].username}`
      });

      // Notify winner
      io.emit('userNotification', {
        userId: winnerId,
        type: 'win',
        auctionId,
        message: `🎉 You won "${auction.title}" for ${winnerAmount} points!`
      });

      // Notify seller
      io.emit('userNotification', {
        userId: sellerId,
        type: 'sale',
        auctionId,
        message: `💰 Your auction "${auction.title}" sold for ${winnerAmount} points!`
      });
    }

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Start the scheduler
const startAuctionScheduler = (io) => {
  // Run every minute to check expired auctions
  cron.schedule('* * * * *', async () => {
    try {
      // Get all active auctions that have ended
      const [expiredAuctions] = await db.query(`
        SELECT id, title, end_time 
        FROM auctions 
        WHERE status = 'active' 
        AND end_time <= NOW()
      `);

      if (expiredAuctions.length > 0) {
        for (const auction of expiredAuctions) {
          try {
            await completeAuction(auction.id, io);
          } catch (error) {
            // Error silently ignored in scheduler
          }
        }
      }
    } catch (error) {
      // Scheduler error silently ignored
    }
  });
};

module.exports = { startAuctionScheduler, completeAuction };
