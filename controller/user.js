const User = require('../model/userSchema');

exports.addProfileDetails = async (req, res) => {
    try {
        const { firstName, lastName, gender, profession } = req.body;
        const userId = req.userId;

        if (!firstName || !lastName || !gender || !profession) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, gender, profession },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                profession: user.profession
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.updatePreferences = async (req, res) => {
    try {
        const { profession, interests, difficulty, community, notifications } = req.body;
        const userId = req.userId;

        const updateData = {};
        if (profession) updateData.profession = profession;
        if (interests) updateData.interests = interests;
        if (difficulty) updateData.difficulty = difficulty;
        if (community) updateData.community = community;
        if (notifications) updateData.notifications = notifications;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).populate('interests');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Preferences updated successfully',
            user: {
                id: user._id,
                profession: user.profession,
                interests: user.interests,
                difficulty: user.difficulty,
                community: user.community,
                notifications: user.notifications
            }
        });

    } catch (error) {
        console.error('Preferences update error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.setDifficulty = async (req, res) => {
    try {
        const { difficulty } = req.body;
        const userId = req.userId;

        if (!difficulty) {
            return res.status(400).json({ success: false, message: 'Difficulty level is required' });
        }

        if (!['Beginner', 'Intermediate', 'Advance'].includes(difficulty)) {
            return res.status(400).json({ success: false, message: 'Invalid difficulty level' });
        }

        const existingUser = await User.findById(userId);
        
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please complete signup first.'
            });
        }

        const isFirstTime = !existingUser.difficulty;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { difficulty },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: isFirstTime ? 'Difficulty level set successfully' : 'Difficulty level updated successfully',
            difficulty: user.difficulty
        });

    } catch (error) {
        console.error('Difficulty update error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.setCommunity = async (req, res) => {
    try {
        const { community } = req.body;
        const userId = req.userId;

        if (!community) {
            return res.status(400).json({ success: false, message: 'Community preference is required' });
        }

        if (!['In', 'Out'].includes(community)) {
            return res.status(400).json({ success: false, message: 'Invalid community preference' });
        }

        const existingUser = await User.findById(userId);
        
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please complete signup first.'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { community },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Community preference set successfully',
            community: user.community
        });

    } catch (error) {
        console.error('Community update error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.setNotification = async (req, res) => {
    try {
        const { notifications } = req.body;
        const userId = req.userId;

        if (!notifications) {
            return res.status(400).json({ success: false, message: 'Notification preference is required' });
        }

        if (!['Allowed', 'Not allowed'].includes(notifications)) {
            return res.status(400).json({ success: false, message: 'Invalid notification preference' });
        }

        const existingUser = await User.findById(userId);
        
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please complete signup first.'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { notifications },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Notification preference set successfully',
            notifications: user.notifications
        });

    } catch (error) {
        console.error('Notifications update error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).populate('interests');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                profession: user.profession,
                interests: user.interests,
                difficulty: user.difficulty,
                community: user.community,
                notifications: user.notifications
            }
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};