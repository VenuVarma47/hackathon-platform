/**
 * User Management Express Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require authentication and Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
