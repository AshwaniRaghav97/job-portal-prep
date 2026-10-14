import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CompanySettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    logo: '',
    industry: 'Technology',
    size: '51-200',
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/companies/my-company');
        if (res.data?.success && res.data.company) {
          const c = res.data.company;
          setFormData({
            name: c.name || '',
            description: c.description || '',
            website: c.website || '',
            location: c.location || '',
            logo: c.logo || '',
            industry: c.industry || 'Technology',
            size: c.size || '51-200',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/companies/my-company', formData);
      if (res.data?.success) {
        setSuccessMsg('Company profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving company.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading company settings..." />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
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
            Employer Company Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            This profile appears on all your job postings and in the public company directory
          </p>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Headquarters Location *
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Company Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="500-1000">500-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Website URL
            </label>
            <input
              type="url"
              name="website"
              placeholder="https://company.example.com"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Logo Image URL
            </label>
            <input
              type="url"
              name="logo"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Company Overview & Culture *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Tell candidates about your company's mission, stack, benefits, and values..."
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Company Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;
