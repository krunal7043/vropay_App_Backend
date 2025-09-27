const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const { authenticateToken } = require('../middlewares/auth');

router.put('/profile', authenticateToken, user.addProfileDetails);
router.put('/preferences', authenticateToken, user.updatePreferences);
router.put('/difficulty', authenticateToken, user.updateDifficulty);

module.exports = router;