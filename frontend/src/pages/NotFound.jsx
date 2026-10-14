import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <Compass className="w-16 h-16 text-indigo-500 animate-spin-slow" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
        404 - Page Not Found
      </h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
        The link you clicked doesn't exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
