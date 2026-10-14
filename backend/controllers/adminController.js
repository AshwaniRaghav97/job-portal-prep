import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';

// @desc    Get system-wide metrics and chart analytics for Admin
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'jobseeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // User growth by role
    const usersByRole = [
      { name: 'Job Seekers', count: totalUsers },
      { name: 'Recruiters', count: totalRecruiters },
      { name: 'Companies', count: totalCompanies },
    ];

    // Status breakdown
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Jobs by work mode
    const jobsByWorkMode = await Job.aggregate([
      { $group: { _id: '$workMode', count: { $sum: 1 } } },
    ]);

    // Recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentJobs = await Job.find().populate('company', 'name').sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        totalCompanies,
        usersByRole,
        applicationsByStatus: applicationsByStatus.map((item) => ({ name: item._id, value: item.count })),
        jobsByWorkMode: jobsByWorkMode.map((item) => ({ name: item._id, value: item.count })),
        recentUsers,
        recentJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for Admin
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suspend or activate user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatusAdmin = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot modify admin status' });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${status}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for Admin management
// @route   GET /api/admin/jobs
// @access  Private (Admin)
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.title = new RegExp(search, 'i');
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any inappropriate job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
export const deleteJobAdmin = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job listing and associated applications removed by admin',
    });
  } catch (error) {
    next(error);
  }
};
