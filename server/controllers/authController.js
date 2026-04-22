const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Updated: using bcryptjs as per spec
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key', { expiresIn: '30d' });
};

const safeUser = (user, token) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: `${user.firstName} ${user.lastName}`, 
  email: user.email,
  role: user.role,
  branch: user.branch,
  year: user.year,
  bio: user.bio,
  profilePic: user.profilePic,
  coverPhoto: user.coverPhoto,
  reputationScore: user.reputationScore,
  followers: user.followers,
  following: user.following,
  isVerified: user.isVerified,
  interests: user.interests || [],
  website: user.website,
  location: user.location,
  createdAt: user.createdAt,
  token,
});

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, branch, year } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword, 
      role, 
      branch: branch || 'Computer Science', 
      year: year || 2026,
      interests: [],
      profilePic: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=6366f1&color=fff`
    });
    
    res.status(201).json(safeUser(user, generateToken(user._id)));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json(safeUser(user, generateToken(user._id)));
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no session found' });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(safeUser(user, req.headers.authorization?.split(' ')[1]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, bio, branch, year, profilePic, coverPhoto, website, location, interests } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, bio, branch, year, profilePic, coverPhoto, website, location, interests, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.json(safeUser(user, req.headers.authorization?.split(' ')[1]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
