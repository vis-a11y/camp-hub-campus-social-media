const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'admin', 'alumni'], default: 'student' },
  branch: { type: String, required: true }, // department
  year: { type: Number, required: true },
  bio: { type: String, default: 'Building the campus future.' },
  profilePic: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Extra social features not in the "User" specification but implied in other specs or existing system
  reputationScore: { type: Number, default: 100 },
  interests: [{ type: String }],
  website: { type: String, default: '' },
  location: { type: String, default: 'SSJCOE Hub' },
  isVerified: { type: Boolean, default: false },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
