const express = require('express');
const {
    register,
    login,
    refresh,
    logout,
    getUser,
    putUser,
    deleteUser,
    uploadProfileImage,
    deleteProfileImage,
    getFollowers,
    getReports,
    getBlocks,
    follow,
    unfollow,
    report,
    block,
    unblock
} = require('../controllers/userController');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// User management routes
router.get('/:userId', getUser);
router.put('/:userId', putUser);
router.delete('/:userId', deleteUser);
router.post('/:userId/profile-image', uploadProfileImage);
router.delete('/:userId/profile-image', deleteProfileImage);

// Social routes
router.get('/:userId/followers', getFollowers);
router.post('/:userId/follow', follow);
router.post('/:userId/unfollow', unfollow);

// Moderation routes
router.get('/:userId/reports', getReports);
router.post('/:userId/report', report);

// Block routes
router.get('/:userId/blocks', getBlocks);
router.post('/:userId/block', block);
router.post('/:userId/unblock', unblock);

module.exports = router;
