import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

import Resume from '../models/Resume.model.js';
import User from '../models/User.model.js';
import { uploadBufferToCloudinary } from '../utils/cloudinary.utils.js';
import { extractKeywords } from '../utils/atsAnalyzer.utils.js';
import { v2 as cloudinary } from 'cloudinary';

// @desc    Upload a new resume (PDF)
// @route   POST /api/resumes/upload
// @access  Private
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
    }

    // 1. Parse PDF text from buffer
    const pdfData = await pdf(req.file.buffer);
    const parsedText = pdfData.text;

    // 2. Extract Keywords
    const extractedKeywords = extractKeywords(parsedText);

    // 3. Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(req.file.buffer);

    // 4. Save to MongoDB
    const resume = await Resume.create({
      user: req.user.id,
      originalName: req.file.originalname,
      fileUrl: cloudinaryResult.secure_url,
      parsedText,
      extractedKeywords,
    });

    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ success: false, message: 'Server error processing resume' });
  }
};

// @desc    Get all resumes for the user
// @route   GET /api/resumes
// @access  Private
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching resumes' });
  }
};
