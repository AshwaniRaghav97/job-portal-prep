import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

const Quizzes = () => {
  const { isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzesAndBadges = async () => {
      try {
        const res = await api.get('/prep/quizzes');
        if (res.data?.success) {
          setQuizzes(res.data.quizzes || []);
        }

        if (isAuthenticated) {
          const attemptsRes = await api.get('/prep/my-attempts');
          if (attemptsRes.data?.success) {
            setBadges(attemptsRes.data.badges || []);
          }
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzesAndBadges();
  }, [isAuthenticated]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-400/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Interactive Skill Assessments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Prove Your Technical Competency
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Take timed, real-world skill tests. Score 70% or higher to earn verifiable badges displayed directly on your candidate profile.
          </p>
        </div>
      </div>

      {/* Badges Earned Showcase */}
      {badges.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Your Earned Skill Badges ({badges.length})
            </h3>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              Verified by CareerForge
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {badges.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 shadow-sm"
              >
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {b.badgeName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Score: {b.percentage}% • {b.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quizzes List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Available Certifications & Quizzes
        </h2>

        {loading ? (
          <LoadingSpinner size="lg" text="Loading assessments..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {quiz.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {quiz.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      {quiz.questions?.length || 5} questions
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      {quiz.badgeName}
                    </span>
                  </div>

                  <Link
                    to={`/prep/quizzes/${quiz._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition"
                  >
                    <span>Start Skill Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
