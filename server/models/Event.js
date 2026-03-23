const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, default: '' },
  location: { type: String, required: true },
  image: { type: String, default: '' },
  type: { type: String, default: 'Academic Hub' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Extra features for campus productivity
  registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  capacity: { type: Number, default: 0 },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
