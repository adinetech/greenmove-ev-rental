const express = require('express');
const router = express.Router();
const {
  getAllStations,
  getNearbyStations,
  getStation,
  createStation,
  updateStation,
  deleteStation
} = require('../controllers/stationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllStations);
router.get('/nearby', getNearbyStations);
router.get('/:id', getStation);

// Admin routes
router.post('/', protect, authorize('admin'), createStation);
router.put('/:id', protect, authorize('admin'), updateStation);
router.delete('/:id', protect, authorize('admin'), deleteStation);

module.exports = router;
