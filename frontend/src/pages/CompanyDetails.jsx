import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Building2,
  MapPin,
  Globe,
  Users,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
} from 'lucide-react';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await api.get(`/companies/${id}`);
        if (res.data?.success) {
          setCompany(res.data.company);
          setJobs(res.data.jobs || []);
        }
      } catch (err) {
        console.error('Error fetching company details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading company profile..." />;
  }

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold">Company Not Found</h2>
        <Link to="/companies" className="text-indigo-600 mt-3 inline-block">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        to="/companies"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Companies</span>
      </Link>

      {/* Company Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {company.name}
              </h1>
              {company.isVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Partner
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {company.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                {company.size} employees
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Industry: {company.industry}
              </span>
            </div>
          </div>
        </div>

        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-2 shrink-0"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>Visit Website</span>
          </a>
        )}
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          About {company.name}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
          {company.description}
        </p>
      </div>

      {/* Open Positions List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" />
          Open Positions at {company.name} ({jobs.length})
        </h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={{ ...job, company }} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-sm">
            No active job postings from {company.name} at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
