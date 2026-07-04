import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Button';
import { useNavigate, Link } from 'react-router-dom';
import { analyticsApi } from '../api/analytics.api';
import { motion, AnimatePresence } from 'framer-motion';
import { PageWrapper } from '../components/layout/PageWrapper';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { CARD_HOVER, STAGGER_CONTAINER, STAGGER_ITEM } from '../utils/animations';

const TwoToneCrown = ({ leftColor, rightColor, className }) => (
  <svg viewBox="0 0 100 80" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Base Left */}
    <path d="M15 72 L50 72 L50 78 L19 78 Q15 78 15 74 Z" fill={leftColor} />
    {/* Base Right */}
    <path d="M50 72 L85 72 L85 74 Q85 78 81 78 L50 78 Z" fill={rightColor} />
    
    {/* Left Body */}
    <path d="M12 30 L31 55 L50 20 L50 70 L17 70 Z" fill={leftColor} />
    
    {/* Right Body */}
    <path d="M50 20 L69 55 L88 30 L83 70 L50 70 Z" fill={rightColor} />

    {/* Dots */}
    <circle cx="12" cy="27" r="4" fill={leftColor} />
    <path d="M50 13 A 4 4 0 0 0 50 21 Z" fill={leftColor} />
    <path d="M50 13 A 4 4 0 0 1 50 21 Z" fill={rightColor} />
    <circle cx="88" cy="27" r="4" fill={rightColor} />
  </svg>
);

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

  const getRankInfo = (current) => {
    if (current < 10) return { name: 'Bronze', leftColor: '#e08f62', rightColor: '#8a503a', textColor: 'text-[#8a503a]', bar: 'bg-[#e08f62]', next: 10, nextName: 'Silver' };
    if (current < 20) return { name: 'Silver', leftColor: '#cfd4d8', rightColor: '#a7b1b8', textColor: 'text-[#a7b1b8]', bar: 'bg-[#cfd4d8]', next: 20, nextName: 'Gold' };
    if (current < 30) return { name: 'Gold', leftColor: '#f9bb00', rightColor: '#e59a00', textColor: 'text-[#e59a00]', bar: 'bg-[#f9bb00]', next: 30, nextName: 'Diamond' };
    return { name: 'Diamond', leftColor: '#4dd0e1', rightColor: '#00acc1', textColor: 'text-[#00acc1]', bar: 'bg-[#4dd0e1]', next: null, nextName: null };
  };

  const rank = stats ? getRankInfo(stats.totalInterviews) : getRankInfo(0);

  return (
    <PageWrapper className="space-y-8">
      {/* Welcome Banner */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-r from-primary via-indigo-500 to-secondary dark:from-primary dark:to-secondary p-8 rounded-[18px] text-white shadow-[0_10px_30px_-10px_rgba(var(--color-primary-rgb),0.5)] dark:shadow-glow-primary relative overflow-hidden bg-[length:200%_200%] animate-gradient-x"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2 flex items-center">
                {isNewUser ? 'Welcome, ' : 'Welcome back, '}
                {user?.name || (user?.email ? user.email.split('@')[0] : 'User')}! 
                <motion.span 
                  className="inline-block ml-2 origin-bottom-right"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                >
                  👋
                </motion.span>
              </h2>
              <p className="text-white/90 max-w-xl font-medium">
                {isNewUser 
                  ? "We're excited to have you! Start practicing your interviews to boost your ATS match scores and secure that dream offer." 
                  : "You're making great progress. Keep practicing your interviews to boost your ATS match scores and secure that dream offer."}
              </p>
            </div>
            
            {/* Floating blurred circles */}
            <motion.div 
              animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-10 -top-10 w-64 h-64 bg-white dark:bg-white/10 rounded-full blur-3xl mix-blend-overlay" 
            />
            <motion.div 
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-32 -bottom-20 w-48 h-48 bg-primary-light/40 dark:bg-secondary/40 rounded-full blur-3xl mix-blend-overlay" 
            />
            
            {/* Particles */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-neutral-darkCard p-6 rounded-[18px] border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient animate-pulse h-32 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-neutral-light/50 dark:via-white/5 to-transparent" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={STAGGER_ITEM} whileHover={CARD_HOVER} className="bg-white dark:bg-neutral-darkCard dark:hover:bg-neutral-darkCardSecondary p-6 rounded-[18px] border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient hover:shadow-md dark:hover:shadow-ambient-hover transition-all duration-300 relative overflow-hidden group cursor-default">
             <motion.div className="absolute top-0 left-0 w-1 h-full bg-blue-500 origin-bottom shadow-[2px_0_8px_rgba(59,130,246,0.6)]" whileHover={{ scaleY: 1.1 }} />
             <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-300" />
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2 relative z-10">Interviews Completed</h3>
             <AnimatedCounter value={stats?.totalInterviews || 0} className="text-4xl font-bold text-neutral-darkBg dark:text-white relative z-10 block" />
             <p className="text-xs text-neutral mt-2 relative z-10">Mock sessions</p>
          </motion.div>
          
          <motion.div variants={STAGGER_ITEM} whileHover={CARD_HOVER} className="bg-white dark:bg-neutral-darkCard dark:hover:bg-neutral-darkCardSecondary p-6 rounded-[18px] border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient hover:shadow-md dark:hover:shadow-ambient-hover transition-all duration-300 relative overflow-hidden group cursor-default">
             <motion.div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 origin-bottom shadow-[2px_0_8px_rgba(16,185,129,0.6)]" whileHover={{ scaleY: 1.1 }} />
             <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors duration-300" />
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2 relative z-10">Average Score</h3>
             <div className="flex items-end gap-2 relative z-10">
               <AnimatedCounter value={stats?.averageScore || 0} className="text-4xl font-bold text-neutral-darkBg dark:text-white block" />
               <span className="text-lg text-neutral font-medium mb-1">%</span>
             </div>
             <p className="text-xs text-neutral mt-2 relative z-10">Across all sessions</p>
          </motion.div>
          
          <motion.div variants={STAGGER_ITEM} whileHover={CARD_HOVER} className="bg-white dark:bg-neutral-darkCard dark:hover:bg-neutral-darkCardSecondary p-6 rounded-[18px] border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient hover:shadow-md dark:hover:shadow-ambient-hover transition-all duration-300 relative overflow-hidden group cursor-default">
             <motion.div className="absolute top-0 left-0 w-1 h-full bg-purple-500 origin-bottom shadow-[2px_0_8px_rgba(168,85,247,0.6)]" whileHover={{ scaleY: 1.1 }} />
             <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-300" />
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2 relative z-10">Highest Score</h3>
             <div className="flex items-end gap-2 relative z-10">
               <AnimatedCounter value={stats?.highestScore || 0} className="text-4xl font-bold text-neutral-darkBg dark:text-white block" />
               <span className="text-lg text-neutral font-medium mb-1">%</span>
             </div>
             <p className="text-xs text-neutral mt-2 relative z-10">Personal best</p>
          </motion.div>
          
          <motion.div variants={STAGGER_ITEM} whileHover={CARD_HOVER} className="bg-white dark:bg-neutral-darkCard dark:hover:bg-neutral-darkCardSecondary p-6 rounded-[18px] border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient hover:shadow-md dark:hover:shadow-ambient-hover transition-all duration-300 relative overflow-hidden group cursor-default">
             <motion.div className="absolute top-0 left-0 w-1 h-full bg-orange-500 origin-bottom shadow-[2px_0_8px_rgba(249,115,22,0.6)]" whileHover={{ scaleY: 1.1 }} />
             <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-300" />
             <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2 relative z-10">Resumes Uploaded</h3>
             <AnimatedCounter value={stats?.totalResumes || 0} className="text-4xl font-bold text-neutral-darkBg dark:text-white block relative z-10" />
             <p className="text-xs text-neutral mt-2 relative z-10">In your repository</p>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-darkCard rounded-[18px] border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral/10 dark:border-neutral-darkBorder flex justify-between items-center bg-neutral-light/30 dark:bg-neutral-darkCardSecondary/50">
            <h3 className="font-bold text-lg text-neutral-darkBg dark:text-neutral-textPrimary">Recent Interviews</h3>
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
                <h4 className="text-lg font-medium text-neutral-darkBg dark:text-white mb-2">No Interviews Yet</h4>
                <p className="text-neutral max-w-sm mb-6">Start your first AI mock interview to see your performance history and analytics here.</p>
                <Button onClick={() => navigate('/interview/setup')}>Start Practice</Button>
              </div>
            ) : (
              <ul className="divide-y divide-neutral/10">
                {recentActivity.map((session, index) => (
                  <motion.li 
                    key={session._id} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2, backgroundColor: "rgba(79, 140, 255, 0.05)" }}
                    className="p-6 transition-all flex items-center justify-between group relative border-l-2 border-transparent hover:border-primary dark:hover:bg-neutral-darkHover"
                  >
                    <div>
                      <h4 className="font-semibold text-neutral-darkBg dark:text-white group-hover:text-primary transition-colors">
                        {session.jobDescription?.title || 'Unknown Role'}
                      </h4>
                      <p className="text-sm text-neutral mt-1 group-hover:opacity-80 transition-opacity">
                        {new Date(session.createdAt).toLocaleDateString()} • {session.difficultyLevel.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm mb-1">
                          {session.status === 'completed' ? (
                            <span className="text-emerald-500 font-semibold uppercase text-xs">Completed</span>
                          ) : (
                            <span className="text-blue-500 font-semibold uppercase text-xs">Not Completed</span>
                          )}
                        </div>
                        {session.status === 'completed' && (
                          <div className={`text-xl font-bold ${session.overallScore >= 80 ? 'text-emerald-500' : session.overallScore >= 60 ? 'text-orange-500' : 'text-neutral-darkBg dark:text-white'}`}>
                            {session.overallScore || 0}%
                          </div>
                        )}
                      </div>
                      <Link to={session.status === 'completed' ? `/interview/${session._id}/feedback` : '#'}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={session.status !== 'completed'}
                          className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                        >
                          Review
                        </Button>
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
            <p className="text-sm text-neutral-darkBg dark:text-white mb-6">Upload a new version of your resume to parse latest skills.</p>
            <Button className="w-full" variant="secondary" onClick={() => navigate('/resumes')}>Upload Resume</Button>
          </div>

          <div className="bg-white dark:bg-neutral-darkCard rounded-[18px] p-6 border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient">
            <h3 className="font-bold text-lg text-neutral-darkBg dark:text-neutral-textPrimary mb-4">Your Rank</h3>
            {!isLoading && stats && (
              <div className="flex flex-col items-center my-4">
                <div className="flex flex-col items-center justify-center p-2 mb-2">
                  <motion.div 
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <TwoToneCrown leftColor={rank.leftColor} rightColor={rank.rightColor} className="w-24 h-24 filter drop-shadow-md hover:drop-shadow-xl transition-all duration-300" />
                  </motion.div>
                </div>
                
                {rank.next ? (
                  <div className="mt-2 w-full px-2">
                    <div className="flex justify-between text-xs font-medium text-neutral-darkBg dark:text-white mb-2">
                      <span>{stats?.totalInterviews || 0} Interviews</span>
                      <span>{rank.next} for {rank.nextName}</span>
                    </div>
                    <div className="w-full bg-neutral-light rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, ((stats?.totalInterviews || 0) / rank.next) * 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2 rounded-full ${rank.bar}`} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm font-bold text-primary">Max Rank Achieved!</div>
                )}
              </div>
            )}
            <p className="text-sm text-center text-neutral mt-2">
              Climb the ranks by practicing more interviews.
            </p>
          </div>
        </div>
      </div>
      </PageWrapper>
  );
};

export default Dashboard;
