import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobDescription',
      required: true,
    },
    difficultyLevel: {
      type: String,
      enum: ['intern', 'fresher', 'sde-1', 'sde-2', 'senior'],
      default: 'fresher',
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'incomplete'],
      default: 'in-progress',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    overallScore: {
      type: Number,
    },
    overallFeedback: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model('InterviewSession', interviewSessionSchema);
