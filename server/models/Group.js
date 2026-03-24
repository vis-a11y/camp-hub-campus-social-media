const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['club', 'committee', 'course'], required: true },
  description: { type: String, required: true },
  incharge: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  activeHours: [{ type: String }],
  isAiGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
