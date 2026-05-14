const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
} = require('../controllers/jobController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/employer/me', protect, authorize('employer'), getEmployerJobs);

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('employer'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('employer'), updateJob)
  .delete(protect, authorize('employer'), deleteJob);

module.exports = router;
