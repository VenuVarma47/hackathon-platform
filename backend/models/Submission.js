/**
 * Project Submission Mongoose Model Schema
 */

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    projectTitle: {
      type: String,
      required: [true, 'Please enter project title'],
      trim: true
    },
    tagline: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed project description']
    },
    repositoryUrl: {
      type: String,
      required: [true, 'Please provide a GitHub repository link']
    },
    demoVideoUrl: {
      type: String,
      default: ''
    },
    liveDemoUrl: {
      type: String,
      default: ''
    },
    techStack: [
      {
        type: String,
        trim: true
      }
    ],
    averageScore: {
      type: Number,
      default: 0
    },
    evaluationCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
