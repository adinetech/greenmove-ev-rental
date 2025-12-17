const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Ride = require('../models/Ride');
const Report = require('../models/Report');
const Station = require('../models/Station');

/**
 * @desc    Get admin dashboard analytics
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVehicles = await Vehicle.countDocuments();
    const totalRides = await Ride.countDocuments({ status: 'completed' });
    const totalStations = await Station.countDocuments();

    // Vehicle status breakdown
    const vehiclesByStatus = await Vehicle.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Fleet utilization
    const availableVehicles = await Vehicle.countDocuments({ status: 'available' });
    const inUseVehicles = await Vehicle.countDocuments({ status: 'in-use' });
    const utilizationRate = totalVehicles > 0 
      ? ((inUseVehicles / totalVehicles) * 100).toFixed(2)
      : 0;

    // Total carbon saved
    const carbonStats = await Ride.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCarbonSaved: { $sum: '$carbonSaved' },
          totalDistance: { $sum: '$distance' },
          totalRevenue: { $sum: '$fare' }
        }
      }
    ]);

    const stats = carbonStats[0] || {
      totalCarbonSaved: 0,
      totalDistance: 0,
      totalRevenue: 0
    };

    // Recent rides
    const recentRides = await Ride.find({ status: 'completed' })
      .populate('userId', 'name email')
      .populate('vehicleId', 'vehicleNumber type')
      .sort('-createdAt')
      .limit(10);

    // Active rides
    const activeRides = await Ride.countDocuments({ status: 'active' });

    // Pending reports
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const criticalReports = await Report.countDocuments({ 
      status: { $in: ['pending', 'in-progress'] },
      priority: 'critical'
    });

    // Low battery vehicles
    const lowBatteryVehicles = await Vehicle.countDocuments({ 
      battery: { $lt: 30 },
      isActive: true
    });

    // Rides per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ridesPerDay = await Ride.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$fare' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top users by rides
    const topUsers = await Ride.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$userId',
          rideCount: { $sum: 1 },
          totalSpent: { $sum: '$fare' }
        }
      },
      { $sort: { rideCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          rideCount: 1,
          totalSpent: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalVehicles,
          totalRides,
          totalStations,
          activeRides,
          availableVehicles,
          inUseVehicles,
          utilizationRate: `${utilizationRate}%`
        },
        sustainability: {
          totalCarbonSaved: `${stats.totalCarbonSaved.toFixed(2)} kg CO₂`,
          totalDistance: `${stats.totalDistance.toFixed(2)} km`,
          totalRevenue: `₹${stats.totalRevenue.toFixed(2)}`
        },
        alerts: {
          pendingReports,
          criticalReports,
          lowBatteryVehicles
        },
        vehiclesByStatus,
        ridesPerDay,
        topUsers,
        recentRides
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user (Admin)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
exports.getAllReports = async (req, res, next) => {
  try {
    const { status, priority, vehicleId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (vehicleId) query.vehicleId = vehicleId;

    const reports = await Report.find(query)
      .populate('vehicleId', 'vehicleNumber type brand model')
      .populate('userId', 'name email')
      .populate('resolvedBy', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update report status (Admin)
 * @route   PUT /api/admin/reports/:id
 * @access  Private/Admin
 */
exports.updateReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (status) report.status = status;
    if (adminNotes) report.adminNotes = adminNotes;

    // If resolved, set resolved timestamp and admin
    if (status === 'resolved' || status === 'closed') {
      report.resolvedAt = Date.now();
      report.resolvedBy = req.user._id;
    }

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report updated successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get sustainability reports (Admin)
 * @route   GET /api/admin/sustainability-reports
 * @access  Private/Admin
 */
exports.getSustainabilityReports = async (req, res, next) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVehicles = await Vehicle.countDocuments();
    const totalRides = await Ride.countDocuments({ status: 'completed' });

    // Aggregate stats
    const aggregateStats = await Ride.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalCarbonSaved: { $sum: '$carbonSaved' },
          totalDistance: { $sum: '$distance' },
          totalRevenue: { $sum: '$fare' },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    const stats = aggregateStats[0] || {
      totalCarbonSaved: 0,
      totalDistance: 0,
      totalRevenue: 0,
      totalDuration: 0
    };

    // Average ride duration
    const avgRideDuration = totalRides > 0 
      ? Math.round(stats.totalDuration / totalRides)
      : 0;

    // Most used vehicles
    const mostUsedVehicles = await Ride.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$vehicleId',
          rideCount: { $sum: 1 },
          totalRevenue: { $sum: '$fare' },
          totalDistance: { $sum: '$distance' }
        }
      },
      { $sort: { rideCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: '_id',
          as: 'vehicle'
        }
      },
      { $unwind: '$vehicle' },
      {
        $project: {
          vehicleNumber: '$vehicle.vehicleNumber',
          brand: '$vehicle.brand',
          model: '$vehicle.model',
          type: '$vehicle.type',
          rideCount: 1,
          totalRevenue: 1,
          totalDistance: 1
        }
      }
    ]);

    // Fleet utilization
    const activeVehicles = await Vehicle.countDocuments({ status: 'in-use' });
    const utilizationRate = totalVehicles > 0 
      ? ((activeVehicles / totalVehicles) * 100).toFixed(1)
      : 0;
    
    const avgRidesPerVehicle = totalVehicles > 0 
      ? Math.round(totalRides / totalVehicles)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalVehicles,
        totalRides,
        totalCarbonSaved: stats.totalCarbonSaved,
        totalDistance: stats.totalDistance,
        totalRevenue: stats.totalRevenue,
        avgRideDuration,
        mostUsedVehicles,
        utilizationRate,
        activeVehicles,
        avgRidesPerVehicle
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all rides (Admin)
 * @route   GET /api/admin/rides
 * @access  Private/Admin
 */
exports.getAllRides = async (req, res, next) => {
  try {
    const { status, userId, vehicleId, limit = 50, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (userId) query.userId = userId;
    if (vehicleId) query.vehicleId = vehicleId;

    const rides = await Ride.find(query)
      .populate('userId', 'name email')
      .populate('vehicleId', 'vehicleNumber type')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Ride.countDocuments(query);

    res.status(200).json({
      success: true,
      count: rides.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: rides
    });
  } catch (error) {
    next(error);
  }
};
