import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bookmark, Briefcase } from 'lucide-react';

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const res = await api.get('/jobs/user/saved-jobs');
      if (res.data?.success) {
        setJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleToggleSave = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/save`);
      if (res.data?.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-rose-500" />
          Saved Jobs Wishlist
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review positions you bookmarked to prepare applications or compare offers
        </p>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading bookmarked jobs..." />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isSaved={true}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-lg font-bold">Your wishlist is currently empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the bookmark icon on any job card to save it for later review.
          </p>
          <Link
            to="/jobs"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl"
          >
            Explore Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
