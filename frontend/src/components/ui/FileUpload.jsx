import React, { useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const FileUpload = ({ onFileSelect, accept = ".pdf", maxSize = 5 * 1024 * 1024 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const validateAndSelectFile = (file) => {
    setError('');
    if (!file) return;

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    if (accept === '.pdf' && file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  }, [maxSize, accept, onFileSelect]);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full relative group">
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-[18px] transition-all duration-300 bg-white overflow-hidden",
          isDragging ? "border-primary bg-primary/5 shadow-inner" : "border-neutral/30 hover:border-primary/50 hover:shadow-[0_10px_30px_-10px_rgba(var(--color-primary-rgb),0.2)]",
          error && "border-red-400 bg-red-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Animated Background Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={accept}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10 pointer-events-none">
          <motion.div
            variants={{
              hover: { y: [0, -8, 0], transition: { duration: 0.5, ease: "easeInOut" } }
            }}
            initial="initial"
            whileHover="hover"
            className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center text-primary"
          >
            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
          </motion.div>
          <p className="mb-2 text-sm text-neutral-darkBg">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-neutral">PDF files up to {maxSize / (1024 * 1024)}MB</p>
        </div>
      </motion.div>
      
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      
      <AnimatePresence>
        {selectedFile && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 p-3 bg-primary/10 rounded-[12px] flex items-center justify-between border border-primary/20 shadow-sm"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-white rounded flex-shrink-0 text-primary shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span className="text-sm font-medium text-neutral-darkBg truncate">{selectedFile.name}</span>
            </div>
            <button 
              onClick={() => setSelectedFile(null)}
              className="text-neutral hover:text-red-500 hover:bg-red-50 rounded-md transition-colors p-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
