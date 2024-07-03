// Import the express module
const express = require('express');

// Destructure the protect and admin functions from the authMiddleware module
const { protect, admin } = require('../middlewares/authMiddleware');

// Destructure the getUserProfile and updateUserProfile functions from the userController module
const { getAllUsers, deleteUser, updateUserByUsername, getUserProfile, updateUserProfile } = require('../controllers/userController');

// Create a new router object
const router = express.Router();

// User profile routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin routes
router.route('/')
    .get(protect, admin, getAllUsers);

router.route('/:username')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUserByUsername);


// Export the router object
module.exports = router;