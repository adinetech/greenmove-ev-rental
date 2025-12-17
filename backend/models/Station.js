const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true
  },
  
  // GeoJSON Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Station coordinates are required']
    }
  },
  address: {
    type: String,
    required: [true, 'Station address is required']
  },
  
  // Capacity
  totalSlots: {
    type: Number,
    required: [true, 'Total slots are required'],
    min: [1, 'Must have at least 1 slot']
  },
  availableSlots: {
    type: Number,
    required: true,
    min: [0, 'Available slots cannot be negative']
  },
  chargingPoints: {
    type: Number,
    default: 0,
    min: [0, 'Charging points cannot be negative']
  },
  
  // Vehicles at Station
  vehiclesParked: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  
  // Station Status
  isActive: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    open: {
      type: String,
      default: '00:00'
    },
    close: {
      type: String,
      default: '23:59'
    }
  },
  
  // Metadata
  amenities: [{
    type: String,
    enum: ['parking', 'charging', 'repair', 'shelter', 'lighting']
  }],
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for geospatial queries
stationSchema.index({ location: '2dsphere' });

// Virtual for occupancy percentage
stationSchema.virtual('occupancyRate').get(function() {
  return Math.round(((this.totalSlots - this.availableSlots) / this.totalSlots) * 100);
});

// Update available slots when vehicles array changes
stationSchema.pre('save', function(next) {
  if (this.isModified('vehiclesParked')) {
    this.availableSlots = this.totalSlots - this.vehiclesParked.length;
  }
  next();
});

module.exports = mongoose.model('Station', stationSchema);
