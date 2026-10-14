import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  ShieldAlert,
  Users,
  Briefcase,
  FileText,
  Building2,
  Trash2,
  Ban,
  CheckCircle,
  AlertTriangle,
  Search,
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

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'jobs'
  const [userSearch, setUserSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users?limit=50'),
        api.get('/admin/jobs?limit=50'),
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (usersRes.data?.success) setUsers(usersRes.data.users || []);
      if (jobsRes.data?.success) setJobs(jobsRes.data.jobs || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to mark this user as ${nextStatus}?`)) return;

    try {
      const res = await api.put(`/admin/users/${userId}/status`, { status: nextStatus });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action is permanent.')) return;

    try {
      const res = await api.delete(`/admin/jobs/${jobId}`);
      if (res.data?.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting job.');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading administrative console..." />;
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company?.name?.toLowerCase().includes(jobSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-purple-600" />
            Platform Admin Console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System overview, user account moderation, and job listing supervision
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800">
          {['overview', 'users', 'jobs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Seekers</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalUsers || 0}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Recruiters</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalRecruiters || 0}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Jobs</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalJobs || 0}
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {stats?.totalApplications || 0}
          </p>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User distribution pie */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Platform Entities Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.usersByRole || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {stats?.usersByRole?.map((entry, index) => (
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

          {/* Work mode bar */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Jobs by Work Mode
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.jobsByWorkMode || []}>
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
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS MODERATION */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              User Moderation ({filteredUsers.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id, u.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                            u.status === 'active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: JOBS MODERATION */}
      {activeTab === 'jobs' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Job Postings Moderation ({filteredJobs.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search job title or company..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Job Title</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Recruiter</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Applicants</th>
                  <th className="px-4 py-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredJobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      {j.title}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {j.company?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {j.recruiter?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-xs">{j.viewsCount || 0}</td>
                    <td className="px-4 py-3 text-xs font-bold text-indigo-600">
                      {j.applicantsCount || 0}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
