import JobDescription from '../models/JobDescription.model.js';
import Resume from '../models/Resume.model.js';
import { extractKeywords, analyzeATS } from '../utils/atsAnalyzer.utils.js';
import { evaluateATS } from '../ai/ai.service.js';

// @desc    Save a new Job Description
// @route   POST /api/jobs
// @access  Private
export const createJobDescription = async (req, res) => {
  try {
    const { title, company, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const extractedKeywords = extractKeywords(content);

    const job = await JobDescription.create({
      user: req.user.id,
      title,
      company,
      content,
      extractedKeywords,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, message: 'Server error creating job description' });
  }
};

// @desc    Get all Job Descriptions for user
// @route   GET /api/jobs
// @access  Private
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await JobDescription.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
};

// @desc    Analyze ATS match between Resume and JD
// @route   POST /api/jobs/analyze
// @access  Private
export const analyzeATSMatch = async (req, res) => {
  try {
    const { resumeId, jobId } = req.body;

    if (!resumeId || !jobId) {
      return res.status(400).json({ success: false, message: 'Please provide resumeId and jobId' });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    const job = await JobDescription.findOne({ _id: jobId, user: req.user.id });

    if (!resume || !job) {
      return res.status(404).json({ success: false, message: 'Resume or Job Description not found' });
    }

    const analysis = await evaluateATS(resume.parsedText, job.content);

    res.status(200).json({
      success: true,
      analysis,
      resumeOriginalName: resume.originalName,
      jobTitle: job.title
    });
  } catch (error) {
    console.error('Error analyzing ATS:', error);
    res.status(500).json({ success: false, message: 'Server error during analysis' });
  }
};
