const Station = require('../models/Station');
const { getDistance } = require('geolib');

/**
 * @desc    Get all stations
 * @route   GET /api/stations
 * @access  Public
 */
exports.getAllStations = async (req, res, next) => {
  try {
    const { isActive } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const stations = await Station.find(query).sort('name');

    res.status(200).json({
      success: true,
      count: stations.length,
      data: stations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get nearby stations
 * @route   GET /api/stations/nearby?lat=12.9716&lng=77.5946&radius=10
 * @access  Public
 */
exports.getNearbyStations = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = parseFloat(radius);

    // Find stations within radius
    const stations = await Station.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusInKm * 1000
        }
      },
      isActive: true
    }).populate('vehiclesParked', 'vehicleNumber type battery');

    // Calculate distance from user
    const stationsWithDistance = stations.map(station => {
      const distance = getDistance(
        { latitude, longitude },
        { latitude: station.location.coordinates[1], longitude: station.location.coordinates[0] }
      );

      return {
        ...station.toObject(),
        distanceFromUser: Math.round(distance),
        distanceInKm: (distance / 1000).toFixed(2)
      };
    });

    res.status(200).json({
      success: true,
      count: stationsWithDistance.length,
      data: stationsWithDistance
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single station
 * @route   GET /api/stations/:id
 * @access  Public
 */
exports.getStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id)
      .populate('vehiclesParked', 'vehicleNumber type battery status');

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.status(200).json({
      success: true,
      data: station
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new station (Admin)
 * @route   POST /api/stations
 * @access  Private/Admin
 */
exports.createStation = async (req, res, next) => {
  try {
    const station = await Station.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Station created successfully',
      data: station
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update station (Admin)
 * @route   PUT /api/stations/:id
 * @access  Private/Admin
 */
exports.updateStation = async (req, res, next) => {
  try {
    const station = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Station updated successfully',
      data: station
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete station (Admin)
 * @route   DELETE /api/stations/:id
 * @access  Private/Admin
 */
exports.deleteStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    // Check if station has parked vehicles
    if (station.vehiclesParked && station.vehiclesParked.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete station with parked vehicles'
      });
    }

    await station.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Station deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
