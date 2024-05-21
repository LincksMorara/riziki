//Implement logic for user profile management
// Import the User model to interact with the User collection in the database
const User = require('../models/User');

// Define a function to get the user profile
exports.getUserProfile = async (req, res) => {
    try {
        // Find the user by their id (excluding the password) and send it in the response
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        // If an error occurs, send a 500 status code (Internal Server Error) and the error message
        res.status(500).json({ success: false, error: error.message });
    }
};

// Define a function to update the user profile
exports.updateUserProfile = async (req, res) => {
    // Destructure the username, email, and password from the request body
    const { username, email, password } = req.body;

    try {
        // Find the user by their id
        const user = await User.findById(req.user.id);

        // If the user exists, update their username, email, and password
        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            if (password) {
                user.password = password;
            }

            // Save the updated user and send it in the response
            const updatedUser = await user.save();
            res.status(200).json({ success: true, data: updatedUser });
        } else {
            // If the user does not exist, send a 404 status code (Not Found) and an error message
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        // If an error occurs, send a 500 status code (Internal Server Error) and the error message
        res.status(500).json({ success: false, error: error.message });
    }
};