/**
 * Team Mongoose Model Schema
 */

const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a team name'],
      trim: true
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    code: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: String,
      enum: ['Forming', 'Registered', 'Submitted'],
      default: 'Registered'
    }
  },
  {
    timestamps: true
  }
);

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
