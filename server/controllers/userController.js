const User = require('../models/User');
const Post = require('../models/Post');

// @desc    RECONSTRUCTED: Detailed Identity Search
// @route   GET /api/auth/users/search
exports.searchUsers = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ users: [], posts: [] });

  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('firstName lastName profilePic role');

    const posts = await Post.find({
      content: { $regex: query, $options: 'i' }
    }).populate('author', 'firstName lastName profilePic');

    res.json({ users, posts });
  } catch (err) {
    res.status(500).json({ message: 'Search signal lost' });
  }
};

// @desc    RECONSTRUCTED: Update Identity Profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Node not found' });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.bio = req.body.bio || user.bio;
    user.branch = req.body.branch || user.branch;
    user.year = req.body.year || user.year;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Sync failed' });
  }
};
