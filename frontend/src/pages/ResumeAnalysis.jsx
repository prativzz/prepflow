import React, { useEffect, useState } from 'react';
import { FileUpload } from '../components/ui/FileUpload';
import { Button } from '../components/ui/Button';
import { resumeApi } from '../api/resume.api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

const ResumeAnalysis = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const data = await resumeApi.getMyResumes();
      setResumes(data.resumes);
    } catch (err) {
      console.error('Failed to fetch resumes', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      setError('');
      await resumeApi.uploadResume(selectedFile);
      setSelectedFile(null);
      await fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      setError('');
      await resumeApi.deleteResume(id);
      await fetchResumes();
    } catch (err) {
      console.error('Failed to delete resume', err);
      setError(err.response?.data?.message || 'Failed to delete resume');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-darkBg">Resume Repository</h1>
            <p className="text-neutral mt-1">Upload and manage your resumes for ATS analysis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-neutral-darkBg">Upload New</h2>
              <FileUpload onFileSelect={setSelectedFile} />
              
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              
              <Button 
                className="w-full mt-4" 
                onClick={handleUpload} 
                disabled={!selectedFile}
                isLoading={isUploading}
              >
                Upload & Parse
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-neutral/20 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-neutral-darkBg">Your Resumes</h2>
              
              <div className="max-h-[400px] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-neutral mb-4">No resumes uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <motion.div 
                        key={resume._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-neutral/20 rounded-lg p-4 hover:border-primary/50 transition-colors flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium text-neutral-darkBg">{resume.originalName}</h3>
                          <p className="text-sm text-neutral mt-1">
                            Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {resume.extractedKeywords.slice(0, 5).map(kw => (
                              <span key={kw} className="px-2 py-1 bg-neutral-light text-xs rounded-full text-neutral-darkBg">
                                {kw}
                              </span>
                            ))}
                            {resume.extractedKeywords.length > 5 && (
                              <span className="px-2 py-1 text-xs text-neutral">+{resume.extractedKeywords.length - 5} more</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={resume.fileUrl.includes('/raw/') ? `https://docs.google.com/viewer?url=${encodeURIComponent(resume.fileUrl)}` : resume.fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                          >
                            <Button variant="ghost" size="sm">View PDF</Button>
                          </a>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(resume._id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalysis;
