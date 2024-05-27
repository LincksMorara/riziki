// Import the express module
const express = require('express');

// Destructure the register and login functions from the authController module
const { register, login, forgotPassword, validateResetToken, resetPassword } = require('../controllers/authController');

// Create a new router object
const router = express.Router();

// Define a POST route for '/register' that uses the register function as its handler
//takes the model for user
router.post('/register', register);

// Define a POST route for '/login' that uses the login function as its handler
//takes email and password
router.post('/login', login);

//Define route for forgot password
//takes email
router.post('/forgotpassword', forgotPassword);

//Define route for validating reset token
router.post('/validateresettoken', validateResetToken); 


//Define route for reset password
//takes in new password
router.put('/resetpassword', resetPassword);

// Export the router object
module.exports = router;