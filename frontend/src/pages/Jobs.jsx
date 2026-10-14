import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Filter,
  DollarSign,
  Briefcase,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedWorkModes, setSelectedWorkModes] = useState(
    searchParams.get('workMode') ? searchParams.get('workMode').split(',') : []
  );
  const [selectedJobTypes, setSelectedJobTypes] = useState(
    searchParams.get('jobType') ? searchParams.get('jobType').split(',') : []
  );
  const [selectedExpLevels, setSelectedExpLevels] = useState(
    searchParams.get('experienceLevel') ? searchParams.get('experienceLevel').split(',') : []
  );
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Fetch Wishlist job IDs if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/jobs/user/saved-jobs')
        .then((res) => {
          if (res.data?.success && res.data.jobs) {
            setSavedJobIds(new Set(res.data.jobs.map((j) => j._id)));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Fetch Jobs on filter/page changes
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      if (selectedWorkModes.length > 0) params.append('workMode', selectedWorkModes.join(','));
      if (selectedJobTypes.length > 0) params.append('jobType', selectedJobTypes.join(','));
      if (selectedExpLevels.length > 0) params.append('experienceLevel', selectedExpLevels.join(','));
      if (minSalary) params.append('minSalary', minSalary);
      if (sortBy) params.append('sort', sortBy);
      params.append('page', currentPage);
      params.append('limit', 9);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data?.success) {
        setJobs(res.data.jobs || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalJobs(res.data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // Sync URL
    const query = new URLSearchParams();
    if (keyword) query.set('keyword', keyword);
    if (location) query.set('location', location);
    if (selectedWorkModes.length > 0) query.set('workMode', selectedWorkModes.join(','));
    if (selectedJobTypes.length > 0) query.set('jobType', selectedJobTypes.join(','));
    if (selectedExpLevels.length > 0) query.set('experienceLevel', selectedExpLevels.join(','));
    if (minSalary) query.set('minSalary', minSalary);
    if (sortBy) query.set('sort', sortBy);
    query.set('page', currentPage);
    setSearchParams(query, { replace: true });
  }, [keyword, location, selectedWorkModes, selectedJobTypes, selectedExpLevels, minSalary, sortBy, currentPage]);

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated) {
      alert('Please log in as a Job Seeker to save jobs to your wishlist!');
      return;
    }
    try {
      const res = await api.post(`/jobs/${jobId}/save`);
      if (res.data?.success) {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          if (res.data.saved) {
            next.add(jobId);
          } else {
            next.delete(jobId);
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  const toggleArrayFilter = (item, currentList, setter) => {
    if (currentList.includes(item)) {
      setter(currentList.filter((x) => x !== item));
    } else {
      setter([...currentList, item]);
    }
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setSelectedWorkModes([]);
    setSelectedJobTypes([]);
    setSelectedExpLevels([]);
    setMinSalary('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Jobs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showing {totalJobs} active position{totalJobs === 1 ? '' : 's'} across tech companies
          </p>
        </div>

        {/* Sort & Mobile filter button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            <span>Filters</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-auto md:ml-0"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="salary_desc">Sort: Salary (High to Low)</option>
            <option value="salary_asc">Sort: Salary (Low to High)</option>
            <option value="views">Sort: Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar (Desktop + Mobile Drawer) */}
        <div
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-500" />
              Filter By
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Reset All
            </button>
          </div>

          {/* Search Keywords */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Keyword or Role
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Title, skill, tool..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="City, state, or remote..."
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Work Mode */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Work Mode
            </label>
            <div className="space-y-2">
              {['Remote', 'Hybrid', 'On-site'].map((mode) => (
                <label key={mode} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedWorkModes.includes(mode)}
                    onChange={() => toggleArrayFilter(mode, selectedWorkModes, setSelectedWorkModes)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Job Type
            </label>
            <div className="space-y-2">
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                <label key={type} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedJobTypes.includes(type)}
                    onChange={() => toggleArrayFilter(type, selectedJobTypes, setSelectedJobTypes)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Experience Level
            </label>
            <div className="space-y-2">
              {['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'].map((exp) => (
                <label key={exp} className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedExpLevels.includes(exp)}
                    onChange={() => toggleArrayFilter(exp, selectedExpLevels, setSelectedExpLevels)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Salary Slider / Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Min Salary (USD / yr)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400">$</span>
              <input
                type="number"
                placeholder="e.g. 80000"
                step="10000"
                value={minSalary}
                onChange={(e) => {
                  setMinSalary(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Jobs Catalog */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <LoadingSpinner size="lg" text="Searching matching jobs..." />
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedJobIds.has(job._id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${
                          currentPage === pageNum
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No matching jobs found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                We couldn't find any job postings matching your current filter criteria. Try broadening your keywords or resetting filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
