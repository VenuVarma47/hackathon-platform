/**
 * Judge Evaluation Scorecard Mongoose Schema
 */

const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hackathon',
      required: true
    },
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    innovationScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    technicalScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    designScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    impactScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    totalScore: {
      type: Number,
      required: true
    },
    feedback: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Ensure a judge evaluates each submission only once
evaluationSchema.index({ submission: 1, judge: 1 }, { unique: true });

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
