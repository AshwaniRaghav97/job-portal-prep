import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BookOpen,
  Search,
  Filter,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Building,
  Tag,
  Code,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const InterviewPrep = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [expandedId, setExpandedId] = useState(null);

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'DSA', 'System Design', 'DevOps', 'Behavioral'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'All') params.append('difficulty', selectedDifficulty);
      if (searchQuery) params.append('search', searchQuery);

      const res = await api.get(`/prep/questions?${params.toString()}`);
      if (res.data?.success) {
        setQuestions(res.data.questions || []);
      }
    } catch (err) {
      console.error('Error fetching prep questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const query = new URLSearchParams();
    if (selectedCategory !== 'All') query.set('category', selectedCategory);
    if (selectedDifficulty !== 'All') query.set('difficulty', selectedDifficulty);
    if (searchQuery) query.set('search', searchQuery);
    setSearchParams(query, { replace: true });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/prep/questions/${id}/like`);
      if (res.data?.success) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === id ? { ...q, likes: res.data.likes } : q))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-indigo-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Interview Prep Bank</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Curated Questions & Verified Solutions
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Study real interview questions asked at top tech companies. Filter by role, difficulty, or keyword, and inspect battle-tested code snippets.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search questions by topic, algorithm, concept, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <LoadingSpinner size="lg" text="Loading technical questions..." />
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q) => {
            const isExpanded = expandedId === q._id;
            return (
              <div
                key={q._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition hover:border-indigo-500/40"
              >
                {/* Header clickable */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : q._id)}
                  className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {q.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getDifficultyBadge(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{q.topic}</span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                      {q.question}
                    </h3>

                    {/* Popular in companies */}
                    {q.popularInCompanies && q.popularInCompanies.length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                        <span className="font-medium text-slate-500 dark:text-slate-400">Asked at:</span>
                        {q.popularInCompanies.map((comp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300 font-medium"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={(e) => handleLike(q._id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 transition"
                      title="Mark as helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.likes}</span>
                    </button>
                    <div className="p-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Answer Section */}
                {isExpanded && (
                  <div className="p-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">
                        Detailed Answer & Core Concepts:
                      </h4>
                      <p className="whitespace-pre-line leading-relaxed">{q.answer}</p>
                    </div>

                    {q.codeExample && (
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <Code className="w-4 h-4 text-indigo-500" />
                          Code Implementation:
                        </h4>
                        <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                          <code>{q.codeExample}</code>
                        </pre>
                      </div>
                    )}

                    {q.tags && q.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {q.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold">No questions found</h3>
          <p className="text-xs text-slate-500 mt-1">Try selecting another category or clear your search query.</p>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
