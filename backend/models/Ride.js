const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID is required']
  },
  
  // Journey Locations (GeoJSON)
  startLocation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    },
    address: String
  },
  endLocation: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number]
    },
    address: String
  },
  
  // Timing
  reservedAt: {
    type: Date,
    default: null
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  
  // Metrics
  distance: {
    type: Number, // in km
    default: 0
  },
  fare: {
    type: Number, // in INR
    default: 0
  },
  baseFare: {
    type: Number, // Base fare component
    default: 0
  },
  distanceFare: {
    type: Number, // Distance-based fare component
    default: 0
  },
  carbonSaved: {
    type: Number, // in kg CO2
    default: 0
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  pointsRedeemed: {
    type: Number,
    default: 0
  },
  
  // Ride Status
  status: {
    type: String,
    enum: ['reserved', 'active', 'completed', 'cancelled'],
    default: 'reserved'
  },
  
  // Feedback
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: null
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot exceed 500 characters']
  },
  
  // Payment (simulated)
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'wallet', 'upi', 'card'],
    default: 'wallet'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
rideSchema.index({ userId: 1, createdAt: -1 });
rideSchema.index({ vehicleId: 1, status: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ startLocation: '2dsphere' });

// Calculate duration before saving
rideSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    const diffMs = this.endTime - this.startTime;
    this.duration = Math.round(diffMs / (1000 * 60)); // Convert to minutes
  }
  next();
});

// Virtual for ride summary
rideSchema.virtual('summary').get(function() {
  return {
    duration: `${this.duration} mins`,
    distance: `${this.distance.toFixed(2)} km`,
    fare: `₹${this.fare}`,
    carbonSaved: `${this.carbonSaved.toFixed(2)} kg CO₂`
  };
});

module.exports = mongoose.model('Ride', rideSchema);
