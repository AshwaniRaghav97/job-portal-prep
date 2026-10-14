import User from '../models/User.js';
import Job from '../models/Job.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      bio,
      location,
      currentTitle,
      experienceLevel,
      skills,
      education,
      experience,
      avatar,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (currentTitle !== undefined) user.currentTitle = currentTitle;
    if (experienceLevel !== undefined) user.experienceLevel = experienceLevel;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (education !== undefined) user.education = education;
    if (experience !== undefined) user.experience = experience;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user resume
// @route   POST /api/users/resume
// @access  Private (Jobseeker)
export const uploadResumeFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findById(req.user.id);
    const fileUrl = `/uploads/resumes/${req.file.filename}`;

    user.resume = {
      url: fileUrl,
      originalName: req.file.originalname,
      uploadedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: user.resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job recommendations based on candidate skills
// @route   GET /api/users/recommended-jobs
// @access  Private
export const getRecommendedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.skills || user.skills.length === 0) {
      // Fallback to top featured active jobs
      const defaultJobs = await Job.find({ status: 'active' })
        .populate('company', 'name logo location industry')
        .sort({ createdAt: -1 })
        .limit(6);
      return res.status(200).json({ success: true, count: defaultJobs.length, jobs: defaultJobs });
    }

    // Match jobs containing user skills
    const jobs = await Job.find({
      status: 'active',
      skillsRequired: { $in: user.skills.map((s) => new RegExp(s.trim(), 'i')) },
    })
      .populate('company', 'name logo location industry')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add job to recently viewed
// @route   POST /api/users/recently-viewed/:jobId
// @access  Private
export const addRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { jobId } = req.params;

    // Filter out if already in array, then unshift
    user.recentlyViewedJobs = user.recentlyViewedJobs.filter(
      (id) => id.toString() !== jobId
    );
    user.recentlyViewedJobs.unshift(jobId);

    // Keep only last 10
    if (user.recentlyViewedJobs.length > 10) {
      user.recentlyViewedJobs = user.recentlyViewedJobs.slice(0, 10);
    }

    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recently viewed jobs
// @route   GET /api/users/recently-viewed
// @access  Private
export const getRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'recentlyViewedJobs',
      populate: { path: 'company', select: 'name logo location industry' },
    });

    res.status(200).json({
      success: true,
      jobs: user.recentlyViewedJobs || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      notifications: user.notifications || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const notif = user.notifications.id(req.params.id);
    if (notif) {
      notif.read = true;
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};
