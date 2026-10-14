import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Building2, Search, MapPin, Users, Globe, ArrowRight } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        if (res.data?.success) {
          setCompanies(res.data.companies || []);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Company Directory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore verified hiring partners, browse open roles, and learn about engineering culture
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by company name, industry, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading company directory..." />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((company) => (
            <Link
              key={company._id}
              to={`/companies/${company._id}`}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-xl transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                      {company.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{company.industry}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 line-clamp-3 leading-relaxed">
                  {company.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {company.size} employees
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {company.openJobsCount || 0} open position{company.openJobsCount === 1 ? '' : 's'}
                </span>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold">No companies found</h3>
          <p className="text-xs text-slate-500 mt-1">Try another search keyword.</p>
        </div>
      )}
    </div>
  );
};

export default Companies;
