const { OAuth2Client } = require('google-auth-library');
const User = require('../model/oauth');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to verify Google ID token and authenticate user
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ success: false, message: 'ID token is required' });
        }

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Extract user info
        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email not provided by Google' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists but not with OAuth, return error
            if (user.loginType !== 'oauth') {
                return res.status(400).json({ success: false, message: 'Email already registered with manual login' });
            }
            // Update googleId if not set
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                email,
                name,
                loginType: 'oauth',
                googleId
            });
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                loginType: user.loginType
            }
        });

    } catch (error) {
        console.error('Google auth error:', error);
        if (error.message.includes('Wrong number of segments')) {
            return res.status(400).json({ success: false, message: 'Invalid ID token' });
        }
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = {
    googleAuth
};