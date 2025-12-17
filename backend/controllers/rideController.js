const Ride = require('../models/Ride');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const {
  calculateFare,
  calculateCarbonSavings,
  calculateDistance,
  updateBattery
} = require('../utils/calculations');

/**
 * @desc    Start a ride
 * @route   POST /api/rides/start
 * @access  Private
 */
exports.startRide = async (req, res, next) => {
  try {
    const { vehicleId, startLat, startLng, startAddress } = req.body;

    if (!vehicleId || !startLat || !startLng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicle ID and start location'
      });
    }

    // Check if user has a reserved ride for this vehicle
    let ride = await Ride.findOne({
      userId: req.user._id,
      vehicleId: vehicleId,
      status: 'reserved'
    });

    // Get vehicle
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if vehicle is available or reserved
    if (vehicle.status !== 'available' && vehicle.status !== 'reserved') {
      return res.status(400).json({
        success: false,
        message: `Vehicle is currently ${vehicle.status}`
      });
    }

    if (ride) {
      // Update existing reserved ride to active
      ride.startLocation = {
        type: 'Point',
        coordinates: [parseFloat(startLng), parseFloat(startLat)],
        address: startAddress || 'Current Location'
      };
      ride.startTime = Date.now();
      ride.status = 'active';
      await ride.save();
    } else {
      // Create new ride if no reservation exists
      ride = await Ride.create({
        userId: req.user._id,
        vehicleId: vehicle._id,
        startLocation: {
          type: 'Point',
          coordinates: [parseFloat(startLng), parseFloat(startLat)],
          address: startAddress || 'Current Location'
        },
        startTime: Date.now(),
        status: 'active'
      });
    }

    // Update vehicle status
    vehicle.status = 'in-use';
    vehicle.currentRideId = ride._id;
    await vehicle.save();

    // Populate vehicle details
    await ride.populate('vehicleId', 'vehicleNumber type brand model battery');

    res.status(200).json({
      success: true,
      message: 'Ride started successfully',
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    End a ride
 * @route   POST /api/rides/:id/end
 * @access  Private
 */
exports.endRide = async (req, res, next) => {
  try {
    const { endLat, endLng, endAddress } = req.body;

    if (!endLat || !endLng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide end location'
      });
    }

    // Get ride
    const ride = await Ride.findById(req.params.id).populate('vehicleId');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user owns this ride
    if (ride.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to end this ride'
      });
    }

    // Check if ride is active
    if (ride.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Ride is not active'
      });
    }

    // Validate start location exists
    if (!ride.startLocation || !ride.startLocation.coordinates || ride.startLocation.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start location data'
      });
    }

    // Calculate distance
    const distance = calculateDistance(
      {
        latitude: ride.startLocation.coordinates[1],
        longitude: ride.startLocation.coordinates[0]
      },
      {
        latitude: parseFloat(endLat),
        longitude: parseFloat(endLng)
      }
    );

    // Calculate duration in minutes
    const endTime = Date.now();
    const durationMs = endTime - ride.startTime;
    const duration = Math.round(durationMs / (1000 * 60));

    // Calculate fare breakdown
    const baseFare = parseFloat(process.env.BASE_FARE) || 10;
    const perMinuteCharge = parseFloat(process.env.PER_MINUTE_CHARGE) || 2;
    const perKmCharge = parseFloat(process.env.PER_KM_CHARGE) || 5;
    
    const timeFare = Math.round(duration * perMinuteCharge * 100) / 100;
    const distanceFare = Math.round(distance * perKmCharge * 100) / 100;
    const fare = Math.round((baseFare + timeFare + distanceFare) * 100) / 100;

    // Calculate carbon savings
    const carbonSaved = calculateCarbonSavings(distance);

    // Update ride
    ride.endLocation = {
      type: 'Point',
      coordinates: [parseFloat(endLng), parseFloat(endLat)],
      address: endAddress || 'Not provided'
    };
    ride.endTime = endTime;
    ride.duration = duration;
    ride.distance = distance;
    ride.fare = fare;
    ride.baseFare = baseFare;
    ride.distanceFare = distanceFare;
    ride.carbonSaved = carbonSaved;
    ride.status = 'completed';
    ride.isPaid = true; // Auto-mark as paid (simulated payment)

    await ride.save();

    // Update vehicle
    const vehicle = await Vehicle.findById(ride.vehicleId);
    vehicle.status = 'available';
    vehicle.currentRideId = null;
    vehicle.location = ride.endLocation;
    vehicle.totalKmTraveled += distance;
    
    // Update battery based on distance
    vehicle.battery = updateBattery(vehicle.battery, distance, vehicle.type);
    
    await vehicle.save();

    // Update user stats and handle reward points & wallet
    const user = await User.findById(req.user._id);
    
    // Auto-redeem reward points (1 point = ₹1 discount)
    let pointsRedeemed = 0;
    let finalFare = fare;
    let originalFare = fare;
    
    if (user.rewardPoints > 0) {
      pointsRedeemed = Math.min(user.rewardPoints, Math.floor(fare));
      finalFare = fare - pointsRedeemed;
      user.rewardPoints -= pointsRedeemed;
    }
    
    // Check wallet balance
    if (user.walletBalance < finalFare) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance. Required: ₹${finalFare.toFixed(2)}, Available: ₹${user.walletBalance.toFixed(2)}. Please add money to continue.`
      });
    }
    
    // Deduct from wallet
    user.walletBalance -= finalFare;
    
    // Calculate 10% cashback on final fare paid
    const pointsEarned = Math.floor(finalFare * 0.1);
    user.rewardPoints += pointsEarned;
    
    // Update other user stats
    user.totalRides += 1;
    user.carbonSaved += carbonSaved;
    user.totalDistance += distance;
    await user.save();
    
    // Update ride with reward points info
    ride.fare = finalFare;
    ride.pointsEarned = pointsEarned;
    ride.pointsRedeemed = pointsRedeemed;
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully',
      data: {
        ride,
        summary: {
          duration: `${duration} mins`,
          distance: `${distance} km`,
          originalFare: `₹${originalFare.toFixed(2)}`,
          pointsRedeemed: pointsRedeemed,
          finalFare: `₹${finalFare.toFixed(2)}`,
          carbonSaved: `${carbonSaved.toFixed(2)} kg CO₂`,
          pointsEarned: pointsEarned,
          totalPoints: user.rewardPoints,
          walletBalance: user.walletBalance
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's ride history
 * @route   GET /api/rides
 * @access  Private
 */
exports.getRideHistory = async (req, res, next) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const rides = await Ride.find(query)
      .populate('vehicleId', 'vehicleNumber type brand model name')
      .sort('-reservedAt -createdAt')
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

/**
 * @desc    Get single ride details
 * @route   GET /api/rides/:id
 * @access  Private
 */
exports.getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('vehicleId', 'vehicleNumber type brand model')
      .populate('userId', 'name email');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check authorization (user can see own rides, admin can see all)
    if (ride.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ride'
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active ride
 * @route   GET /api/rides/active/current
 * @access  Private
 */
exports.getActiveRide = async (req, res, next) => {
  try {
    const ride = await Ride.findOne({
      userId: req.user._id,
      status: { $in: ['reserved', 'active'] } // Include both reserved and active
    }).populate('vehicleId', 'vehicleNumber type brand model battery location name');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'No active or reserved ride found'
      });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Rate a completed ride
 * @route   POST /api/rides/:id/rate
 * @access  Private
 */
exports.rateRide = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a rating between 1 and 5'
      });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check ownership
    if (ride.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to rate this ride'
      });
    }

    // Check if ride is completed
    if (ride.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed rides'
      });
    }

    // Check if already rated
    if (ride.rating) {
      return res.status(400).json({
        success: false,
        message: 'Ride already rated'
      });
    }

    ride.rating = rating;
    ride.feedback = feedback || '';
    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: ride
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel a ride
 * @route   POST /api/rides/:id/cancel
 * @access  Private
 */
exports.cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check ownership
    if (ride.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ride'
      });
    }

    // Can only cancel reserved or active rides
    if (!['reserved', 'active'].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel reserved or active rides'
      });
    }

    // Update ride status
    ride.status = 'cancelled';
    await ride.save();

    // Free up vehicle
    const vehicle = await Vehicle.findById(ride.vehicleId);
    if (vehicle) {
      vehicle.status = 'available';
      vehicle.currentRideId = null;
      await vehicle.save();
    }

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      data: ride
    });
  } catch (error) {
    next(error);
  }
};
