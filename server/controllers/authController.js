const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key', {
    expiresIn: '30d'
  });
};

// @desc    RECONSTRUCTED: Identity Creation
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, branch, year } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Identity already exists' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName, lastName, email, 
      password: hashedPassword,
      role: role || 'student',
      branch: branch || 'General',
      year: year || 1
    });

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(400).json({ message: 'Initialization failed', error: err.message });
  }
};

// @desc    RECONSTRUCTED: Identity Sync (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Sync failed' });
  }
};

// @desc    RECONSTRUCTED: Identity Retrieval
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Retrieval failed' });
  }
};

// @desc    RECONSTRUCTED: Global Identity Search
// @route   GET /api/auth/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('firstName lastName profilePic role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Scan failed' });
  }
};

// @desc    RECONSTRUCTED: Update Identity Visuals
// @route   PUT /api/auth/profile-pic
exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No media received' });
    
    const url = req.file.path || req.file.filename;
    await User.findByIdAndUpdate(req.user._id, { profilePic: url });
    
    res.json({ profilePic: url });
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: 'Node not found' });
  }
};
