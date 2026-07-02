import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { resumeApi } from '../api/resume.api';
import { jobApi } from '../api/job.api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ATSAnalysis = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobContent, setJobContent] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

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
    <div className="min-h-screen bg-neutral-light p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-darkBg">ATS Match Analyzer</h1>
            <p className="text-neutral mt-1">Compare your resume against a job description.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-neutral-darkBg">1. Select Resume</h2>
              {resumes.length === 0 ? (
                <div className="p-4 bg-orange-50 text-orange-600 rounded-md text-sm border border-orange-200">
                  You haven't uploaded any resumes yet. <Link to="/resumes" className="underline font-semibold">Upload one here</Link>.
                </div>
              ) : (
                <select 
                  className="w-full h-10 px-3 py-2 rounded-md border border-neutral/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                >
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.originalName} (Parsed: {new Date(r.createdAt).toLocaleDateString()})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-neutral-darkBg">2. Paste Job Description</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg mb-1">Job Title *</label>
                    <input 
                      className="w-full h-10 px-3 py-2 rounded-md border border-neutral/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Software Engineer"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg mb-1">Company</label>
                    <input 
                      className="w-full h-10 px-3 py-2 rounded-md border border-neutral/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g. Google"
                      value={jobCompany}
                      onChange={e => setJobCompany(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg mb-1">Job Description Content *</label>
                  <textarea 
                    className="w-full h-64 px-3 py-2 rounded-md border border-neutral/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
          <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm relative overflow-hidden">
            {!analysisResult ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 p-12">
                <svg className="w-16 h-16 mb-4 text-neutral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium text-neutral-darkBg">Awaiting Analysis</h3>
                <p className="text-neutral mt-2">Fill out the details on the left and hit analyze to see your ATS score and missing keywords.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="space-y-8"
              >
                <div className="flex flex-col items-center justify-center pt-4">
                  <h3 className="text-lg font-medium text-neutral-darkBg mb-6">Match Score</h3>
                  <ProgressCircle percentage={analysisResult.score} size={160} strokeWidth={12} />
                  <p className="mt-6 text-center text-neutral text-sm max-w-sm">
                    {analysisResult.score >= 80 ? 'Excellent match! Your resume is highly tailored for this role.' : 
                     analysisResult.score >= 50 ? 'Good match. Consider adding some missing keywords to improve your chances.' : 
                     'Low match. We strongly recommend tailoring your resume to include the missing skills.'}
                  </p>
                </div>

                <hr className="border-neutral/20" />

                <div>
                  <h3 className="text-lg font-medium text-neutral-darkBg mb-4">Missing Keywords</h3>
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
                        <span className="px-3 py-1 bg-neutral-light text-neutral text-sm rounded-full border border-neutral/20">
                          +{analysisResult.missingKeywords.length - 20} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-primary-dark mb-2">Pro Tip</h4>
                  <p className="text-sm text-neutral-darkBg">
                    {analysisResult.proTip || "Don't just randomly insert these keywords. Try to naturally incorporate them into your bullet points, demonstrating how you used these skills to achieve tangible results."}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSAnalysis;
