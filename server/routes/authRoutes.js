// Import the express module
const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');

// Destructure the necessary functions from the authController module
const { register, login, forgotPassword, validateResetToken, resetPassword, verifyEmail } = require('../controllers/authController');

// Create a new router object
const router = express.Router();

// Define a POST route for '/register' that uses the register function as its handler
router.post('/register',  register);

// Define a POST route for '/login' that uses the login function as its handler
router.post('/login',login);

// Define a POST route for '/forgotpassword' that uses the forgotPassword function as its handler
router.post('/forgotpassword', forgotPassword);

// Define a POST route for '/validateresettoken' that uses the validateResetToken function as its handler
router.post('/validateresettoken', validateResetToken);

// Define a PUT route for '/resetpassword' that uses the resetPassword function as its handler
router.put('/resetpassword', resetPassword);

// Define a POST route for '/verifyemail' that uses the verifyEmail function as its handler
router.post('/verifyemail', verifyEmail);

// Export the router object
module.exports = router;
