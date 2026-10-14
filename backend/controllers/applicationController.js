import Application from '../models/Application.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Jobseeker)
export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl, resumeName } = req.body;
    const applicantId = req.user.id;

    const job = await Job.findById(jobId).populate('recruiter company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job posting is no longer accepting applications' });
    }

    // Check if duplicate application
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position',
      });
    }

    // Use uploaded resume or existing profile resume
    const userResume = resumeUrl || req.user.resume?.url;
    if (!userResume) {
      return res.status(400).json({
        success: false,
        message: 'Please provide or upload a resume to complete your application',
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      resumeUrl: userResume,
      resumeName: resumeName || req.user.resume?.originalName || 'resume.pdf',
      coverLetter: coverLetter || '',
      status: 'Applied',
      history: [
        {
          status: 'Applied',
          note: 'Application successfully submitted by candidate',
          timestamp: new Date(),
        },
      ],
    });

    // Increment applicantsCount on Job
    job.applicantsCount += 1;
    await job.save({ validateBeforeSave: false });

    // Send notification to applicant
    await User.findByIdAndUpdate(applicantId, {
      $push: {
        notifications: {
          title: 'Application Submitted!',
          message: `Your application for "${job.title}" at ${job.company?.name || 'Company'} has been sent.`,
          link: `/applications`,
          createdAt: new Date(),
        },
      },
    });

    // Send notification to recruiter
    if (job.recruiter) {
      await User.findByIdAndUpdate(job.recruiter._id, {
        $push: {
          notifications: {
            title: 'New Applicant Received!',
            message: `${req.user.name} applied for "${job.title}".`,
            link: `/recruiter/jobs/${job._id}/applicants`,
            createdAt: new Date(),
          },
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job seeker's applications
// @route   GET /api/applications/my-applications
// @access  Private (Jobseeker)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter, Admin)
export const getJobApplicants = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view applicants for this job' });
    }

    const { status } = req.query;
    const filter = { job: req.params.jobId };
    if (status && status !== 'All') {
      filter.status = status;
    }

    const applicants = await Application.find(filter)
      .populate('applicant', 'name email avatar phone bio location skills experienceLevel education experience resume')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applicants.length,
      jobTitle: job.title,
      applicants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter, Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status provided' });
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('applicant');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (note) application.recruiterNotes = note;

    application.history.push({
      status,
      note: note || `Status updated to ${status}`,
      timestamp: new Date(),
    });

    await application.save();

    // Notify candidate of status update
    await User.findByIdAndUpdate(application.applicant._id, {
      $push: {
        notifications: {
          title: `Application Status: ${status}`,
          message: `Your application status for "${application.job.title}" has been updated to "${status}".`,
          link: `/applications`,
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Candidate status updated to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter dashboard statistics
// @route   GET /api/applications/recruiter/stats
// @access  Private (Recruiter)
export const getRecruiterStats = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });
    const jobIds = jobs.map((j) => j._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'active').length;

    const applications = await Application.find({ job: { $in: jobIds } }).populate('job', 'title');
    const totalApplications = applications.length;

    const statusCounts = {
      Applied: 0,
      'Under Review': 0,
      Shortlisted: 0,
      Rejected: 0,
      Selected: 0,
    };

    applications.forEach((app) => {
      if (statusCounts[app.status] !== undefined) {
        statusCounts[app.status] += 1;
      }
    });

    const statusData = Object.keys(statusCounts).map((key) => ({
      name: key,
      value: statusCounts[key],
    }));

    // Applications per job
    const jobAppCounts = {};
    jobs.forEach((j) => {
      jobAppCounts[j.title] = 0;
    });
    applications.forEach((app) => {
      if (app.job?.title) {
        jobAppCounts[app.job.title] = (jobAppCounts[app.job.title] || 0) + 1;
      }
    });

    const jobsData = Object.keys(jobAppCounts).map((title) => ({
      name: title.length > 20 ? title.substring(0, 18) + '...' : title,
      applicants: jobAppCounts[title],
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        statusCounts,
        statusData,
        jobsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
