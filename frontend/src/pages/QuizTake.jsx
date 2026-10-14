import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Award,
} from 'lucide-react';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/prep/quizzes/${id}` } } });
      return;
    }

    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/prep/quizzes/${id}`);
        if (res.data?.success) {
          setQuiz(res.data.quiz);
          setTimeLeft((res.data.quiz.durationMinutes || 10) * 60);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, isAuthenticated]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || !quiz) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSelectOption = (qIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);

    try {
      // Build answers array matching question indices
      const formattedAnswers = quiz.questions.map((_, i) =>
        userAnswers[i] !== undefined ? userAnswers[i] : -1
      );

      const res = await api.post(`/prep/quizzes/${id}/submit`, {
        userAnswers: formattedAnswers,
      });

      if (res.data?.success) {
        navigate(`/prep/quizzes/${id}/result`, {
          state: { result: res.data.result, quizTitle: quiz.title },
        });
      }
    } catch (err) {
      console.error('Error submitting quiz attempt:', err);
      alert('Failed to submit assessment. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Preparing assessment session..." />;
  }

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold">Quiz Not Found</h2>
        <Link to="/prep/quizzes" className="mt-4 inline-block text-indigo-600">
          Back to Skill Tests
        </Link>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round((answeredCount / quiz.questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header with Title and Countdown */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {quiz.category}
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
            {quiz.title}
          </h1>
        </div>

        {/* Live Timer Pill */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold shrink-0 border ${
            timeLeft < 120
              ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
          <span>{answeredCount} answered ({progressPercent}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = userAnswers[currentIndex] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(currentIndex, optIdx)}
                className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm">{option}</span>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {currentIndex === quiz.questions.length - 1 ? (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submitting ? 'Grading Answers...' : 'Submit Assessment'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTake;
