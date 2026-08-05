/**
 * Hackathon Express Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllHackathons,
  getHackathonById,
  createHackathon,
  updateHackathon,
  deleteHackathon
} = require('../controllers/hackathonController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllHackathons);
router.get('/:id', getHackathonById);

// Protected routes (Organizer and Admin)
router.post('/', protect, authorize('Organizer', 'Admin'), createHackathon);
router.put('/:id', protect, authorize('Organizer', 'Admin'), updateHackathon);
router.delete('/:id', protect, authorize('Organizer', 'Admin'), deleteHackathon);

module.exports = router;
