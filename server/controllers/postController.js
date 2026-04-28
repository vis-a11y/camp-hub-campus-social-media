const Post = require('../models/Post');
const User = require('../models/User');

// @desc    RECONSTRUCTED: Create a new campus signal
// @route   POST /api/academic/posts
exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    let media = '';

    // Advanced Media Detection (Cloudinary or Local)
    if (req.file) {
      media = req.file.path || req.file.filename;
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      media,
      isAnnouncement: req.user.role !== 'student'
    });

    const fullPost = await Post.findById(post._id).populate('author', 'firstName lastName profilePic role');
    res.status(201).json(fullPost);
  } catch (err) {
    res.status(400).json({ message: 'Dispatch failed', error: err.message });
  }
};

// @desc    RECONSTRUCTED: Fetch all signals (Optimized)
// @route   GET /api/academic/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName lastName profilePic role')
      .populate({
        path: 'comments.user',
        select: 'firstName lastName profilePic'
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Sync failed' });
  }
};

// @desc    RECONSTRUCTED: High-frequency interaction (Like/Unlike)
// @route   POST /api/academic/posts/:id/like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Signal lost' });

    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(400).json({ message: 'Interaction failed' });
  }
};

// @desc    RECONSTRUCTED: Signal Injection (Comment)
// @route   POST /api/academic/posts/:id/comment
exports.commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Signal lost' });

    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();
    const updatedPost = await Post.findById(post._id).populate('comments.user', 'firstName lastName profilePic');
    res.json(updatedPost.comments);
  } catch (err) {
    res.status(400).json({ message: 'Injection failed' });
  }
};

// @desc    RECONSTRUCTED: Permanent Storing (Save Post)
// @route   POST /api/academic/posts/:id/save
exports.savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const isSaved = user.savedPosts.includes(req.params.id);
    
    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== req.params.id);
    } else {
      user.savedPosts.push(req.params.id);
    }

    await user.save();
    res.json({ saved: !isSaved });
  } catch (err) {
    res.status(400).json({ message: 'Store failed' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Already purged' });
    
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized purge' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Signal neutralized' });
  } catch (err) {
    res.status(400).json({ message: 'Purge failed' });
  }
};
