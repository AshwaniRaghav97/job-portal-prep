import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Preparation Pages
import InterviewPrep from './pages/InterviewPrep';
import Quizzes from './pages/Quizzes';
import QuizTake from './pages/QuizTake';
import QuizResult from './pages/QuizResult';
import CompanyPrep from './pages/CompanyPrep';
import ResumeOptimizer from './pages/ResumeOptimizer';

// Job Seeker Pages
import Profile from './pages/Profile';
import MyApplications from './pages/MyApplications';
import SavedJobs from './pages/SavedJobs';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import JobApplicants from './pages/recruiter/JobApplicants';
import CompanySettings from './pages/recruiter/CompanySettings';

// Admin Page
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Job Portal Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Preparation & Certification Module */}
                <Route path="/prep/questions" element={<InterviewPrep />} />
                <Route path="/prep/quizzes" element={<Quizzes />} />
                <Route
                  path="/prep/quizzes/:id"
                  element={
                    <ProtectedRoute>
                      <QuizTake />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/prep/quizzes/:id/result"
                  element={
                    <ProtectedRoute>
                      <QuizResult />
                    </ProtectedRoute>
                  }
                />
                <Route path="/prep/companies" element={<CompanyPrep />} />
                <Route path="/prep/companies/:companyName" element={<CompanyPrep />} />
                <Route path="/prep/resume-analyzer" element={<ResumeOptimizer />} />

                {/* Job Seeker Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/saved-jobs"
                  element={
                    <ProtectedRoute allowedRoles={['jobseeker']}>
                      <SavedJobs />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter Protected Routes */}
                <Route
                  path="/recruiter/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/post-job"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs/:id/edit"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <PostJob />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/jobs/:jobId/applicants"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <JobApplicants />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/recruiter/company-settings"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                      <CompanySettings />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Protected Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Catch All 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
