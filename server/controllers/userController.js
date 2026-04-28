const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Get any user's public profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'firstName lastName profilePic branch role')
      .populate('following', 'firstName lastName profilePic branch role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update own profile
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, branch, year, interests, website, location, profilePic, coverPhoto } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, bio, branch, year, interests, website, location, profilePic, coverPhoto, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Follow / Unfollow
const followUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const isFollowing = targetUser.followers.some(id => id.toString() === req.user._id.toString());

    if (isFollowing) {
      targetUser.followers = targetUser.followers.filter(id => id.toString() !== req.user._id.toString());
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
    } else {
      targetUser.followers.push(req.user._id);
      currentUser.following.push(req.params.id);

      await Notification.create({
        recipient: targetUser._id,
        sender: req.user._id,
        type: 'follow',
        message: 'started following you',
      });
    }

    await targetUser.save();
    await currentUser.save();

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get followers list
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'firstName lastName profilePic branch role bio reputationScore');
    res.json(user.followers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get following list
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'firstName lastName profilePic branch role bio reputationScore');
    res.json(user.following);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Discover people
const discoverPeople = async (req, res) => {
  try {
    const { branch, search } = req.query;
    const currentId = req.user ? req.user._id : null;
    let filter = currentId ? { _id: { $ne: currentId } } : {};
    
    if (branch) filter.branch = branch;
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('firstName lastName profilePic branch role bio reputationScore followers')
      .limit(30);

    const result = users.map(u => ({
      ...u.toObject(),
      isFollowing: currentId ? u.followers.some(id => id.toString() === currentId.toString()) : false,
    }));

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search users, posts
const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ users: [], posts: [] });

    const nameParts = q.trim().split(/\s+/);
    const currentId = req.user ? req.user._id : null;
    let userQuery = {
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { branch: { $regex: q, $options: 'i' } }
      ]
    };

    if (currentId) {
      userQuery._id = { $ne: currentId };
    }

    if (nameParts.length > 1) {
       userQuery.$or.push({
          $and: [
             { firstName: { $regex: nameParts[0], $options: 'i' } },
             { lastName: { $regex: nameParts[1], $options: 'i' } }
          ]
       });
    }

    const users = await User.find(userQuery)
      .select('firstName lastName profilePic branch role')
      .limit(10);

    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { subjectTags: { $regex: q, $options: 'i' } },
      ]
    }).populate('author', 'firstName lastName profilePic role').limit(10);

    res.json({ users, posts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile, followUser, getFollowers, getFollowing, discoverPeople, search };
