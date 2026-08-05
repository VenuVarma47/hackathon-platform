/**
 * Judge Evaluation Controller
 */

const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');

// Helper to recalculate and update submission's average score
const updateSubmissionAverageScore = async (submissionId) => {
  const evaluations = await Evaluation.find({ submission: submissionId });
  if (evaluations.length === 0) return;

  const totalSum = evaluations.reduce((acc, curr) => acc + curr.totalScore, 0);
  const avg = (totalSum / evaluations.length).toFixed(2);

  await Submission.findByIdAndUpdate(submissionId, {
    averageScore: parseFloat(avg),
    evaluationCount: evaluations.length
  });
};

// @desc    Submit or update judge evaluation for a project
// @route   POST /api/evaluations
// @access  Private (Judge or Admin)
const submitEvaluation = async (req, res, next) => {
  try {
    const { hackathonId, submissionId, innovationScore, technicalScore, designScore, impactScore, feedback } = req.body;

    const totalScore = Number(innovationScore) + Number(technicalScore) + Number(designScore) + Number(impactScore);

    let evaluation = await Evaluation.findOne({
      submission: submissionId,
      judge: req.user._id
    });

    if (evaluation) {
      // Update existing evaluation scorecard
      evaluation.innovationScore = innovationScore;
      evaluation.technicalScore = technicalScore;
      evaluation.designScore = designScore;
      evaluation.impactScore = impactScore;
      evaluation.totalScore = totalScore;
      evaluation.feedback = feedback !== undefined ? feedback : evaluation.feedback;

      await evaluation.save();

      await updateSubmissionAverageScore(submissionId);

      return res.status(200).json({
        success: true,
        message: 'Scorecard evaluation updated successfully',
        data: evaluation
      });
    }

    // Create new evaluation
    evaluation = await Evaluation.create({
      hackathon: hackathonId,
      submission: submissionId,
      judge: req.user._id,
      innovationScore,
      technicalScore,
      designScore,
      impactScore,
      totalScore,
      feedback: feedback || ''
    });

    await updateSubmissionAverageScore(submissionId);

    res.status(201).json({
      success: true,
      message: 'Evaluation submitted successfully',
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get judge evaluations for a submission
// @route   GET /api/evaluations/submission/:submissionId
// @access  Private
const getSubmissionEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find({ submission: req.params.submissionId })
      .populate('judge', 'name email college profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitEvaluation,
  getSubmissionEvaluations
};
