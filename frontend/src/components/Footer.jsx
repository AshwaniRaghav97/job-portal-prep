import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                CareerForge
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              The complete career development platform. Discover high-growth jobs, test your technical skills, master company interviews, and optimize your resume.
            </p>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Explore Companies
                </Link>
              </li>
              <li>
                <Link to="/prep/resume-analyzer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  ATS Resume Optimizer
                </Link>
              </li>
              <li>
                <Link to="/saved-jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Saved Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Interview Preparation */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">
              Interview Prep
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/prep/questions" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Technical Questions Bank
                </Link>
              </li>
              <li>
                <Link to="/prep/quizzes" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Skill Assessments & Badges
                </Link>
              </li>
              <li>
                <Link to="/prep/companies" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  FAANG & Tech Guides
                </Link>
              </li>
              <li>
                <Link to="/prep/questions?category=System+Design" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  System Design Cheatsheets
                </Link>
              </li>
            </ul>
          </div>

          {/* Recruiters & Employers */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/register?role=recruiter" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/recruiter/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Hiring Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Employer Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} CareerForge Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            Built with modern MERN stack & Tailwind CSS.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
