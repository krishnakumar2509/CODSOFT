const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/:jobId', protect, authorize('candidate'), upload.single('resume'), applyForJob);
router.get('/mine', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
