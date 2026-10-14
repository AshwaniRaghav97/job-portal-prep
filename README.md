# CareerForge: Full-Stack MERN Job Portal & Interview Preparation Platform

A modern, responsive, and production-ready **Job Portal and Interview Preparation Platform** built with MongoDB, Express.js, React 18, and Node.js.

---

## 🌟 Key Features

### 1. Job Seeker Experience
- **Personalized Dashboard & Profile**: Upload PDF resumes, set career titles, manage skills tag cloud, bio, and experience.
- **Search & Advanced Filtering**: Search jobs by keywords, skills, and city. Filter by work mode (Remote, Hybrid, On-site), employment type (Full-time, Part-time, Contract, Internship), experience level, and minimum salary.
- **One-Click Application System**: Apply with saved profile resume or upload new custom resume per job with personalized cover notes. Duplicate application prevention is strictly enforced.
- **Application Tracking & Status History**: Track status transitions (*Applied → Under Review → Shortlisted → Selected / Rejected*) along with recruiter audit notes.
- **Wishlist & Saved Jobs**: Bookmark positions for later review.
- **Job Recommendations & History**: Personalized job recommendations matching candidate skills and recently viewed jobs.

### 2. Recruiter & Employer Suite
- **Company Profile Management**: Showcase company logo, industry, headquarters, size, and mission.
- **Job Lifecycle Management**: Create, edit, publish, and delete job postings with rich requirements and salary ranges.
- **Applicant Pipeline & Review**: Review applicants per position, view candidate skill tags, read cover notes, and download resumes.
- **Candidate Status Transitions**: Move applicants through stages (*Shortlisted, Selected, Rejected*) and leave internal feedback notes.
- **Recruiter Analytics Dashboard**: Interactive Recharts charts visualizing applicants per job and candidate pipeline status breakdowns.

### 3. Administrator Console
- **Platform Analytics**: Interactive visual charts tracking total seekers, recruiters, companies, applications, and job work modes.
- **User Account Moderation**: View all platform users and suspend or reactivate compromised accounts.
- **Job Moderation**: Review and delete inappropriate job postings.

### 4. Technical Interview Preparation Suite
- **Technical Q&A Bank**: Handpicked questions across Frontend, Backend, Full Stack, DSA, System Design, DevOps, and Behavioral with in-depth explanations and code snippets.
- **Interactive Timed Quizzes & Skill Badges**: Timed skill tests with question steppers, countdown timers, instant grading, confetti celebrations on passing, and verifiable profile badges.
- **FAANG & Tech Company Guides**: In-depth hiring pipelines for Google, Amazon, and Meta detailing round-by-round expectations, Leadership Principles, and questions asked.
- **Interactive ATS Resume Scanner**: Instant ATS readability score calculator, action verb detector, and keyword matcher against target job descriptions.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
# Seed the database with sample users, companies, jobs, and questions:
npm run seed
# Start the backend server:
npm start
```
*Backend runs on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Pre-Configured Test Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@careerforge.com` | `password123` |
| **Recruiter** | `recruiter@techcorp.com` | `password123` |
| **Job Seeker** | `alex@example.com` | `password123` |
| **Job Seeker (Senior)** | `sarah@example.com` | `password123` |

*Tip: The Login page includes 1-click quick login buttons for all three roles!*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /register` - Register a new Job Seeker or Recruiter (auto-creates company)
- `POST /login` - Sign in and receive HTTP-only cookie and JWT
- `POST /logout` - Clear authentication session
- `GET /me` - Retrieve authenticated user profile
- `PUT /update-password` - Change user password

### Jobs (`/api/jobs`)
- `GET /` - Search, filter, and paginate active jobs
- `GET /:id` - Get job posting details and increment view count
- `POST /` - Recruiter creates a job posting
- `PUT /:id` - Recruiter updates job details
- `DELETE /:id` - Recruiter deletes job posting
- `GET /recruiter/my-jobs` - Recruiter's posted vacancies
- `POST /:id/save` - Toggle wishlist bookmark
- `GET /user/saved-jobs` - Get saved jobs for applicant

### Applications (`/api/applications`)
- `POST /:jobId` - Submit job application with resume & cover letter
- `GET /my-applications` - Applicant application history
- `GET /job/:jobId` - Recruiter retrieves candidate list for a job
- `PUT /:id/status` - Recruiter updates application stage & notes
- `GET /recruiter/stats` - Recruiter hiring metrics and analytics

### Interview Preparation (`/api/prep`)
- `GET /questions` - Filter questions by category and difficulty
- `POST /questions/:id/like` - Upvote question
- `GET /quizzes` - Retrieve list of assessments
- `GET /quizzes/:id` - Fetch assessment questions
- `POST /quizzes/:id/submit` - Grade answers, calculate score & award badge
- `GET /my-attempts` - Get user's quiz badges & scores
- `GET /companies` - Get FAANG company interview guides

### Companies (`/api/companies`)
- `GET /` - List all companies with active job counts
- `GET /:id` - Get company overview and open vacancies
- `GET /my-company` - Recruiter gets their own company
- `POST /my-company` - Recruiter updates company details

### Admin (`/api/admin`)
- `GET /stats` - System overview metrics
- `GET /users` - Manage registered users
- `PUT /users/:id/status` - Suspend / activate accounts
- `GET /jobs` - Review all jobs
- `DELETE /jobs/:id` - Remove inappropriate job
