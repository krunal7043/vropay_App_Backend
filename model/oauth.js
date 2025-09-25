const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: function() {
            return this.loginType === 'oauth';
        }
    },
    loginType: {
        type: String,
        enum: ['email', 'oauth'],
        required: true
    },
    googleId: {
        type: String,
        required: function() {
            return this.loginType === 'oauth';
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);