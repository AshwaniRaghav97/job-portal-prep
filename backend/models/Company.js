import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide company description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    website: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Please provide company headquarters location'],
    },
    logo: {
      type: String,
      default: '',
    },
    industry: {
      type: String,
      required: [true, 'Please provide company industry'],
      default: 'Technology',
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500-1000', '1000+'],
      default: '51-200',
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model('Company', companySchema);
export default Company;
