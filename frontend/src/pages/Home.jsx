import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
  Server,
  Layers,
  Award,
  BookOpen,
  FileCheck2,
  TrendingUp,
  Building2,
  CheckCircle,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, compRes] = await Promise.all([
          api.get('/jobs?limit=6'),
          api.get('/companies'),
        ]);

        if (jobsRes.data?.success) {
          setFeaturedJobs(jobsRes.data.jobs || []);
        }
        if (compRes.data?.success) {
          setCompanies(compRes.data.companies?.slice(0, 5) || []);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (location) query.set('location', location);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Complete Job Portal & Interview Preparation Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Discover Your Next Role.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              Master The Interview.
            </span>
          </h1>

          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connect with verified tech companies, practice role-based interview questions, assess your skills with interactive quizzes, and optimize your ATS resume.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearch}
            className="mt-10 max-w-4xl mx-auto bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <Search className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills (e.g. React, Node, DevOps)..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Location (e.g. Remote, San Francisco, New York)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/25 transition duration-200 shrink-0"
            >
              Search Jobs
            </button>
          </form>

          {/* Quick Category Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">Popular:</span>
            {['React', 'Node.js', 'Remote', 'Full Stack', 'DevOps', 'TypeScript'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setKeyword(tag);
                  navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
                }}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Preparation Track Highlights Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-indigo-800/40">
          <div className="relative z-10 max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              Interview Readiness Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 leading-tight">
              Don't just apply. Prepare, certify, and get selected.
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore 100+ handpicked questions with code explanations, complete timed technical quizzes to earn portfolio badges, and read exact company round-by-round strategies.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <Link
                to="/prep/questions"
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group text-left"
              >
                <BookOpen className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
                <p className="font-semibold text-sm">Technical Q&A</p>
                <p className="text-xs text-slate-400 mt-1">Frontend, Backend, DSA</p>
              </Link>

              <Link
                to="/prep/quizzes"
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group text-left"
              >
                <Award className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
                <p className="font-semibold text-sm">Skill Assessments</p>
                <p className="text-xs text-slate-400 mt-1">Earn Verifiable Badges</p>
              </Link>

              <Link
                to="/prep/companies"
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group text-left"
              >
                <Building2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
                <p className="font-semibold text-sm">Company Guides</p>
                <p className="text-xs text-slate-400 mt-1">Google, Meta, Amazon</p>
              </Link>

              <Link
                to="/prep/resume-analyzer"
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group text-left"
              >
                <FileCheck2 className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform mb-2" />
                <p className="font-semibold text-sm">ATS Resume Tool</p>
                <p className="text-xs text-slate-400 mt-1">Score & Keyword Match</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Featured Opportunities
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hand-picked verified roles from high-growth tech companies
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
          >
            <span>View All Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold">No active jobs found</h3>
            <p className="text-sm text-slate-500 mt-1">Check back soon for new openings</p>
          </div>
        )}
      </section>

      {/* Top Hiring Companies */}
      {companies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Top Companies Actively Hiring
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore culture, open openings, and engineering standards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-lg transition flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                    {company.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{company.industry}</p>
                  <span className="inline-block mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {company.openJobsCount || 1} open positions
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recruiter Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Hiring top engineering and product talent?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              Post your job openings, screen pre-assessed candidates with verified test scores, and track applications with real-time status updates.
            </p>
          </div>
          <Link
            to="/register?role=recruiter"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition shrink-0"
          >
            Start Hiring Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
