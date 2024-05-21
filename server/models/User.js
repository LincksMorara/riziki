const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true,
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps: true});

    //password hashing middleware
    UserSchema.pre('save', async function (next) {
        if (!this.isModified('password')) {
            next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    //password validation method
    UserSchema.methods.matchPassword = async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    };

    // Generate and hash password token
    UserSchema.methods.getResetPasswordToken = function () {
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to resetPasswordToken field
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set expire time
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        return resetToken;
    };

    
    
    module.exports = mongoose.model('User', UserSchema);