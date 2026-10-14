import express from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getRecruiterStats,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:jobId', protect, authorize('jobseeker'), applyForJob);
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplicants);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.get('/recruiter/stats', protect, authorize('recruiter', 'admin'), getRecruiterStats);

export default router;
