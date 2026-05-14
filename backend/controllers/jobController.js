const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    let query;

    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse query string and add search keyword if exists
    const parsedQuery = JSON.parse(queryStr);
    
    if (req.query.keyword) {
      parsedQuery.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    query = Job.find(parsedQuery).populate({
      path: 'employer',
      select: 'name companyName companyLogo'
    });

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const jobs = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'employer',
      select: 'name companyName companyLogo bio email'
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
exports.createJob = async (req, res) => {
  try {
    // Add user to req.body
    req.body.employer = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this job' });
    }

    await job.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/me
// @access  Private (Employer only)
exports.getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
