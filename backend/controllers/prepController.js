import PrepQuestion from '../models/PrepQuestion.js';
import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';
import CompanyGuide from '../models/CompanyGuide.js';

// @desc    Get interview preparation questions
// @route   GET /api/prep/questions
// @access  Public
export const getPrepQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ question: regex }, { topic: regex }, { tags: regex }, { answer: regex }];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await PrepQuestion.countDocuments(query);
    const questions = await PrepQuestion.find(query)
      .sort({ likes: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get list of unique categories and topics
    const categories = await PrepQuestion.distinct('category');

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      categories,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a preparation question
// @route   POST /api/prep/questions/:id/like
// @access  Public
export const likePrepQuestion = async (req, res, next) => {
  try {
    const question = await PrepQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.likes += 1;
    await question.save();

    res.status(200).json({ success: true, likes: question.likes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all interactive quizzes
// @route   GET /api/prep/quizzes
// @access  Public
export const getQuizzes = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    // Exclude full question answers from list view
    const quizzes = await Quiz.find(query).select('-questions.correctOptionIndex -questions.explanation');

    res.status(200).json({
      success: true,
      count: quizzes.length,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz by ID for testing
// @route   GET /api/prep/quizzes/:id
// @access  Public
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Hide correctOptionIndex for honest assessment during the test
    const sanitizedQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      category: quiz.category,
      difficulty: quiz.difficulty,
      durationMinutes: quiz.durationMinutes,
      badgeName: quiz.badgeName,
      questions: quiz.questions.map((q, idx) => ({
        index: idx,
        questionText: q.questionText,
        options: q.options,
      })),
    };

    res.status(200).json({
      success: true,
      quiz: sanitizedQuiz,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz answers and calculate results
// @route   POST /api/prep/quizzes/:id/submit
// @access  Private
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const { userAnswers } = req.body; // array of selected indices: [0, 2, 1, ...]
    if (!Array.isArray(userAnswers)) {
      return res.status(400).json({ success: false, message: 'userAnswers must be an array' });
    }

    let correctCount = 0;
    const gradedDetails = quiz.questions.map((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) correctCount += 1;

      return {
        questionText: q.questionText,
        options: q.options,
        selectedOption: selected,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const total = quiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= 70; // 70% threshold

    const attempt = await QuizAttempt.create({
      user: req.user.id,
      quiz: quiz._id,
      score: correctCount,
      totalQuestions: total,
      correctAnswers: correctCount,
      percentage,
      passed,
      answers: gradedDetails.map((g, i) => ({
        questionIndex: i,
        selectedOption: g.selectedOption,
        isCorrect: g.isCorrect,
      })),
    });

    res.status(200).json({
      success: true,
      result: {
        score: correctCount,
        totalQuestions: total,
        percentage,
        passed,
        badgeName: passed ? quiz.badgeName : null,
        gradedDetails,
        attemptId: attempt._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's past quiz attempts and badges
// @route   GET /api/prep/my-attempts
// @access  Private
export const getMyQuizAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ user: req.user.id })
      .populate('quiz', 'title category badgeName')
      .sort({ createdAt: -1 });

    const badges = attempts
      .filter((a) => a.passed && a.quiz)
      .map((a) => ({
        badgeName: a.quiz.badgeName,
        quizTitle: a.quiz.title,
        category: a.quiz.category,
        percentage: a.percentage,
        earnedAt: a.createdAt,
      }));

    res.status(200).json({
      success: true,
      attempts,
      badges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all company guides
// @route   GET /api/prep/companies
// @access  Public
export const getCompanyGuides = async (req, res, next) => {
  try {
    const guides = await CompanyGuide.find().sort({ companyName: 1 });
    res.status(200).json({
      success: true,
      guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company guide by name
// @route   GET /api/prep/companies/:companyName
// @access  Public
export const getCompanyGuideByName = async (req, res, next) => {
  try {
    const guide = await CompanyGuide.findOne({
      companyName: new RegExp(`^${req.params.companyName}$`, 'i'),
    });

    if (!guide) {
      return res.status(404).json({ success: false, message: 'Company guide not found' });
    }

    res.status(200).json({
      success: true,
      guide,
    });
  } catch (error) {
    next(error);
  }
};
