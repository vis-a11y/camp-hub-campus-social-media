const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

const getPosts = async (req, res) => {
  const { sort, tab } = req.query;
  try {
    let sortOption = { createdAt: -1 };
    if (sort === 'trending') {
      sortOption = { likes: -1, createdAt: -1 };
    }

    let filter = {};
    if (tab === 'doubts') filter.isDoubt = true;
    if (tab === 'announcements') filter.isAnnouncement = true;
    if (tab === 'notices') filter.isNotice = true;

    const posts = await Post.find(filter)
      .populate('author', 'firstName lastName email role profilePic branch isVerified')
      .populate('comments.user', 'firstName lastName profilePic role')
      .sort(sortOption)
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName email role profilePic branch isVerified')
      .populate('comments.user', 'firstName lastName profilePic role');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.views += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'firstName lastName email role profilePic branch isVerified')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  const { content, media, mediaType, subjectTags, isDoubt, isAnnouncement, isNotice, poll, music } = req.body;

  if ((isAnnouncement || isNotice) && req.user.role === 'student') {
    return res.status(403).json({ message: 'Only faculty/admin can post announcements or notices.' });
  }

  try {
    const post = await Post.create({
      author: req.user._id,
      content,
      media: media || '',
      mediaType: mediaType || 'image',
      subjectTags: subjectTags || [],
      isDoubt: isDoubt || false,
      isAnnouncement: isAnnouncement || false,
      isNotice: isNotice || false,
      poll: poll || undefined,
      music: music || undefined,
    });

    const populated = await Post.findById(post._id)
      .populate('author', 'firstName lastName email role profilePic branch isVerified');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likes.some(id => id.toString() === req.user._id.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          post: post._id,
          message: 'liked your post',
        });
      }
    }

    await post.save();
    res.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user._id,
      text: req.body.text,
    });
    await post.save();

    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        message: 'commented on your post',
      });
    }

    const updated = await Post.findById(post._id)
      .populate('author', 'firstName lastName email role profilePic branch isVerified')
      .populate('comments.user', 'firstName lastName profilePic role');

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    comment.deleteOne();
    await post.save();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);
    if (!post || !user) return res.status(404).json({ message: 'Not found' });

    const alreadySaved = user.savedPosts.some(id => id.toString() === post._id.toString());
    if (alreadySaved) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== post._id.toString());
      post.saves = post.saves.filter(id => id.toString() !== req.user._id.toString());
    } else {
      user.savedPosts.push(post._id);
      post.saves.push(req.user._id);
    }

    await user.save();
    await post.save();
    res.json({ saved: !alreadySaved });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'firstName lastName email role profilePic branch isVerified' }
    });
    res.json(user.savedPosts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const votePoll = async (req, res) => {
  const { optionId } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    if (!post || !post.poll) return res.status(404).json({ message: 'Poll not found' });

    if (post.poll.endsAt && new Date() > post.poll.endsAt) {
      return res.status(400).json({ message: 'Poll has ended' });
    }

    post.poll.options.forEach(opt => {
      opt.voters = opt.voters.filter(v => v.toString() !== req.user._id.toString());
    });

    const option = post.poll.options.id(optionId);
    if (option) option.voters.push(req.user._id);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createPost, getPosts, getPostById, getUserPosts,
  likePost, commentPost, deleteComment,
  savePost, getSavedPosts, deletePost, votePoll
};
