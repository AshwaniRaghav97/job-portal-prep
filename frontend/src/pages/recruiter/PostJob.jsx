import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Briefcase,
  DollarSign,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skillsRequired: '',
    location: '',
    workMode: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Mid-Level',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
  });

  useEffect(() => {
    if (isEditing) {
      api.get(`/jobs/${id}`)
        .then((res) => {
          if (res.data?.success && res.data.job) {
            const j = res.data.job;
            setFormData({
              title: j.title || '',
              description: j.description || '',
              responsibilities: j.responsibilities?.join('\n') || '',
              requirements: j.requirements?.join('\n') || '',
              skillsRequired: j.skillsRequired?.join(', ') || '',
              location: j.location || '',
              workMode: j.workMode || 'Remote',
              jobType: j.jobType || 'Full-time',
              experienceLevel: j.experienceLevel || 'Mid-Level',
              salaryMin: j.salaryMin || '',
              salaryMax: j.salaryMax || '',
              salaryCurrency: j.salaryCurrency || 'USD',
            });
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load existing job details.');
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/jobs/${id}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading job form..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recruiter Dashboard</span>
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Job Posting' : 'Post a New Job Opportunity'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill in the job requirements to attract pre-qualified candidates
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Senior Full Stack Engineer (React / Node)"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Grid: Work Mode, Job Type, Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Mode
              </label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Job Type
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Fresher">Fresher</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Executive</option>
              </select>
            </div>
          </div>

          {/* Location & Salary Range */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Location (City / Remote) *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. San Francisco, CA or Remote"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Min Salary (USD) *
              </label>
              <input
                type="number"
                name="salaryMin"
                required
                placeholder="e.g. 110000"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Max Salary (USD) *
              </label>
              <input
                type="number"
                name="salaryMax"
                required
                placeholder="e.g. 150000"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skillsRequired"
              placeholder="e.g. React, Node.js, MongoDB, TypeScript, Docker"
              value={formData.skillsRequired}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Job Description *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Provide a comprehensive summary of the team, product, and mission..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Key Responsibilities */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Key Responsibilities (One per line)
            </label>
            <textarea
              name="responsibilities"
              rows={4}
              placeholder="Design and scale REST APIs&#10;Lead sprint planning with engineers&#10;Optimize database indexing"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Requirements & Qualifications (One per line)
            </label>
            <textarea
              name="requirements"
              rows={4}
              placeholder="3+ years building full stack web applications&#10;Strong understanding of asynchronous JavaScript&#10;Experience with Docker & AWS"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : isEditing ? 'Update Job Posting' : 'Publish Job Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
