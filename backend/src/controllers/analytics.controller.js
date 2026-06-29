import InterviewSession from '../models/InterviewSession.model.js';
import Resume from '../models/Resume.model.js';
import JobDescription from '../models/JobDescription.model.js';

// @desc    Get dashboard analytics for user
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all completed sessions
    const completedSessions = await InterviewSession.find({ 
      user: userId, 
      status: 'completed' 
    });

    const totalInterviews = completedSessions.length;
    
    let averageScore = 0;
    let highestScore = 0;
    
    if (totalInterviews > 0) {
      const totalScoreSum = completedSessions.reduce((acc, session) => acc + (session.overallScore || 0), 0);
      averageScore = Math.round(totalScoreSum / totalInterviews);
      highestScore = Math.max(...completedSessions.map(s => s.overallScore || 0));
    }

    // 2. Get counts for other entities
    const totalResumes = await Resume.countDocuments({ user: userId });
    const totalJobs = await JobDescription.countDocuments({ user: userId });

    // 3. Get recent activity (last 5 interviews)
    const recentInterviews = await InterviewSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('jobDescription', 'title company');

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews,
        averageScore,
        highestScore,
        totalResumes,
        totalJobs
      },
      recentActivity: recentInterviews
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};
