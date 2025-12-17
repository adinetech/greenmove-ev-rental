const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, 'Vehicle number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['scooter', 'bike', 'ev'],
    required: [true, 'Vehicle type is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
  },
  
  // GeoJSON for location (supports geospatial queries)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Location coordinates are required']
    }
  },
  
  // Vehicle Status
  status: {
    type: String,
    enum: ['available', 'reserved', 'in-use', 'maintenance', 'charging'],
    default: 'available'
  },
  battery: {
    type: Number,
    required: [true, 'Battery level is required'],
    min: [0, 'Battery cannot be negative'],
    max: [100, 'Battery cannot exceed 100'],
    default: 100
  },
  range: {
    type: Number, // km left with current battery
    default: 50
  },
  
  // Maintenance Info
  lastServiced: {
    type: Date,
    default: Date.now
  },
  totalKmTraveled: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'excellent'
  },
  
  // Current Assignment
  currentRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: null
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    default: null
  },
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
vehicleSchema.index({ location: '2dsphere' });

// Index for faster status queries
vehicleSchema.index({ status: 1, battery: 1 });

// Virtual for display name
vehicleSchema.virtual('displayName').get(function() {
  return `${this.brand} ${this.model} (${this.vehicleNumber})`;
});

// Virtual for remaining range based on current battery
vehicleSchema.virtual('remainingRange').get(function() {
  return Math.round((this.battery / 100) * this.range);
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
