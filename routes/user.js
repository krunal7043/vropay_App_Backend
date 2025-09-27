const express = require('express');
const router = express.Router();
const user = require('../controller/user');
const { authenticateToken } = require('../middlewares/auth');

router.put('/profile', authenticateToken, user.addProfileDetails);
router.put('/preferences', authenticateToken, user.updatePreferences);
router.post('/set-difficulty', authenticateToken, user.setDifficulty);
router.post('/set-community', authenticateToken, user.setCommunity);
router.post('/set-notifications', authenticateToken, user.setNotification);
router.get('/profile', authenticateToken, user.getUserProfile);

module.exports = router;