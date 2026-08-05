/**
 * Leaderboard Controller
 */

const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');

// @desc    Get real-time ranked leaderboard for a hackathon
// @route   GET /api/leaderboard/:hackathonId
// @access  Public
const getHackathonLeaderboard = async (req, res, next) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon not found'
      });
    }

    const submissions = await Submission.find({ hackathon: hackathonId })
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email college profileImage' }
      })
      .sort({ averageScore: -1, evaluationCount: -1 });

    // Assign ranking positions
    const leaderboard = submissions.map((sub, index) => ({
      rank: index + 1,
      submissionId: sub._id,
      projectTitle: sub.projectTitle,
      tagline: sub.tagline,
      repositoryUrl: sub.repositoryUrl,
      demoVideoUrl: sub.demoVideoUrl,
      teamName: sub.team ? sub.team.name : 'Unknown Team',
      members: sub.team ? sub.team.members : [],
      techStack: sub.techStack,
      averageScore: sub.averageScore,
      evaluationCount: sub.evaluationCount
    }));

    res.status(200).json({
      success: true,
      hackathon: {
        id: hackathon._id,
        title: hackathon.title,
        status: hackathon.status
      },
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHackathonLeaderboard
};
