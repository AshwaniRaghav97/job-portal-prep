import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
    setLoading(true);

    try {
      await login(demoEmail, 'password123');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your jobs, applications, and interview prep tracks
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* 1-Click Quick Demo Login Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            ⚡ Quick 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alex@example.com')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition text-[11px] font-semibold flex flex-col items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('recruiter@techcorp.com')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition text-[11px] font-semibold flex flex-col items-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@careerforge.com')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition text-[11px] font-semibold flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
