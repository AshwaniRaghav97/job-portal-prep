import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  Clock,
  Eye,
  Users,
  CheckCircle2,
  ArrowLeft,
  Bookmark,
  Share2,
  Upload,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data?.success) {
          setJob(res.data.job);
        }

        // Track recently viewed if logged in as jobseeker
        if (isAuthenticated && user?.role === 'jobseeker') {
          api.post(`/users/recently-viewed/${id}`).catch(() => {});
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
      return;
    }

    if (user.role !== 'jobseeker') {
      alert('Only registered Job Seekers can submit applications.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      let finalResumeUrl = user.resume?.url;
      let finalResumeName = user.resume?.originalName;

      // If user uploaded a new file during application
      if (!useProfileResume && resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        const uploadRes = await api.post('/users/resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (uploadRes.data?.success) {
          finalResumeUrl = uploadRes.data.resume.url;
          finalResumeName = uploadRes.data.resume.originalName;
        }
      }

      if (!finalResumeUrl) {
        setErrorMessage('Please upload or provide a resume before applying.');
        setSubmitting(false);
        return;
      }

      const applyRes = await api.post(`/applications/${id}`, {
        coverLetter,
        resumeUrl: finalResumeUrl,
        resumeName: finalResumeName,
      });

      if (applyRes.data?.success) {
        setAppliedSuccess(true);
        setTimeout(() => {
          setApplyModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit application. Please check and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/jobs/${id}/save`);
      if (res.data?.success) {
        setIsSaved(res.data.saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading job posting details..." />;
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <p className="text-slate-500 mt-2">This job posting may have been filled or removed.</p>
        <Link to="/jobs" className="mt-6 inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Jobs</span>
      </Link>

      {/* Job Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company?.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/companies/${job.company?._id}`}
                className="text-base font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {job.company?.name || 'Company Profile'}
              </Link>
              {job.company?.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {job.location} ({job.workMode})
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-400" />
                {job.jobType}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <DollarSign className="w-4 h-4 text-emerald-500 -mr-1" />
                ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} / year
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleToggleSave}
            className={`p-3 rounded-2xl border transition ${
              isSaved
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Wishlist"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => setApplyModalOpen(true)}
            className="flex-1 md:flex-initial px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition shrink-0"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Main Content: Job Description + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Description, Responsibilities, Requirements */}
        <div className="lg:col-span-2 space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          {/* Job Overview */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">About The Role</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {job.description}
            </p>
          </section>

          {/* Key Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Requirements & Qualifications</h2>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Required Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Skills & Competencies</h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Company Info & Meta Stats */}
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Job Snapshot</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Experience</span>
                <span className="font-semibold">{job.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Total Views</span>
                <span className="font-semibold flex items-center gap-1">
                  <Eye className="w-4 h-4 text-slate-400" />
                  {job.viewsCount}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Applicants</span>
                <span className="font-semibold flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  {job.applicantsCount}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">Posted</span>
                <span className="font-semibold">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setApplyModalOpen(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition"
            >
              Apply For This Position
            </button>
          </div>

          {/* Company Card */}
          {job.company && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                  {job.company.logo ? (
                    <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{job.company.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{job.company.industry}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {job.company.description}
              </p>

              <Link
                to={`/companies/${job.company._id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <span>View Employer Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Apply for {job.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Submit your resume and introduction to {job.company?.name}
            </p>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {appliedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-emerald-600">Application Submitted!</h4>
                <p className="text-xs text-slate-500">
                  The hiring team has received your application. You can track progress in your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="mt-6 space-y-5">
                {/* Resume Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Resume / CV
                  </label>

                  {user?.resume?.url ? (
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 cursor-pointer">
                        <input
                          type="radio"
                          name="resumeSelect"
                          checked={useProfileResume}
                          onChange={() => setUseProfileResume(true)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            Use Saved Resume ({user.resume.originalName || 'Default.pdf'})
                          </span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="resumeSelect"
                          checked={!useProfileResume}
                          onChange={() => setUseProfileResume(false)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className="text-xs font-semibold">Upload a different resume</span>
                      </label>
                    </div>
                  ) : null}

                  {(!useProfileResume || !user?.resume?.url) && (
                    <div className="mt-3">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Cover Note / Message to Recruiter
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Highlight your key achievements and why you're a great fit for this position..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Send Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
