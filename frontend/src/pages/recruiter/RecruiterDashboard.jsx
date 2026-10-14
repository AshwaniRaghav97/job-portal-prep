import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Briefcase,
  Users,
  Eye,
  PlusCircle,
  Building2,
  Trash2,
  ExternalLink,
  Edit,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e'];

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/jobs/recruiter/my-jobs'),
        api.get('/applications/recruiter/stats'),
      ]);

      if (jobsRes.data?.success) {
        setJobs(jobsRes.data.jobs || []);
      }
      if (statsRes.data?.success) {
        setStats(statsRes.data.stats || null);
      }
    } catch (err) {
      console.error('Error fetching recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? All associated applications will also be removed.')) {
      return;
    }
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data?.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading employer dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Recruiter Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active openings, review candidate pipelines, and manage company listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/company-settings"
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Company Profile
          </Link>
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Job Postings
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {stats?.totalJobs || jobs.length}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Applicants
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {stats?.totalApplications || 0}
            </p>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Listings
            </p>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {stats?.activeJobs || jobs.filter((j) => j.status === 'active').length}
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      {stats && (stats.jobsData?.length > 0 || stats.statusData?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Applications per Job Bar Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Applicants Distribution by Job
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.jobsData || []}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="applicants" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Application Status Breakdown Pie Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Application Pipeline Status
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.statusData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Jobs Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Your Active Postings ({jobs.length})
          </h3>
          <Link
            to="/recruiter/post-job"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + Create New Position
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Location / Mode</th>
                  <th className="px-6 py-4">Salary Range</th>
                  <th className="px-6 py-4">Applicants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      <Link to={`/jobs/${job._id}`} className="hover:text-indigo-600">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {job.location} ({job.workMode})
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-600 hover:text-white transition"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.applicantsCount || 0} Review</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          job.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            No job postings created yet. Click "Post New Job" above to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
