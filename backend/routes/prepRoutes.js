import express from 'express';
import {
  getPrepQuestions,
  likePrepQuestion,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getMyQuizAttempts,
  getCompanyGuides,
  getCompanyGuideByName,
} from '../controllers/prepController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Technical Questions
router.get('/questions', getPrepQuestions);
router.post('/questions/:id/like', likePrepQuestion);

// Interactive Quizzes & Assessments
router.get('/quizzes', getQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes/:id/submit', protect, submitQuizAttempt);
router.get('/my-attempts', protect, getMyQuizAttempts);

// Company Interview Guides
router.get('/companies', getCompanyGuides);
router.get('/companies/:companyName', getCompanyGuideByName);

export default router;
