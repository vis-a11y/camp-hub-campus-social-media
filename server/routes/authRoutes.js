const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { getUserProfile: getPublicProfile, updateProfile, followUser, getFollowers, getFollowing, discoverPeople, search } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/me', protect, updateUserProfile);

// User social
router.get('/users', protect, discoverPeople);
router.get('/users/search', protect, search);
router.get('/users/:id', protect, getPublicProfile);
router.put('/users/:id/follow', protect, followUser);
router.get('/users/:id/followers', protect, getFollowers);
router.get('/users/:id/following', protect, getFollowing);

module.exports = router;
