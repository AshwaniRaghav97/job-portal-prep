import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker',
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    location: {
      type: String,
      default: '',
    },
    currentTitle: {
      type: String,
      default: '',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Executive'],
      default: 'Fresher',
    },
    skills: {
      type: [String],
      default: [],
    },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    resume: {
      url: { type: String, default: '' },
      originalName: { type: String, default: '' },
      uploadedAt: { type: Date, default: null },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
    recentlyViewedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    notifications: [
      {
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String, default: '' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
