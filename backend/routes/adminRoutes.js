import express from 'express';
import {
  getAdminStats,
  getAllUsersAdmin,
  updateUserStatusAdmin,
  getAllJobsAdmin,
  deleteJobAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/status', updateUserStatusAdmin);
router.get('/jobs', getAllJobsAdmin);
router.delete('/jobs/:id', deleteJobAdmin);

export default router;
