const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lead: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  
  // Extra features for campus collaboration
  gitUrl: { type: String, default: '' },
  presentationUrl: { type: String, default: '' },
  stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
