const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description can not be more than 2000 characters']
  },
  requirements: {
    type: [String],
    required: [true, 'Please add job requirements']
  },
  salary: {
    type: Number,
    required: [true, 'Please add a salary range']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
    required: [true, 'Please specify job type']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category']
  },
  employer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    required: [true, 'Please add an application deadline']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);
