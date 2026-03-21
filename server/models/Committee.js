const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  head: { type: String },
  incharge: { type: String },
  logo: { type: String, default: '' },
  pictures: [{ type: String }],
  chatGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Committee', committeeSchema);
