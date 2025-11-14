const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    // Join auction room
    socket.on('joinAuction', (auctionId) => {
      socket.join(`auction-${auctionId}`);
      
      // Notify room
      socket.to(`auction-${auctionId}`).emit('userJoined', {
        message: 'A user joined the auction',
        auctionId,
        timestamp: new Date()
      });
    });

    // Leave auction room
    socket.on('leaveAuction', (auctionId) => {
      socket.leave(`auction-${auctionId}`);
    });

    // Handle custom events
    socket.on('bidUpdate', (data) => {
      socket.to(`auction-${data.auctionId}`).emit('newBid', data);
    });

    // Disconnect
    socket.on('disconnect', () => {
      // no-op
    });
  });
};

module.exports = { setupSocketHandlers };
