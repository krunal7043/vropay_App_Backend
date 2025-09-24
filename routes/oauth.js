const express = require('express');
const router = express.Router();
const { googleAuth } = require('../controller/oauth');

// Route for Google OAuth authentication
router.post('/google-auth', googleAuth);

module.exports = router;