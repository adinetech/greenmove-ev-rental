const express = require('express');
const router = express.Router();
const { getDashboard, addMoneyToWallet } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All user routes require authentication
router.use(protect);

router.get('/dashboard', getDashboard);
router.post('/wallet/add', addMoneyToWallet);

module.exports = router;
