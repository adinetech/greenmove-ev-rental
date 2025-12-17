const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getAllUsers,
  updateUser,
  getAllReports,
  updateReport,
  getAllRides,
  getSustainabilityReports
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.get('/reports', getAllReports);
router.put('/reports/:id', updateReport);
router.get('/rides', getAllRides);
router.get('/sustainability-reports', getSustainabilityReports);

module.exports = router;
