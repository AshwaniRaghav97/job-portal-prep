import mongoose from 'mongoose';

const prepQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Full Stack', 'DSA', 'System Design', 'DevOps', 'Behavioral'],
      index: true,
    },
    topic: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    codeExample: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    popularInCompanies: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

prepQuestionSchema.index({ question: 'text', answer: 'text', topic: 'text' });

const PrepQuestion = mongoose.model('PrepQuestion', prepQuestionSchema);
export default PrepQuestion;
