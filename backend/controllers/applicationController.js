const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
exports.applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('employer');

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    if (!job.isActive) {
      return res.status(400).json({ success: false, error: 'Job is no longer active' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      candidate: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, error: 'You have already applied for this job' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a resume' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      candidate: req.user.id,
      resume: req.file.path.replace(/\\/g, '/').split('backend/')[1] || req.file.filename,
      coverLetter: req.body.coverLetter
    });

    // Send email notification to candidate (optional)
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Application Submitted',
        message: `Your application for ${job.title} at ${job.employer.companyName} has been successfully submitted.`
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/mine
// @access  Private (Candidate only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate({
        path: 'job',
        select: 'title location salary type employer',
        populate: {
          path: 'employer',
          select: 'companyName companyLogo'
        }
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to view these applications' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'candidate',
        select: 'name email bio skills avatar'
      })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id).populate('job').populate('candidate');

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Make sure user is job owner
    if (application.job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this application' });
    }

    const { status } = req.body;

    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
       return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    application.status = status;
    await application.save();

    // Send email notification about status change
    try {
      await sendEmail({
        email: application.candidate.email,
        subject: `Application Status Updated: ${application.job.title}`,
        message: `The status of your application for ${application.job.title} has been updated to: ${status.toUpperCase()}.`
      });
    } catch (err) {
      console.log('Email could not be sent', err);
    }

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
