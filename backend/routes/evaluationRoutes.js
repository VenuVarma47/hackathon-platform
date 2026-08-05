/**
 * Judge Evaluation Express Routes
 */

const express = require('express');
const router = express.Router();
const {
  submitEvaluation,
  getSubmissionEvaluations
} = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('Judge', 'Admin'), submitEvaluation);
router.get('/submission/:submissionId', getSubmissionEvaluations);

module.exports = router;
