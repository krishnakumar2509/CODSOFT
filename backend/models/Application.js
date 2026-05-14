const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  resume: {
    type: String,
    required: [true, 'Please upload a resume']
  },
  coverLetter: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from applying to the same job twice
ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
