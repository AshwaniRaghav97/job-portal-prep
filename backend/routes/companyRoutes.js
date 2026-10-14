import express from 'express';
import {
  getAllCompanies,
  getCompanyById,
  getMyCompany,
  updateCompanyProfile,
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/my-company', protect, authorize('recruiter'), getMyCompany);
router.post('/my-company', protect, authorize('recruiter'), updateCompanyProfile);
router.get('/:id', getCompanyById);

export default router;
