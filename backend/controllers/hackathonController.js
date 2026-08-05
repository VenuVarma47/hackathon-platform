/**
 * Hackathon Management Controller
 */

const Hackathon = require('../models/Hackathon');

// @desc    Get all hackathons with optional Search and Filters
// @route   GET /api/hackathons
// @access  Public
const getAllHackathons = async (req, res, next) => {
  try {
    const { search, category, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const hackathons = await Hackathon.find(query)
      .populate('organizer', 'name email college profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hackathon by ID
// @route   GET /api/hackathons/:id
// @access  Public
const getHackathonById = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'name email college profileImage bio');

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hackathon
// @route   POST /api/hackathons
// @access  Private (Organizer or Admin)
const createHackathon = async (req, res, next) => {
  try {
    req.body.organizer = req.user._id;

    const hackathon = await Hackathon.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hackathon created successfully',
      data: hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private (Organizer owner or Admin)
const updateHackathon = async (req, res, next) => {
  try {
    let hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check ownership unless Admin
    if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hackathon'
      });
    }

    hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Hackathon updated successfully',
      data: hackathon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private (Organizer owner or Admin)
const deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hackathon'
      });
    }

    await hackathon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hackathon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon
};
