import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileText,
  Clock,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Calendar,
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        if (res.data?.success) {
          setApplications(res.data.applications || []);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

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
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          My Applications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track real-time hiring decisions, status progression, and notes from recruiters
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading your applications..." />
      ) : applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-indigo-500/40 transition"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {app.job?.company?.logo ? (
                      <img src={app.job.company.logo} alt={app.job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      <Link to={`/jobs/${app.job?._id}`} className="hover:text-indigo-600 transition">
                        {app.job?.title || 'Job Position'}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {app.job?.company?.name || 'Company'} • {app.job?.location || 'Location'}
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
                </div>
              </div>

              {/* Status progression history */}
              {app.history && app.history.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Audit Timeline:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.history.map((h, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{h.status}: </span>
                        <span>{h.note}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(h.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recruiter Notes if any */}
              {app.recruiterNotes && (
                <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold">Note from Recruiter: </span>
                  {app.recruiterNotes}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </span>

                <Link
                  to={`/jobs/${app.job?._id}`}
                  className="font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>View Posting</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore open jobs and submit your resume to start tracking your interviews here.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
          >
            Find Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
