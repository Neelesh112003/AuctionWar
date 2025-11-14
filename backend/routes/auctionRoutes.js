const express = require('express');
const {
  getAllAuctions,
  getAuctionById,
  createAuction,
  searchAuctions,
  getBidsByAuctionId
} = require('../controllers/auctionController');
const { completeAuction } = require('../utils/auctionScheduler'); // Import from scheduler
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {cancelAuction} = require('../controllers/auctionController')

const router = express.Router();

router.get('/', getAllAuctions);
router.get('/search', searchAuctions);
router.get('/:id/bids', getBidsByAuctionId);
router.get('/:id', getAuctionById);
router.post('/', protect, upload.single('image'), createAuction);
router.patch('/:id/cancel', protect, cancelAuction);

// Manual completion route (optional - for admin use)
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const io = req.app.get('io');
    await completeAuction(req.params.id, io);
    res.json({ 
      success: true, 
      message: 'Auction completed successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error completing auction' 
    });
  }
});

module.exports = router;