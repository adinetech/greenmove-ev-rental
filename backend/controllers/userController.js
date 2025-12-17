const User = require('../models/User');
const Ride = require('../models/Ride');

/**
 * @desc    Get user dashboard stats
 * @route   GET /api/users/dashboard
 * @access  Private
 */
exports.getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Get ride statistics
    const totalRides = await Ride.countDocuments({
      userId: req.user._id,
      status: 'completed'
    });

    const ridesThisMonth = await Ride.countDocuments({
      userId: req.user._id,
      status: 'completed',
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    // Calculate total spent
    const spendingData = await Ride.aggregate([
      {
        $match: {
          userId: req.user._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$fare' },
          avgFare: { $avg: '$fare' },
          totalDistance: { $sum: '$distance' },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    const spending = spendingData[0] || {
      totalSpent: 0,
      avgFare: 0,
      totalDistance: 0,
      totalDuration: 0
    };

    // Recent rides
    const recentRides = await Ride.find({
      userId: req.user._id,
      status: 'completed'
    })
      .populate('vehicleId', 'vehicleNumber type brand model')
      .sort('-createdAt')
      .limit(5);

    // Calculate rank based on carbon saved
    const userRank = await User.countDocuments({
      carbonSaved: { $gt: user.carbonSaved }
    }) + 1;

    // Achievements
    const achievements = [];
    if (totalRides >= 1) achievements.push({ name: 'First Ride', icon: '🎉' });
    if (totalRides >= 10) achievements.push({ name: '10 Rides', icon: '⭐' });
    if (totalRides >= 50) achievements.push({ name: '50 Rides', icon: '🏆' });
    if (user.carbonSaved >= 10) achievements.push({ name: 'Eco Warrior', icon: '🌱' });
    if (user.carbonSaved >= 50) achievements.push({ name: 'Green Hero', icon: '🌿' });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          rewardPoints: user.rewardPoints,
          walletBalance: user.walletBalance
        },
        stats: {
          totalRides,
          ridesThisMonth,
          totalCarbonSaved: `${user.carbonSaved.toFixed(2)} kg CO₂`,
          totalDistance: `${user.totalDistance.toFixed(2)} km`,
          totalSpent: `₹${spending.totalSpent.toFixed(2)}`,
          avgFarePerRide: `₹${spending.avgFare.toFixed(2)}`,
          totalTimeSpent: `${Math.round(spending.totalDuration)} mins`,
          rank: userRank
        },
        achievements,
        recentRides
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add money to wallet
 * @route   POST /api/users/wallet/add
 * @access  Private
 */
exports.addMoneyToWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    if (amount > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Maximum amount per transaction is ₹10,000'
      });
    }

    // Update wallet balance
    const user = await User.findById(req.user._id);
    user.walletBalance += parseFloat(amount);
    await user.save();

    res.status(200).json({
      success: true,
      message: `₹${amount} added to wallet successfully`,
      data: {
        walletBalance: user.walletBalance,
        amountAdded: amount
      }
    });
  } catch (error) {
    next(error);
  }
};
