// Import the express module
const express = require('express');

// Destructure the protect and admin functions from the authMiddleware module
const { protect, admin } = require('../middlewares/authMiddleware');

// Destructure the getUserProfile and updateUserProfile functions from the userController module
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Create a new router object
const router = express.Router();

// Define a GET route for '/profile' that uses the protect middleware and the getUserProfile function as its handlers
// Define a PUT route for '/profile' that uses the protect middleware and the updateUserProfile function as its handlers
router.route('/profile').get( getUserProfile).put(protect, updateUserProfile);

// Export the router object
module.exports = router;