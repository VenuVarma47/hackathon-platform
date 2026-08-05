/**
 * Team & Registration Controller
 */

const Team = require('../models/Team');
const Hackathon = require('../models/Hackathon');
const crypto = require('crypto');

// Generate unique random 6-character team join code
const generateTeamCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// @desc    Create a new team & register for hackathon
// @route   POST /api/teams
// @access  Private (Participant)
const createTeam = async (req, res, next) => {
  try {
    const { name, hackathonId } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    // Check if user is already registered in a team for this hackathon
    const existingTeam = await Team.findOne({
      hackathon: hackathonId,
      $or: [{ leader: req.user._id }, { members: req.user._id }]
    });

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered in a team for this hackathon'
      });
    }

    const code = generateTeamCode();

    const team = await Team.create({
      name,
      hackathon: hackathonId,
      leader: req.user._id,
      members: [req.user._id],
      code
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email college profileImage')
      .populate('members', 'name email college profileImage skills')
      .populate('hackathon', 'title category startDate endDate');

    res.status(201).json({
      success: true,
      message: 'Team created and registered successfully',
      data: populatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join existing team using unique Team Code
// @route   POST /api/teams/join
// @access  Private (Participant)
const joinTeamByCode = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a team code'
      });
    }

    const team = await Team.findOne({ code: code.toUpperCase() }).populate('hackathon');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Invalid team code. No team found'
      });
    }

    // Check if team has reached maximum capacity
    if (team.members.length >= team.hackathon.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: `Team has already reached max capacity of ${team.hackathon.maxTeamSize} members`
      });
    }

    // Check if user is already in this team
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team'
      });
    }

    team.members.push(req.user._id);
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email college profileImage')
      .populate('members', 'name email college profileImage skills')
      .populate('hackathon', 'title category');

    res.status(200).json({
      success: true,
      message: `Successfully joined team ${team.name}`,
      data: updatedTeam
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's registered teams
// @route   GET /api/teams/my-teams
// @access  Private
const getUserTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({
      $or: [{ leader: req.user._id }, { members: req.user._id }]
    })
      .populate('leader', 'name email college profileImage')
      .populate('members', 'name email college profileImage skills')
      .populate('hackathon', 'title tagline category bannerImage startDate endDate status');

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team details by ID
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email college profileImage bio')
      .populate('members', 'name email college profileImage skills bio')
      .populate('hackathon');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.status(200).json({
      success: true,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  joinTeamByCode,
  getUserTeams,
  getTeamById
};
