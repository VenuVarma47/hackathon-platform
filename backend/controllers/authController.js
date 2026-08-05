/**
 * Authentication Controller
 * Handles user registration, login, and profile operations
 */

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, college, skills, bio } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user in database
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Participant',
      college: college || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      bio: bio || ''
    });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          college: user.college,
          skills: user.skills,
          bio: user.bio,
          profileImage: user.profileImage,
          token
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data provided'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user by email and explicitly include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare plain text password with hashed password in DB
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.college,
        skills: user.skills,
        bio: user.bio,
        profileImage: user.profileImage,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.college = req.body.college !== undefined ? req.body.college : user.college;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      
      if (req.body.skills) {
        user.skills = Array.isArray(req.body.skills) 
          ? req.body.skills 
          : req.body.skills.split(',').map(s => s.trim());
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      const token = generateToken(updatedUser._id);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          college: updatedUser.college,
          skills: updatedUser.skills,
          bio: updatedUser.bio,
          profileImage: updatedUser.profileImage,
          token
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};
