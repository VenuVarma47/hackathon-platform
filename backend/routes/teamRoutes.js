/**
 * Team Express Routes
 */

const express = require('express');
const router = express.Router();
const {
  createTeam,
  joinTeamByCode,
  getUserTeams,
  getTeamById
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createTeam);
router.post('/join', joinTeamByCode);
router.get('/my-teams', getUserTeams);
router.get('/:id', getTeamById);

module.exports = router;
