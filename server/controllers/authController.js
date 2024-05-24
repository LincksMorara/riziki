// Import the User model and the jsonwebtoken module
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail =require('../utils/emailUtility');
const crypto = require('crypto');


// User registration function
exports.register = async(req, res) => {
    // Destructure the request body to get the user details
    const {firstName, lastName, phoneNumber, username, email, password,role} = req.body;
    try {
        // Try to create a new user with the provided details
        const user = await User.create({
            firstName,
            lastName,
            phoneNumber,
            username,
            email,
            password,
            role
        });

        // If the user is created successfully, sign a new JWT for the user
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // Send a success response with the user details
        res.status(201).json({success: true, user});
    } catch (error) {
        // If an error occurred, send an error response with the error message
        res.status(500).json({success: false, error: error.message});
    }
};

// User login function
exports.login = async(req, res) => {
    // Destructure the request body to get the email and password
    const {email, password} = req.body;
    try{
        // Try to find a user with the provided email
        const user = await User.findOne({email});

        // If no user was found, or the provided password does not match the user's password, send an error response
        if(!user || !(await user.matchPassword(password))){
            return res.status(401).json({success: false, error: 'Invalid credentials'});
        }

        // If the user was found and the password matches, sign a new JWT for the user
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        
        // Send a success response with the JWT(token sent in response body)
        res.status(200).json({success: true, token});
    } catch (error) {
        // If an error occurred, send an error response with the error message
        res.status(500).json({success: false, error: error.message});
    }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: 'No user found with this email' });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        const message = `Here is your reset token: ${resetToken}`;

        try {
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Token',
                text: message,
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Verify reset token
exports.verifyResetToken = async (req, res) => {
    const { token } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        res.status(200).json({ success: true, data: 'Token is valid' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Validate reset token
exports.validateResetToken = async (req, res) => {
    // Destructure the resetToken from the request body
    const { resetToken } = req.body;

    // Check if resetToken is defined
    if (!resetToken) {
        return res.status(400).json({ success: false, error: 'No reset token provided' });
    }

    // Hash the resetToken using the SHA256 algorithm
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    try {
        // Try to find a user with a matching resetPasswordToken that has not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            // The $gt operator checks if the resetPasswordExpire is greater than the current date/time
            resetPasswordExpire: { $gt: Date.now() },
        });

        // If no user is found, send a 400 status code (Bad Request) and an error message
        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        // If a user is found, send a 200 status code (OK) and a success message
        res.status(200).json({ success: true, data: 'Valid token' });
    } catch (error) {
        // If an error occurs, send a 500 status code (Internal Server Error) and the error message
        res.status(500).json({ success: false, error: error.message });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({ success: true, token: jwtToken });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
