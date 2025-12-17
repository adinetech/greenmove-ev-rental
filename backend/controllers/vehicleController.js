const Vehicle = require('../models/Vehicle');
const Report = require('../models/Report');
const { estimateFare } = require('../utils/calculations');
const { getDistance } = require('geolib');

/**
 * @desc    Get all available vehicles nearby
 * @route   GET /api/vehicles/nearby?lat=12.9716&lng=77.5946&radius=5
 * @access  Public
 */
exports.getNearbyVehicles = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    // Find vehicles within radius using geospatial query
    const vehicles = await Vehicle.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInKm * 1000 // Convert km to meters
        }
      },
      status: { $in: ['available', 'reserved'] }, // Show available and reserved
      battery: { $gte: 20 }, // At least 20% battery
      isActive: true
    }).select('-__v');

    // Calculate distance from user for each vehicle
    const vehiclesWithDistance = vehicles.map(vehicle => {
      const distance = getDistance(
        { latitude, longitude },
        { latitude: vehicle.location.coordinates[1], longitude: vehicle.location.coordinates[0] }
      );

      return {
        ...vehicle.toObject(),
        distanceFromUser: Math.round(distance), // in meters
        distanceInKm: (distance / 1000).toFixed(2)
      };
    });

    res.status(200).json({
      success: true,
      count: vehiclesWithDistance.length,
      data: vehiclesWithDistance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single vehicle details
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reserve a vehicle
 * @route   POST /api/vehicles/:id/reserve
 * @access  Private
 */
exports.reserveVehicle = async (req, res, next) => {
  try {
    const Ride = require('../models/Ride');
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Check if vehicle is available
    if (vehicle.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Vehicle is currently ${vehicle.status}`
      });
    }

    // Check battery level
    if (vehicle.battery < 20) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle battery too low. Please choose another vehicle.'
      });
    }

    // Check if user already has an active or reserved ride
    const existingRide = await Ride.findOne({
      userId: req.user._id,
      status: { $in: ['reserved', 'active'] }
    });

    if (existingRide) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active or reserved ride'
      });
    }

    // Create ride record with reserved status
    const ride = await Ride.create({
      userId: req.user._id,
      vehicleId: vehicle._id,
      status: 'reserved',
      reservedAt: new Date()
    });

    // Update vehicle status to reserved
    vehicle.status = 'reserved';
    await vehicle.save();

    // Set timeout to release reservation after 5 minutes
    setTimeout(async () => {
      const r = await Ride.findById(ride._id);
      if (r && r.status === 'reserved') {
        r.status = 'cancelled';
        r.endTime = new Date();
        await r.save();
        
        const v = await Vehicle.findById(vehicle._id);
        if (v && v.status === 'reserved') {
          v.status = 'available';
          await v.save();
        }
      }
    }, parseInt(process.env.RESERVATION_TIMEOUT || 5) * 60 * 1000);

    res.status(200).json({
      success: true,
      message: 'Vehicle reserved successfully. You have 5 minutes to start the ride.',
      data: { vehicle, ride }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get fare estimate
 * @route   POST /api/vehicles/:id/estimate
 * @access  Private
 */
exports.getFareEstimate = async (req, res, next) => {
  try {
    const { userLat, userLng, destLat, destLng } = req.body;

    if (!userLat || !userLng || !destLat || !destLng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user and destination coordinates'
      });
    }

    // Calculate distance
    const distanceInMeters = getDistance(
      { latitude: parseFloat(userLat), longitude: parseFloat(userLng) },
      { latitude: parseFloat(destLat), longitude: parseFloat(destLng) }
    );

    const distanceKm = distanceInMeters / 1000;

    // Get fare estimate
    const fareBreakdown = estimateFare(distanceKm);
    const carbonSavings = (distanceKm * 0.108).toFixed(2);

    res.status(200).json({
      success: true,
      data: {
        distance: distanceKm.toFixed(2) + ' km',
        ...fareBreakdown,
        estimatedCarbonSavings: carbonSavings + ' kg CO₂'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Report vehicle issue
 * @route   POST /api/vehicles/:id/report
 * @access  Private
 */
exports.reportIssue = async (req, res, next) => {
  try {
    const { issueType, description, images, location } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    // Create report
    const report = await Report.create({
      vehicleId: vehicle._id,
      userId: req.user._id,
      issueType,
      description,
      images: images || [],
      location: location || vehicle.location
    });

    // If critical issue, set vehicle to maintenance
    if (report.priority === 'critical' || report.priority === 'high') {
      vehicle.status = 'maintenance';
      await vehicle.save();
    }

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully. Our team will address it soon.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all vehicles (Admin)
 * @route   GET /api/vehicles
 * @access  Private/Admin
 */
exports.getAllVehicles = async (req, res, next) => {
  try {
    const { status, type, minBattery } = req.query;

    // Build query
    const query = { isActive: true };
    if (status) query.status = status;
    if (type) query.type = type;
    if (minBattery) query.battery = { $gte: parseInt(minBattery) };

    const vehicles = await Vehicle.find(query)
      .populate('currentRideId', 'userId startTime')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vehicle (Admin)
 * @route   PUT /api/vehicles/:id
 * @access  Private/Admin
 */
exports.updateVehicle = async (req, res, next) => {
  try {
    const updates = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add new vehicle (Admin)
 * @route   POST /api/vehicles
 * @access  Private/Admin
 */
exports.addVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      data: vehicle
    });
  } catch (error) {
    next(error);
  }
};
