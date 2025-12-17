const express = require('express');
const router = express.Router();
const {
  getNearbyVehicles,
  getVehicle,
  reserveVehicle,
  getFareEstimate,
  reportIssue,
  getAllVehicles,
  updateVehicle,
  addVehicle
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/nearby', getNearbyVehicles);
router.get('/:id', getVehicle);

// Protected user routes
router.post('/:id/reserve', protect, reserveVehicle);
router.post('/:id/estimate', protect, getFareEstimate);
router.post('/:id/report', protect, reportIssue);

// Admin routes
router.get('/', protect, authorize('admin'), getAllVehicles);
router.post('/', protect, authorize('admin'), addVehicle);
router.put('/:id', protect, authorize('admin'), updateVehicle);

module.exports = router;
