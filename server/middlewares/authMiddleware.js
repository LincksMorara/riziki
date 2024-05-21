// Import the jsonwebtoken module for token verification
const jwt = require('jsonwebtoken');
// Import the User model to interact with the User collection in the database
const User = require('../models/User');

// Define a middleware function to protect routes
exports.protect = async (req, res, next) => {
    // Initialize a variable to hold the token
    let token;

    // Check if there is an authorization header and if it starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // If there is an authorization header and it starts with 'Bearer', extract the token
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if there is no token
    if (!token) {
        // If there is no token, return a 401 status code (Unauthorized) and an error message
        return res.status(401).json({ success: false, error: 'Not authorized, no token' });
    }

    try {
        // Try to decode the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // If the token is valid, find the user associated with the id in the decoded token and attach the user to the request object
        // The '-password' option ensures that the user's password is not included
        req.user = await User.findById(decoded.id).select('-password');
        
        // Call the next middleware function
        next();
    } catch (error) {
        // If the token is not valid, return a 401 status code (Unauthorized) and an error message
        res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
};

// Define a middleware function to check for admin role
exports.admin = (req, res, next) => {
    // Check if the user attached to the request object exists and has a role of 'admin'
    if (req.user && req.user.role === 'admin') {
        // If the user is an admin, call the next middleware function
        next();
    } else {
        // If the user is not an admin, return a 403 status code (Forbidden) and an error message
        res.status(403).json({ success: false, error: 'Not authorized as an admin' });
    }
};