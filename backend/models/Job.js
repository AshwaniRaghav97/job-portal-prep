import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters'],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter is required'],
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      default: [],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
    },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Executive'],
      default: 'Mid-Level',
    },
    salaryMin: {
      type: Number,
      required: [true, 'Please provide minimum salary'],
    },
    salaryMax: {
      type: Number,
      required: [true, 'Please provide maximum salary'],
    },
    salaryCurrency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 'text', description: 'text', location: 'text', skillsRequired: 'text' });

const Job = mongoose.model('Job', jobSchema);
export default Job;
