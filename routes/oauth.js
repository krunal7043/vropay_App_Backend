const express = require('express');
const router = express.Router();
const { googleAuth, signup, verifyOTP } = require('../controller/oauth');

// Route for Google OAuth authentication
router.post('/google-auth', googleAuth);

// Route for email signup
router.post('/signup', signup);

// Route for OTP verification
router.post('/verify-otp', verifyOTP);

module.exports = router;