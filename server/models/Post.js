const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  media: { type: String, default: '' },
  mediaType: { type: String, enum: ['image', 'video', 'audio'], default: 'image' },
  music: {
    title: String,
    artist: String,
    audioUrl: String,
    isOverlay: { type: Boolean, default: true } // For music stickers on images/videos
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  poll: {
    question: { type: String },
    options: [{
      text: { type: String, required: true },
      voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    endsAt: { type: Date }
  },
  
  // Implicitly derived roles or categories
  isAnnouncement: { type: Boolean, default: false }, // Faculty only
  isNotice: { type: Boolean, default: false }, // Admin only
  isDoubt: { type: Boolean, default: false }, // Student only
  subjectTags: [{ type: String }],
  aiScore: { type: Number, default: 0 },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
