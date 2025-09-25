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