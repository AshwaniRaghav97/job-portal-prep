import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Briefcase,
  Search,
  BookOpen,
  CheckCircle2,
  Building,
  FileText,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ShieldAlert,
  Menu,
  X,
  Bookmark,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const unreadNotifs = user?.notifications?.filter((n) => !n.read) || [];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  CareerForge
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  Jobs & Prep
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/jobs"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/jobs')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/companies')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Companies
              </Link>
              <Link
                to="/prep/questions"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/prep/questions')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Interview Q&A
              </Link>
              <Link
                to="/prep/quizzes"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/prep/quizzes')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Skill Tests
              </Link>
              <Link
                to="/prep/companies"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/prep/companies')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Company Guides
              </Link>
              <Link
                to="/prep/resume-analyzer"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/prep/resume-analyzer')
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                ATS Analyzer
              </Link>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Dropdown (If authenticated) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse ring-2 ring-white dark:ring-slate-900"></span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-50">
                    <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-sm">Notifications</span>
                      <span className="text-xs text-indigo-600 font-medium">
                        {unreadNotifs.length} new
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {user?.notifications && user.notifications.length > 0 ? (
                        user.notifications.slice(0, 5).map((n, i) => (
                          <div key={i} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                            <p className="font-medium text-xs text-slate-900 dark:text-slate-100">
                              {n.title}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-center py-6 text-slate-400">
                          No notifications yet
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile or Login/Register */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold leading-tight line-clamp-1">
                      {user?.name}
                    </span>
                    <span className="text-[10px] capitalize text-slate-400">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {user?.role === 'jobseeker' && (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <User className="w-4 h-4 text-indigo-500" />
                            My Profile & Resume
                          </Link>
                          <Link
                            to="/applications"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <FileText className="w-4 h-4 text-emerald-500" />
                            My Applications
                          </Link>
                          <Link
                            to="/saved-jobs"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <Bookmark className="w-4 h-4 text-rose-500" />
                            Saved Wishlist
                          </Link>
                        </>
                      )}

                      {user?.role === 'recruiter' && (
                        <>
                          <Link
                            to="/recruiter/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                            Recruiter Dashboard
                          </Link>
                          <Link
                            to="/recruiter/post-job"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-500" />
                            Post a Job
                          </Link>
                          <Link
                            to="/recruiter/company-settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                          >
                            <Building className="w-4 h-4 text-amber-500" />
                            Company Profile
                          </Link>
                        </>
                      )}

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-500" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Find Jobs
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Companies
            </Link>
            <Link
              to="/prep/questions"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Interview Q&A
            </Link>
            <Link
              to="/prep/quizzes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Skill Tests & Badges
            </Link>
            <Link
              to="/prep/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Company Guides
            </Link>
            <Link
              to="/prep/resume-analyzer"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ATS Resume Analyzer
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
