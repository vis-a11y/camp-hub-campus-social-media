const Notification = require('../models/Notification');

// Mock Notification Model if missing (for stability)
const mongoose = require('mongoose');
if (!mongoose.models.Notification) {
  const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment', 'follow', 'system'], required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    read: { type: Boolean, default: false }
  }, { timestamps: true });
  mongoose.model('Notification', notificationSchema);
}

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await mongoose.model('Notification').find({ recipient: req.user._id })
      .populate('sender', 'firstName lastName profilePic')
      .populate('post', 'content')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Metric retrieval failed' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await mongoose.model('Notification').updateMany({ recipient: req.user._id }, { read: true });
    res.json({ message: 'Signals cleared' });
  } catch (err) {
    res.status(400).json({ message: 'Operation failed' });
  }
};
