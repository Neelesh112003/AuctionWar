const express = require('express');
const { placeBid, getUserBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, placeBid);
router.get('/my-bids', protect, getUserBids);

module.exports = router;