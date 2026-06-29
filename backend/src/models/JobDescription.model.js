import mongoose from 'mongoose';

const jobDescriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    content: {
      type: String, // Original JD text
      required: true,
    },
    extractedKeywords: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

export default mongoose.model('JobDescription', jobDescriptionSchema);
