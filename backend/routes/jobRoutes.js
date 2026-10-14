import express from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  toggleSaveJob,
  getSavedJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/recruiter/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/user/saved-jobs', protect, authorize('jobseeker'), getSavedJobs);
router.get('/:id', getJobById);

router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);
router.post('/:id/save', protect, authorize('jobseeker'), toggleSaveJob);

export default router;
