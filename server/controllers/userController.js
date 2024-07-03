//Implement logic for user profile management
// Import the User model to interact with the User collection in the database
const User = require('../models/User'); 
const sendEmail = require('../utils/emailUtility');


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
    // Destructure the firstName, lastName, phoneNumber, username, email, and password from the request body
    const { firstName, lastName, phoneNumber, username, email, password } = req.body;

    try {
        // Find the user by their ID from the request object set by the authentication middleware
        const user = await User.findById(req.user._id);

        // If the user exists, update their profile information
        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.phoneNumber = phoneNumber || user.phoneNumber;
            user.username = username || user.username;
            user.email = email || user.email;
            if (password) {
                user.password = password;
            }

            // Save the updated user to the database
            const updatedUser = await user.save();
            
            // Exclude the password from the response
            const { password: pwd, ...userWithoutPassword } = updatedUser.toObject();
            
            // Send a success response with the updated user data
            res.status(200).json({ success: true, data: userWithoutPassword });
        } else {
            // If the user does not exist, send a 404 Not Found response
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ success: false, error: error.message });
    }
};

// Define a function to get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users, excluding the password field
        const users = await User.find().select('-password');
        // Send a success response with the users data
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ success: false, error: error.message });
    }
};

// Define a function to delete a user by their username (admin only)
exports.deleteUser = async (req, res) => {
    const { username } = req.params;

    try {
        // Find the user by their username and delete them
        const user = await User.findOneAndDelete({ username });

        // If the user does not exist, send a 404 Not Found response
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Send a success response indicating the user was deleted
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ success: false, error: error.message });
    }
};

// Define a function to update a user by their username (admin only)
exports.updateUserByUsername = async (req, res) => {
    const { username } = req.params;
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    try {
        // Find the user by their username
        const user = await User.findOne({ username });

        // If the user does not exist, send a 404 Not Found response
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Update the user's details
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.email = email || user.email;
        if (password) {
            user.password = password;
        }

        // Save the updated user to the database
        const updatedUser = await user.save();

        // Exclude the password from the response
        const { password: pwd, ...userWithoutPassword } = updatedUser.toObject();

        // Send a success response with the updated user data
        res.status(200).json({ success: true, data: userWithoutPassword });
    } catch (error) {
        // If an error occurs, send a 500 Internal Server Error response
        res.status(500).json({ success: false, error: error.message });
    }
};


