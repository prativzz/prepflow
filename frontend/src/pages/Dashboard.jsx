import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { analyticsApi } from '../api/analytics.api';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showWelcome] = useState(() => {
    return !sessionStorage.getItem('welcomeShown');
  });

  const [isNewUser] = useState(() => {
    if (!user || !user.createdAt) return false;
    const createdDate = new Date(user.createdAt);
    return (new Date() - createdDate < 5 * 60 * 1000); // 5 minutes
  });

  useEffect(() => {
    if (showWelcome) {
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, [showWelcome]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsApi.getDashboardStats();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      {showWelcome && (
        <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              {isNewUser ? 'Welcome, ' : 'Welcome back, '}
              {user?.name || (user?.email ? user.email.split('@')[0] : 'User')}! 👋
            </h2>
            <p className="text-white/80 max-w-xl">
              {isNewUser 
                ? "We're excited to have you! Start practicing your interviews to boost your ATS match scores and secure that dream offer." 
                : "You're making great progress. Keep practicing your interviews to boost your ATS match scores and secure that dream offer."}
            </p>
          </div>
          {/* Decorative circle */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm animate-pulse h-32"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2">Interviews Completed</h3>
             <p className="text-4xl font-bold text-neutral-darkBg">{stats.totalInterviews}</p>
             <p className="text-xs text-neutral mt-2">Mock sessions</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2">Average Score</h3>
             <div className="flex items-end gap-2">
               <p className="text-4xl font-bold text-neutral-darkBg">{stats.averageScore}</p>
               <span className="text-lg text-neutral font-medium mb-1">%</span>
             </div>
             <p className="text-xs text-neutral mt-2">Across all sessions</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2">Highest Score</h3>
             <div className="flex items-end gap-2">
               <p className="text-4xl font-bold text-neutral-darkBg">{stats.highestScore}</p>
               <span className="text-lg text-neutral font-medium mb-1">%</span>
             </div>
             <p className="text-xs text-neutral mt-2">Personal best</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2">Resumes Uploaded</h3>
             <p className="text-4xl font-bold text-neutral-darkBg">{stats.totalResumes}</p>
             <p className="text-xs text-neutral mt-2">In your repository</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral/20 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral/10 flex justify-between items-center bg-neutral-light/30">
            <h3 className="font-bold text-lg text-neutral-darkBg">Recent Interviews</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/interview/setup')}>+ New Interview</Button>
          </div>
          <div className="p-0 flex-1">
            {isLoading ? (
               <div className="p-8 text-center text-neutral">Loading activity...</div>
            ) : recentActivity.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </div>
                <h4 className="text-lg font-medium text-neutral-darkBg mb-2">No Interviews Yet</h4>
                <p className="text-neutral max-w-sm mb-6">Start your first AI mock interview to see your performance history and analytics here.</p>
                <Button onClick={() => navigate('/interview/setup')}>Start Practice</Button>
              </div>
            ) : (
              <ul className="divide-y divide-neutral/10">
                {recentActivity.map((session) => (
                  <motion.li 
                    key={session._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-neutral-light/50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-semibold text-neutral-darkBg group-hover:text-primary transition-colors">
                        {session.jobDescription?.title || 'Unknown Role'}
                      </h4>
                      <p className="text-sm text-neutral mt-1">
                        {new Date(session.createdAt).toLocaleDateString()} • {session.difficultyLevel.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-neutral font-medium mb-1">Score</div>
                        <div className={`text-xl font-bold ${session.overallScore >= 80 ? 'text-emerald-500' : session.overallScore >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                          {session.overallScore || 0}%
                        </div>
                      </div>
                      <Link to={`/interview/${session._id}/feedback`}>
                        <Button variant="outline" size="sm">Review</Button>
                      </Link>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar inside Dashboard */}
        <div className="space-y-6">
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-primary-dark mb-2">Resume Optimization</h3>
            <p className="text-sm text-neutral-darkBg mb-6">Upload a new version of your resume to parse latest skills.</p>
            <Button className="w-full" variant="secondary" onClick={() => navigate('/resumes')}>Upload Resume</Button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral/20 shadow-sm">
            <h3 className="font-bold text-lg text-neutral-darkBg mb-4">Prep Progress</h3>
            {!isLoading && stats && (
              <div className="flex justify-center my-6">
                 <ProgressCircle percentage={Math.min(100, Math.round((stats.totalInterviews / 10) * 100))} size={140} strokeWidth={12} />
              </div>
            )}
            <p className="text-sm text-center text-neutral">
              Complete {Math.max(0, 10 - (stats?.totalInterviews || 0))} more mock interviews to master your delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
