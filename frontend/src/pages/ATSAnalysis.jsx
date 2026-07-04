import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { resumeApi } from '../api/resume.api';
import { jobApi } from '../api/job.api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Skeleton } from '../components/ui/Skeleton';

const ATSAnalysis = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobContent, setJobContent] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const loadingSteps = [
    "Analyzing Resume...",
    "Thinking...",
    "Finding Skills...",
    "Checking ATS Keywords...",
    "Calculating Match Score...",
    "Almost Done..."
  ];

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const fetchResumes = async () => {
    try {
      const data = await resumeApi.getMyResumes();
      setResumes(data.resumes);
      if (data.resumes.length > 0) {
        setSelectedResumeId(data.resumes[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobTitle || !jobContent) {
      setError('Please fill in all required fields and select a resume.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError('');
      
      // 1. Create the Job Description
      const jobRes = await jobApi.createJob({ title: jobTitle, company: jobCompany, content: jobContent });
      
      // 2. Analyze
      const analysisRes = await jobApi.analyzeMatch(selectedResumeId, jobRes.job._id);
      setAnalysisResult(analysisRes.analysis);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-neutral-light dark:bg-transparent p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-darkBg dark:text-white">ATS Match Analyzer</h1>
            <p className="text-neutral mt-1">Compare your resume against a job description.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-darkCard p-6 rounded-xl border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient">
              <h2 className="text-xl font-semibold mb-4 text-neutral-darkBg dark:text-white">1. Select Resume</h2>
              {resumes.length === 0 ? (
                <div className="p-4 bg-orange-50 text-orange-600 rounded-md text-sm border border-orange-200">
                  You haven't uploaded any resumes yet. <Link to="/resumes" className="underline font-semibold">Upload one here</Link>.
                </div>
              ) : (
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border border-neutral/30 dark:border-neutral-darkBorder bg-white dark:bg-neutral-darkInput text-neutral-darkBg dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.originalName} (Parsed: {new Date(r.createdAt).toLocaleDateString()})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-white dark:bg-neutral-darkCard p-6 rounded-xl border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient">
              <h2 className="text-xl font-semibold mb-4 text-neutral-darkBg dark:text-white">2. Paste Job Description</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg dark:text-neutral-textSecondary mb-1">Job Title *</label>
                    <input 
                      className="w-full h-10 px-3 py-2 rounded-md border border-neutral/30 dark:border-neutral-darkBorder bg-white dark:bg-neutral-darkInput text-neutral-darkBg dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Software Engineer"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg dark:text-neutral-textSecondary mb-1">Company</label>
                    <input 
                      className="w-full h-10 px-3 py-2 rounded-md border border-neutral/30 dark:border-neutral-darkBorder bg-white dark:bg-neutral-darkInput text-neutral-darkBg dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Google"
                      value={jobCompany}
                      onChange={e => setJobCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg dark:text-neutral-textSecondary mb-1">Job Description Content *</label>
                  <textarea 
                    className="w-full h-64 px-3 py-2 rounded-md border border-neutral/30 dark:border-neutral-darkBorder bg-white dark:bg-neutral-darkInput text-neutral-darkBg dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Paste the full job description here..."
                    value={jobContent}
                    onChange={e => setJobContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              
              <Button 
                className="w-full mt-6" 
                size="lg" 
                onClick={handleAnalyze}
                isLoading={isAnalyzing}
                disabled={resumes.length === 0}
              >
                Analyze ATS Compatibility
              </Button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-white dark:bg-neutral-darkCard p-6 rounded-xl border border-neutral/20 dark:border-neutral-darkBorder shadow-sm dark:shadow-ambient relative overflow-hidden flex flex-col min-h-[400px]">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white dark:bg-neutral-darkCard z-10"
                >
                  <div className="w-full max-w-xs space-y-6">
                    <div className="flex justify-between text-sm font-medium text-primary">
                      <motion.span
                        key={loadingStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        {loadingSteps[loadingStep]}
                      </motion.span>
                      <span>{Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-light dark:bg-neutral-darkCardSecondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="space-y-3 mt-8">
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-5/6 rounded-md" />
                      <Skeleton className="h-4 w-4/6 rounded-md" />
                    </div>
                  </div>
                </motion.div>
              ) : !analysisResult ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center opacity-70 p-12"
                >
                  <motion.div
                    animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mb-6"
                  >
                    <svg className="w-20 h-20 text-neutral drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <motion.div 
                      className="absolute -right-2 -bottom-2 w-8 h-8 bg-white dark:bg-neutral-darkCardSecondary rounded-full flex items-center justify-center shadow-sm dark:shadow-ambient"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-medium text-neutral-darkBg dark:text-white">Awaiting Analysis</h3>
                  <p className="text-neutral mt-2 max-w-sm">Fill out the details on the left and hit analyze to see your ATS score and missing keywords.</p>
                </motion.div>
              ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-8"
              >
                <div className="flex flex-col items-center justify-center pt-4">
                  <h3 className="text-lg font-medium text-neutral-darkBg dark:text-white mb-6">Match Score</h3>
                  <ProgressCircle percentage={analysisResult.score} size={160} strokeWidth={12} />
                  <p className="mt-6 text-center text-neutral text-sm max-w-sm">
                    {analysisResult.score >= 80 ? 'Excellent match! Your resume is highly tailored for this role.' : 
                     analysisResult.score >= 50 ? 'Good match. Consider adding some missing keywords to improve your chances.' : 
                     'Low match. We strongly recommend tailoring your resume to include the missing skills.'}
                  </p>
                </div>

                <hr className="border-neutral/20 dark:border-neutral-darkBorder" />

                <div>
                  <h3 className="text-lg font-medium text-neutral-darkBg dark:text-white mb-4">Missing Keywords</h3>
                  {analysisResult.missingKeywords.length === 0 ? (
                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-200">
                      Perfect! We couldn't find any major keywords missing from your resume.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingKeywords.slice(0, 20).map(kw => (
                        <span key={kw} className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 text-sm rounded-full">
                          {kw}
                        </span>
                      ))}
                      {analysisResult.missingKeywords.length > 20 && (
                        <span className="px-3 py-1 bg-neutral-light dark:bg-neutral-darkCardSecondary text-neutral dark:text-neutral-textSecondary text-sm rounded-full border border-neutral/20 dark:border-neutral-darkBorder">
                          +{analysisResult.missingKeywords.length - 20} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary-dark dark:text-primary mb-2">Pro Tip</h4>
                  <p className="text-sm text-neutral-darkBg dark:text-neutral-textPrimary">
                    {analysisResult.proTip || "Don't just randomly insert these keywords. Try to naturally incorporate them into your bullet points, demonstrating how you used these skills to achieve tangible results."}
                  </p>
                </div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ATSAnalysis;
