const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const Vehicle = require('../models/Vehicle');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/issues
// @desc    Report a vehicle issue
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, issueType, description } = req.body;

    // Validate vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    const issue = await Issue.create({
      vehicleId,
      userId: req.user._id,
      issueType,
      description,
      priority: issueType === 'battery' || issueType === 'mechanical' ? 'high' : 'medium'
    });

    // If high priority, update vehicle status
    if (issue.priority === 'high') {
      vehicle.status = 'maintenance';
      await vehicle.save();
    }

    await issue.populate('vehicleId', 'vehicleNumber type brand model');

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error reporting issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to report issue'
    });
  }
});

// @route   GET /api/issues
// @desc    Get all issues (admin) or user's issues
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user._id };
    
    const issues = await Issue.find(query)
      .populate('vehicleId', 'vehicleNumber type brand model')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: issues
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch issues'
    });
  }
});

// @route   PUT /api/issues/:id
// @desc    Update issue status (admin only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, priority } = req.body;
    
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        error: 'Issue not found'
      });
    }

    if (status) issue.status = status;
    if (priority) issue.priority = priority;

    if (status === 'resolved') {
      issue.resolvedAt = Date.now();
      issue.resolvedBy = req.user._id;

      // Update vehicle status back to available if no other issues
      const vehicle = await Vehicle.findById(issue.vehicleId);
      const otherIssues = await Issue.countDocuments({
        vehicleId: issue.vehicleId,
        status: { $ne: 'resolved' },
        _id: { $ne: issue._id }
      });

      if (otherIssues === 0 && vehicle.status === 'maintenance') {
        vehicle.status = 'available';
        await vehicle.save();
      }
    }

    await issue.save();
    await issue.populate('vehicleId', 'vehicleNumber type brand model');

    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update issue'
    });
  }
});

module.exports = router;
