const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, commentOnPost, savePost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Cloudinary config for signal media
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-hub-signals',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4'],
    resource_type: 'auto'
  }
});
const upload = multer({ storage });

router.route('/posts')
  .post(protect, upload.single('media'), createPost)
  .get(protect, getPosts);

router.post('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comment', protect, commentOnPost);
router.post('/posts/:id/save', protect, savePost);
router.delete('/posts/:id', protect, deletePost);

module.exports = router;
