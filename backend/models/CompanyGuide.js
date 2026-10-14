import mongoose from 'mongoose';

const companyGuideSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    tagline: {
      type: String,
      default: '',
    },
    overview: {
      type: String,
      required: true,
    },
    hiringProcess: [
      {
        stepNumber: Number,
        stage: String,
        description: String,
        proTip: String,
      },
    ],
    frequentTopics: {
      type: [String],
      default: [],
    },
    sampleQuestions: [
      {
        question: String,
        round: String,
        difficulty: String,
        tips: String,
      },
    ],
    cultureNotes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CompanyGuide = mongoose.model('CompanyGuide', companyGuideSchema);
export default CompanyGuide;
