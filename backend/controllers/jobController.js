import Job from '../models/Job.js';
import Company from '../models/Company.js';
import SavedJob from '../models/SavedJob.js';
import Application from '../models/Application.js';

// @desc    Get all jobs with search, filtering, and pagination
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      workMode,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'active' };

    // Search keyword across title, skills, and description
    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: regex },
        { skillsRequired: regex },
        { description: regex },
      ];
    }

    // Location filter
    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Work mode filter (Remote, Hybrid, On-site)
    if (workMode && workMode !== 'all') {
      const modes = Array.isArray(workMode) ? workMode : workMode.split(',');
      query.workMode = { $in: modes };
    }

    // Job type filter (Full-time, Part-time, Contract, Internship)
    if (jobType && jobType !== 'all') {
      const types = Array.isArray(jobType) ? jobType : jobType.split(',');
      query.jobType = { $in: types };
    }

    // Experience level
    if (experienceLevel && experienceLevel !== 'all') {
      const expLevels = Array.isArray(experienceLevel) ? experienceLevel : experienceLevel.split(',');
      query.experienceLevel = { $in: expLevels };
    }

    // Salary range filter
    if (minSalary) {
      query.salaryMax = { $gte: Number(minSalary) };
    }
    if (maxSalary) {
      query.salaryMin = { $lte: Number(maxSalary) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'salary_desc') sortOption = { salaryMax: -1 };
    if (sort === 'salary_asc') sortOption = { salaryMin: 1 };
    if (sort === 'views') sortOption = { viewsCount: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry size website')
      .populate('recruiter', 'name email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email avatar');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    // Increment views
    job.viewsCount += 1;
    await job.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter, Admin)
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      skillsRequired,
      location,
      workMode,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      salaryCurrency,
      deadline,
    } = req.body;

    // Check recruiter's company
    let companyId = req.user.company;
    if (!companyId) {
      // Find company associated with recruiter
      const company = await Company.findOne({ recruiter: req.user._id });
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Please complete your Company Profile before posting a job.',
        });
      }
      companyId = company._id;
    }

    const job = await Job.create({
      title,
      company: companyId,
      recruiter: req.user._id,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map((s) => s.trim()) : []),
      location,
      workMode,
      jobType,
      experienceLevel,
      salaryMin: Number(salaryMin),
      salaryMax: Number(salaryMax),
      salaryCurrency: salaryCurrency || 'USD',
      deadline: deadline || null,
    });

    const populatedJob = await Job.findById(job._id).populate('company');

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job: populatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter, Admin)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check ownership unless admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this job posting',
      });
    }

    const updateData = { ...req.body };
    if (typeof updateData.requirements === 'string') {
      updateData.requirements = updateData.requirements.split('\n').filter(Boolean);
    }
    if (typeof updateData.responsibilities === 'string') {
      updateData.responsibilities = updateData.responsibilities.split('\n').filter(Boolean);
    }
    if (typeof updateData.skillsRequired === 'string') {
      updateData.skillsRequired = updateData.skillsRequired.split(',').map((s) => s.trim());
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('company');

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter, Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this job posting',
      });
    }

    // Remove associated applications and saved entries
    await Application.deleteMany({ job: job._id });
    await SavedJob.deleteMany({ job: job._id });
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job posting and related applications deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's posted jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
export const getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle save/wishlist job
// @route   POST /api/jobs/:id/save
// @access  Private (Jobseeker)
export const toggleSaveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const existing = await SavedJob.findOne({ user: userId, job: jobId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        success: true,
        saved: false,
        message: 'Job removed from saved list',
      });
    }

    await SavedJob.create({ user: userId, job: jobId });
    res.status(201).json({
      success: true,
      saved: true,
      message: 'Job saved to wishlist',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved wishlist jobs
// @route   GET /api/jobs/user/saved-jobs
// @access  Private (Jobseeker)
export const getSavedJobs = async (req, res, next) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' },
      })
      .sort({ createdAt: -1 });

    const jobs = savedJobs.map((item) => item.job).filter(Boolean);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};
