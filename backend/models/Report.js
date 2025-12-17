const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    default: null
  },
  
  // Issue Details
  issueType: {
    type: String,
    enum: ['low-battery', 'damage', 'malfunction', 'dirty', 'missing-parts', 'other'],
    required: [true, 'Issue type is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    type: String // URLs to uploaded images
  }],
  
  // Location where issue was reported
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
  },
  
  // Resolution
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
reportSchema.index({ vehicleId: 1, status: 1 });
reportSchema.index({ userId: 1 });
reportSchema.index({ status: 1, priority: -1 });

// Auto-set priority based on issue type
reportSchema.pre('save', function(next) {
  if (this.isNew) {
    switch (this.issueType) {
      case 'malfunction':
      case 'missing-parts':
        this.priority = 'critical';
        break;
      case 'damage':
      case 'low-battery':
        this.priority = 'high';
        break;
      case 'dirty':
        this.priority = 'low';
        break;
      default:
        this.priority = 'medium';
    }
  }
  next();
});

module.exports = mongoose.model('Report', reportSchema);
