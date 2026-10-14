import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const quizTitle = location.state?.quizTitle || 'Skill Assessment';

  useEffect(() => {
    if (result?.passed) {
      // Trigger festive confetti explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result]);

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">No recent test results found</h2>
        <Link to="/prep/quizzes" className="text-indigo-600 font-semibold">
          Browse Assessments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Result Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${
            result.passed
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
          }`}
        >
          {result.passed ? (
            <Award className="w-10 h-10 animate-bounce" />
          ) : (
            <HelpCircle className="w-10 h-10" />
          )}
        </div>

        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              result.passed
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}
          >
            {result.passed ? 'Assessment Passed' : 'Keep Practicing'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {quizTitle}
          </h1>
        </div>

        {/* Big Score Display */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 max-w-sm mx-auto border border-slate-100 dark:border-slate-800 flex items-center justify-around">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {result.percentage}%
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Final Score</p>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {result.score} / {result.totalQuestions}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">Correct Answers</p>
          </div>
        </div>

        {/* Badge Unlocked Card */}
        {result.passed && result.badgeName && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-amber-950/20 dark:to-indigo-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Badge Unlocked: {result.badgeName}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This verification badge is now active on your public applicant profile!
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/prep/quizzes"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            All Skill Tests
          </Link>
          <Link
            to="/jobs"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
          >
            <span>Browse Matching Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Detailed Question Breakdown & Explanations
        </h3>

        {result.gradedDetails?.map((item, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 transition ${
              item.isCorrect
                ? 'border-emerald-200 dark:border-emerald-900/60'
                : 'border-rose-200 dark:border-rose-900/60'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs font-bold text-slate-400">
                Question {index + 1}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                  item.isCorrect
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                }`}
              >
                {item.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" /> Incorrect
                  </>
                )}
              </span>
            </div>

            <p className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
              {item.questionText}
            </p>

            <div className="space-y-2 mb-4 text-xs">
              {item.options.map((opt, optIdx) => {
                const isUserChoice = item.selectedOption === optIdx;
                const isCorrectChoice = item.correctOptionIndex === optIdx;

                let optClass = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400';
                if (isCorrectChoice) {
                  optClass = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold';
                } else if (isUserChoice && !item.isCorrect) {
                  optClass = 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-semibold line-through';
                }

                return (
                  <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${optClass}`}>
                    <span>{opt}</span>
                    {isCorrectChoice && <span className="font-bold text-[10px] uppercase">Correct Answer</span>}
                    {isUserChoice && !item.isCorrect && <span className="font-bold text-[10px] uppercase">Your Pick</span>}
                  </div>
                );
              })}
            </div>

            {item.explanation && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Why this is correct:
                </span>
                {item.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResult;
