import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Bookmark, Building2 } from 'lucide-react';

const JobCard = ({ job, isSaved = false, onToggleSave }) => {
  const formatSalary = (min, max, curr) => {
    return `${curr === 'USD' ? '$' : curr + ' '}${(min / 1000).toFixed(0)}k - ${(max / 1000).toFixed(0)}k`;
  };

  const getWorkModeColor = (mode) => {
    switch (mode) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'Hybrid':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="text-indigo-600 font-bold">CF</span>';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <Link
                to={`/companies/${job.company?._id || ''}`}
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                {job.company?.name || 'Top Employer'}
              </Link>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
              </h3>
            </div>
          </div>

          {onToggleSave && (
            <button
              onClick={() => onToggleSave(job._id)}
              className={`p-2.5 rounded-xl border transition ${
                isSaved
                  ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${getWorkModeColor(
              job.workMode
            )}`}
          >
            {job.workMode}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {job.jobType}
          </span>
          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {job.experienceLevel}
          </span>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.skillsRequired.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
              >
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                +{job.skillsRequired.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100 text-sm">
            <DollarSign className="w-4 h-4 text-emerald-500 -mr-1" />
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white transition"
        >
          View Job
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
