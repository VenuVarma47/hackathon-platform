/**
 * Project Submission Controller
 */

const Submission = require('../models/Submission');
const Team = require('../models/Team');

// @desc    Submit a project for a hackathon
// @route   POST /api/submissions
// @access  Private (Participant)
const submitProject = async (req, res, next) => {
  try {
    const { hackathonId, teamId, projectTitle, tagline, description, repositoryUrl, demoVideoUrl, liveDemoUrl, techStack } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify user is in team
    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this team'
      });
    }

    // Check if team already submitted
    let submission = await Submission.findOne({ team: teamId, hackathon: hackathonId });

    if (submission) {
      // Update existing submission
      submission.projectTitle = projectTitle || submission.projectTitle;
      submission.tagline = tagline !== undefined ? tagline : submission.tagline;
      submission.description = description || submission.description;
      submission.repositoryUrl = repositoryUrl || submission.repositoryUrl;
      submission.demoVideoUrl = demoVideoUrl !== undefined ? demoVideoUrl : submission.demoVideoUrl;
      submission.liveDemoUrl = liveDemoUrl !== undefined ? liveDemoUrl : submission.liveDemoUrl;
      submission.techStack = Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(t => t.trim()) : submission.techStack);

      await submission.save();

      return res.status(200).json({
        success: true,
        message: 'Submission updated successfully',
        data: submission
      });
    }

    // Create new submission
    submission = await Submission.create({
      hackathon: hackathonId,
      team: teamId,
      submittedBy: req.user._id,
      projectTitle,
      tagline: tagline || '',
      description,
      repositoryUrl,
      demoVideoUrl: demoVideoUrl || '',
      liveDemoUrl: liveDemoUrl || '',
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(t => t.trim()) : [])
    });

    // Update team status
    team.status = 'Submitted';
    await team.save();

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submissions by hackathon ID
// @route   GET /api/submissions/hackathon/:hackathonId
// @access  Public
const getSubmissionsByHackathon = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ hackathon: req.params.hackathonId })
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email college profileImage' }
      })
      .populate('submittedBy', 'name email')
      .sort({ averageScore: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get submission detail by ID
// @route   GET /api/submissions/:id
// @access  Public
const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('hackathon', 'title category endDate')
      .populate({
        path: 'team',
        populate: { path: 'members leader', select: 'name email college skills bio profileImage' }
      })
      .populate('submittedBy', 'name email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitProject,
  getSubmissionsByHackathon,
  getSubmissionById
};
