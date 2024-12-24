const express = require('express');
const { register, login, refresh, logout, getUser, putUser, deleteUser, uploadProfileImage, deleteProfileImage } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/:userId', getUser);
router.put('/:userId', putUser);
router.delete('/:userId', deleteUser);
router.post('/:userId/profile-image', uploadProfileImage);
router.delete('/:userId/profile-image', deleteProfileImage);

module.exports = router;