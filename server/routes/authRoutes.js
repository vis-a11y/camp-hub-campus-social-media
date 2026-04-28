const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, updateProfilePic, getUserById } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary config for profile pics
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-hub-profiles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, getUsers);
router.get('/users/:id', protect, getUserById);
router.put('/profile-pic', protect, upload.single('profilePic'), updateProfilePic);

module.exports = router;
