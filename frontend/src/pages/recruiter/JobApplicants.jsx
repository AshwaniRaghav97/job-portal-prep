import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Users,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  // Status Update Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [recruiterNote, setRecruiterNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}?status=${statusFilter}`);
      if (res.data?.success) {
        setApplicants(res.data.applicants || []);
        setJobTitle(res.data.jobTitle || 'Job Opening');
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId, statusFilter]);

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setUpdating(true);

    try {
      const res = await api.put(`/applications/${selectedApp._id}/status`, {
        status: newStatus,
        note: recruiterNote,
      });

      if (res.data?.success) {
        setApplicants((prev) =>
          prev.map((a) => (a._id === selectedApp._id ? res.data.application : a))
        );
        setSelectedApp(null);
        setRecruiterNote('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      case 'Selected':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/recruiter/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Recruiter Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Applicants for "{jobTitle}"
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total {applicants.length} candidate{applicants.length === 1 ? '' : 's'} in pipeline
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Under Review">Under Review</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading candidate profiles..." />
      ) : applicants.length > 0 ? (
        <div className="space-y-4">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                    {app.applicant?.name ? app.applicant.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {app.applicant?.name || 'Applicant'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.applicant?.currentTitle || 'Job Seeker'} • {app.applicant?.experienceLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setNewStatus(app.status);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Contact & Location Details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {app.applicant?.email}
                </span>
                {app.applicant?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {app.applicant.phone}
                  </span>
                )}
                {app.applicant?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {app.applicant.location}
                  </span>
                )}
              </div>

              {/* Skills Tags */}
              {app.applicant?.skills && app.applicant.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {app.applicant.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Cover Letter */}
              {app.coverLetter && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">
                    Candidate Cover Note:
                  </span>
                  {app.coverLetter}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Applied {new Date(app.createdAt).toLocaleDateString()}
                </span>

                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download / View Resume PDF</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
          <Users className="w-12 h-12 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-600 dark:text-slate-300">
            No applicants found matching this status
          </h3>
        </div>
      )}

      {/* Update Status Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Update Candidate Status
            </h3>
            <p className="text-xs text-slate-500">
              Candidate: <strong>{selectedApp.applicant?.name}</strong>
            </p>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Select Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
                >
                  <option value="Applied">Applied</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Internal Note / Feedback
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Cleared technical screening round; invite for system design interview..."
                  value={recruiterNote}
                  onChange={(e) => setRecruiterNote(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save & Notify Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
