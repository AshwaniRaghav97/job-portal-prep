import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Frontend', 'Backend', 'Full Stack', 'DSA', 'System Design', 'DevOps'],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    durationMinutes: {
      type: Number,
      default: 15,
    },
    badgeName: {
      type: String,
      default: 'Skill Master',
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true },
        explanation: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
