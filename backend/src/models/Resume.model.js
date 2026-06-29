import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    parsedText: {
      type: String,
      required: true,
    },
    extractedKeywords: {
      type: [String],
      default: [],
    },
    version: {
      type: Number,
      default: 1,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
