import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewSession',
      required: true,
    },
    type: {
      type: String,
      enum: ['behavioral', 'technical', 'resume-based', 'project-based', 'situational', 'technical-coding'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userAnswer: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'answered', 'skipped'],
      default: 'pending',
    },
    order: {
      type: Number,
      required: true,
    },
    feedback: {
      score: { type: Number },
      strengths: [String],
      improvements: [String],
    }
  },
  { timestamps: true }
);

export default mongoose.model('Question', questionSchema);
