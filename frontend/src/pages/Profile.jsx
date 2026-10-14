import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Upload,
  CheckCircle2,
  X,
  Plus,
  Sparkles,
  Eye,
  Award,
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setCurrentTitle(user.currentTitle || '');
      setExperienceLevel(user.experienceLevel || 'Fresher');
      setBio(user.bio || '');
      setSkills(user.skills || []);
    }
  }, [user]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [recRes, recViewedRes] = await Promise.all([
          api.get('/users/recommended-jobs'),
          api.get('/users/recently-viewed'),
        ]);

        if (recRes.data?.success) {
          setRecommendedJobs(recRes.data.jobs || []);
        }
        if (recViewedRes.data?.success) {
          setRecentlyViewed(recViewedRes.data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingExtras(false);
      }
    };

    fetchExtras();
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await api.put('/users/profile', {
        name,
        phone,
        location,
        currentTitle,
        experienceLevel,
        bio,
        skills,
      });

      if (res.data?.success) {
        updateUser(res.data.user);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/users/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        updateUser({
          ...user,
          resume: res.data.resume,
        });
        alert('Resume uploaded and attached to your profile!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload resume.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Professional Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Keep your skills, experience, and resume updated for top tech recruiters
          </p>
        </div>

        {successMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form: Profile Details & Skills */}
        <div className="lg:col-span-2 space-y-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Professional Title / Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Fresher">Fresher / Graduate</option>
                  <option value="Junior">Junior (1-2 yrs)</option>
                  <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                  <option value="Lead">Lead / Architect</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                About / Bio
              </label>
              <textarea
                rows={4}
                placeholder="Highlight your background, key technologies, and what roles you are seeking..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Skills Tag Management */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Skills & Technologies ({skills.length})
              </label>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. React, Next.js, Docker..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(e);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold transition"
                >
                  Add Skill
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Resume Card & Quick Info */}
        <div className="space-y-6">
          {/* Resume Upload Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              Active Resume / CV
            </h3>

            {user?.resume?.url ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                  {user.resume.originalName || 'resume.pdf'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Uploaded on {new Date(user.resume.uploadedAt).toLocaleDateString()}
                </p>
                <a
                  href={user.resume.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs font-bold text-indigo-600 hover:underline pt-1"
                >
                  View / Download PDF →
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No resume uploaded yet. Upload a PDF or DOC file to apply with one click.
              </p>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Upload New Resume
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs matching Skills */}
      {recommendedJobs.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recommended Jobs Based on Your Skills
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Jobs */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Recently Viewed Jobs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyViewed.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
