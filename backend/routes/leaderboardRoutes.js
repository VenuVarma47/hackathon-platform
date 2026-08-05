/**
 * Leaderboard Express Routes
 */

const express = require('express');
const router = express.Router();
const { getHackathonLeaderboard } = require('../controllers/leaderboardController');

router.get('/:hackathonId', getHackathonLeaderboard);

module.exports = router;
