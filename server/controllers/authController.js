// Import the User model and the jsonwebtoken module
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail =require('../utils/emailUtility');
const crypto = require('crypto');
const TempUser = require('../models/TempUser');



// Controller function to handle registration
exports.register = async (req, res) => {
    const { firstName, lastName, phoneNumber, username, email, password, role } = req.body;

    try {
        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Store the user data temporarily (not in the main User collection)
        const tempUser = new TempUser({
            firstName,
            lastName,
            phoneNumber,
            username,
            email,
            password,
            role,
            verificationToken
        });

        await tempUser.save();

        // Create the email content
        const mailOptions = {
            to: email,
            subject: 'Verify your email',
            text: `Your verification token is ${verificationToken}`
        };

        // Send the verification email
        await sendEmail(mailOptions);

        res.status(201).json({ message: 'User registered successfully. Please check your email for verification.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller function to handle email verification
exports.verifyEmail = async (req, res) => {
    const { token } = req.body;

    try {
        // Find the user in the temporary storage by email and verification token
        const tempUser = await TempUser.findOne({ verificationToken: token });

        if (!tempUser) {
            return res.status(400).json({ error: 'Invalid verification token.' });
        }

        // Create a new user instance
        const user = new User({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            phoneNumber: tempUser.phoneNumber,
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            role: tempUser.role,
        });

        await user.save();

        // Remove the temporary user data
        await TempUser.deleteOne({ token });

        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// User login function
exports.login = async (req, res) => {
    // Destructure the request body to get the username and password
    const { username, password } = req.body;
    try {
      // Try to find a user with the provided username
      const user = await User.findOne({ username });
  
      // If no user was found, or the provided password does not match the user's password, send an error response
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
  
      // If the user was found and the password matches, sign a new JWT for the user
      const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
  
      // Send a success response with the JWT(token sent in response body) and username
      res.status(200).json({ success: true, token, username: user.username, role: user.role });
    } catch (error) {
      // If an error occurred, send an error response with the error message
      res.status(500).json({ success: false, error: error.message });
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
    const { resetToken, newPassword } = req.body; // Get resetToken and newPassword from the body

    // Hash the resetToken using the SHA256 algorithm
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    try {
        // Try to find a user with the matching reset token that has not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            // If no user is found, send a 400 response with an error message
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        // Update the user's password and reset the reset token fields
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Sign a new JWT for the user
        const jwtToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        // Send a success response with the new JWT
        res.status(200).json({ success: true, token: jwtToken });
    } catch (error) {
        // If an error occurred, send a 500 response with the error message
        res.status(500).json({ success: false, error: error.message });
    }
};