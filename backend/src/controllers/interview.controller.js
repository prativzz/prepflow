import InterviewSession from '../models/InterviewSession.model.js';
import Question from '../models/Question.model.js';
import Resume from '../models/Resume.model.js';
import JobDescription from '../models/JobDescription.model.js';
import { generateQuestions } from '../ai/ai.service.js';

// @desc    Start a new interview session
// @route   POST /api/interviews/start
// @access  Private
export const startSession = async (req, res) => {
  try {
    const { resumeId, jobId, difficultyLevel } = req.body;

    if (!resumeId || !jobId) {
      return res.status(400).json({ success: false, message: 'Please provide resumeId and jobId' });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
    const job = await JobDescription.findOne({ _id: jobId, user: req.user.id });

    if (!resume || !job) {
      return res.status(404).json({ success: false, message: 'Resume or Job not found' });
    }

    const session = await InterviewSession.create({
      user: req.user.id,
      resume: resume._id,
      jobDescription: job._id,
      difficultyLevel: difficultyLevel || 'fresher',
    });

    // Generate questions
    const generatedQuestions = await generateQuestions(resume, job, session.difficultyLevel, 5);
    
    // Save questions
    const questionDocs = generatedQuestions.map(q => ({
      ...q,
      session: session._id,
    }));
    await Question.insertMany(questionDocs);

    res.status(201).json({ success: true, sessionId: session._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to start session' });
  }
};

// @desc    Get next unanswered question
// @route   GET /api/interviews/:id/next-question
// @access  Private
export const getNextQuestion = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const nextQuestion = await Question.findOne({ 
      session: session._id, 
      status: 'pending' 
    }).sort({ order: 1 });

    if (!nextQuestion) {
      session.status = 'completed';
      session.completedAt = Date.now();
      await session.save();
      return res.status(200).json({ success: true, completed: true, message: 'Interview completed' });
    }

    res.status(200).json({ success: true, completed: false, question: nextQuestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to get question' });
  }
};

// @desc    Submit answer for a question
// @route   POST /api/interviews/:id/answer
// @access  Private
export const submitAnswer = async (req, res) => {
  try {
    const { questionId, answerText } = req.body;

    const question = await Question.findOne({ _id: questionId });
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    question.userAnswer = answerText;
    question.status = 'answered';
    await question.save();

    res.status(200).json({ success: true, message: 'Answer saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to submit answer' });
  }
};

// @desc    Analyze completed session
// @route   POST /api/interviews/:id/analyze
// @access  Private
export const analyzeInterview = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    if (!session || session.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Session not valid for analysis' });
    }

    // Import dynamically to avoid circular dependencies if any, but static import is fine here since it's already imported
    const { analyzeSession } = await import('../ai/ai.service.js');
    
    const questions = await Question.find({ session: session._id });
    await analyzeSession(session, questions);

    res.status(200).json({ success: true, message: 'Analysis complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to analyze session' });
  }
};

// @desc    Get Feedback for Session
// @route   GET /api/interviews/:id/feedback
// @access  Private
export const getFeedback = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id })
      .populate('jobDescription', 'title company');
      
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const questions = await Question.find({ session: session._id }).sort({ order: 1 });

    res.status(200).json({ success: true, session, questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
};

// @desc    End Session Early (Incomplete)
// @route   POST /api/interviews/:id/end-early
// @access  Private
export const endSessionEarly = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status !== 'in-progress') {
      return res.status(400).json({ success: false, message: 'Session is already completed or ended' });
    }

    session.status = 'incomplete';
    session.completedAt = Date.now();
    await session.save();

    res.status(200).json({ success: true, message: 'Interview ended early' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to end interview early' });
  }
};
