/**
 * Hackathon Mongoose Model Schema
 */

const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a hackathon title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    tagline: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide a hackathon description']
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Please specify a category (e.g., Web Dev, AI/ML, Mobile)'],
      default: 'General'
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify the start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify the end date']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please specify the registration deadline']
    },
    minTeamSize: {
      type: Number,
      default: 1,
      min: [1, 'Minimum team size must be at least 1']
    },
    maxTeamSize: {
      type: Number,
      default: 4,
      max: [10, 'Maximum team size cannot exceed 10']
    },
    prizePool: {
      type: String,
      default: '$5,000 in Prizes'
    },
    rules: {
      type: String,
      default: 'Standard Hackathon guidelines apply. All code must be written during the event.'
    },
    status: {
      type: String,
      enum: ['Draft', 'Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming'
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
    }
  },
  {
    timestamps: true
  }
);

const Hackathon = mongoose.model('Hackathon', hackathonSchema);

module.exports = Hackathon;
