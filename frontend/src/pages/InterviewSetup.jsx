import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { resumeApi } from '../api/resume.api';
import { jobApi } from '../api/job.api';
import { interviewApi } from '../api/interview.api';
import { Link } from 'react-router-dom';

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  const [selectedResume, setSelectedResume] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('fresher');
  
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeData, jobData] = await Promise.all([
          resumeApi.getMyResumes(),
          jobApi.getMyJobs()
        ]);
        
        setResumes(resumeData.resumes);
        setJobs(jobData.jobs);
        
        if (resumeData.resumes.length > 0) setSelectedResume(resumeData.resumes[0]._id);
        if (jobData.jobs.length > 0) setSelectedJob(jobData.jobs[0]._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleStart = async () => {
    if (!selectedResume || !selectedJob) {
      setError('Please select both a resume and a job description.');
      return;
    }

    try {
      setIsStarting(true);
      setError('');
      
      const response = await interviewApi.startSession({
        resumeId: selectedResume,
        jobId: selectedJob,
        difficultyLevel,
      });

      // Navigate to the interview room with the new session ID
      navigate(`/interview/${response.sessionId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview session');
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl border border-neutral/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-darkBg">Interview Setup</h1>
          <p className="text-neutral mt-2">Configure your AI mock interview parameters.</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-darkBg mb-2">Select Your Resume</label>
            {resumes.length === 0 ? (
              <p className="text-sm text-orange-600">No resumes found. <Link to="/resumes" className="underline">Upload one first.</Link></p>
            ) : (
              <select 
                className="w-full h-11 px-4 rounded-lg border border-neutral/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedResume}
                onChange={e => setSelectedResume(e.target.value)}
              >
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>{r.originalName}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-darkBg mb-2">Select Target Job Description</label>
            {jobs.length === 0 ? (
              <p className="text-sm text-orange-600">No jobs found. <Link to="/ats" className="underline">Create one via ATS Match first.</Link></p>
            ) : (
              <select 
                className="w-full h-11 px-4 rounded-lg border border-neutral/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedJob}
                onChange={e => setSelectedJob(e.target.value)}
              >
                {jobs.map(j => (
                  <option key={j._id} value={j._id}>{j.title} {j.company ? `at ${j.company}` : ''}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-darkBg mb-2">Difficulty Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {['intern', 'fresher', 'sde-1', 'sde-2', 'senior'].map(level => (
                <div 
                  key={level}
                  onClick={() => setDifficultyLevel(level)}
                  className={`cursor-pointer border rounded-lg py-2 text-center text-sm font-medium transition-all ${
                    difficultyLevel === level 
                      ? 'border-primary bg-primary/10 text-primary-dark shadow-sm' 
                      : 'border-neutral/30 text-neutral hover:bg-neutral-light'
                  }`}
                >
                  {level.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <Button variant="outline" className="w-1/3" onClick={() => navigate('/dashboard')}>Cancel</Button>
          <Button 
            className="w-2/3" 
            size="lg" 
            onClick={handleStart} 
            isLoading={isStarting}
            disabled={!selectedResume || !selectedJob}
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
