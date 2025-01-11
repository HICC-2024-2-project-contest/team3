const express = require('express');
const { requestEmailVerification, verifyEmail } = require('../controllers/authController');

const router = express.Router();

router.post('/request-email-verification', requestEmailVerification);
router.post('/verify-email/:token', verifyEmail);

module.exports = router;