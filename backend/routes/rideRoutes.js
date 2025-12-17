const express = require('express');
const router = express.Router();
const {
  startRide,
  endRide,
  getRideHistory,
  getRide,
  getActiveRide,
  rateRide,
  cancelRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

// All ride routes require authentication
router.use(protect);

router.post('/start', startRide);
router.get('/', getRideHistory);
router.get('/active/current', getActiveRide);
router.get('/:id', getRide);
router.post('/:id/end', endRide);
router.post('/:id/rate', rateRide);
router.post('/:id/cancel', cancelRide);

module.exports = router;
