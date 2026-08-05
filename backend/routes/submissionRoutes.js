/**
 * Project Submission Express Routes
 */

const express = require('express');
const router = express.Router();
const {
  submitProject,
  getSubmissionsByHackathon,
  getSubmissionById
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/hackathon/:hackathonId', getSubmissionsByHackathon);
router.get('/:id', getSubmissionById);
router.post('/', protect, submitProject);

module.exports = router;
