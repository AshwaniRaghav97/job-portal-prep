import express from 'express';
import {
  updateProfile,
  uploadResumeFile,
  getRecommendedJobs,
  addRecentlyViewed,
  getRecentlyViewed,
  getNotifications,
  markNotificationRead,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/resume', protect, authorize('jobseeker'), uploadResume.single('resume'), uploadResumeFile);
router.get('/recommended-jobs', protect, getRecommendedJobs);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.post('/recently-viewed/:jobId', protect, addRecentlyViewed);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

export default router;
