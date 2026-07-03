import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { interviewApi } from '../api/interview.api';
import { useWebcam } from '../hooks/useWebcam';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { CodeEditor } from '../components/ui/CodeEditor';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { videoRef, error: webcamError } = useWebcam();
  const { text: transcript, isListening, startListening, stopListening, hasSupport } = useSpeechRecognition();
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  
  const [code, setCode] = useState('// Write your code here\n\nfunction solution() {\n  \n}');
  
  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const fetchNextQuestion = async () => {
    try {
      const response = await interviewApi.getNextQuestion(id);
      if (response.completed) {
        setInterviewCompleted(true);
      } else {
        setCurrentQuestion(response.question);
        speakQuestion(response.question.content);
        if (response.question.type === 'technical-coding') {
          setCode('// Write your code here\n\nfunction solution() {\n  \n}');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNextQuestion();
    // eslint-disable-next-line
  }, [id]);

  const speakQuestion = (textToSpeak) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = async () => {
    if (!currentQuestion) return;
    
    try {
      setIsSubmitting(true);
      if (isListening) stopListening();
      
      const isCoding = currentQuestion.type === 'technical-coding';
      const finalAnswer = isCoding 
        ? `[TRANSCRIPT]: ${transcript}\n\n[CODE]:\n${code}`
        : transcript;

      await interviewApi.submitAnswer(id, currentQuestion._id, finalAnswer);
      await fetchNextQuestion();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishInterview = async () => {
    try {
      setIsSubmitting(true);
      await interviewApi.analyzeSession(id);
      navigate(`/interview/${id}/feedback`);
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    }
  };

  const handleEndEarly = async () => {
    if (window.confirm("Are you sure you want to end this interview early? Your progress will not be saved.")) {
      try {
        setIsSubmitting(true);
        await interviewApi.endInterviewEarly(id);
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    }
  };

  if (interviewCompleted) {
    return (
      <div className="min-h-screen bg-neutral-darkBg text-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Interview Completed</h1>
          <p className="text-neutral-light/80 mb-8">Great job! Your responses have been recorded. Click below to generate your detailed feedback report.</p>
          <Button size="lg" onClick={finishInterview} isLoading={isSubmitting}>Generate Feedback</Button>
        </motion.div>
      </div>
    );
  }

  const isCodingQuestion = currentQuestion?.type === 'technical-coding';

  return (
    <div className="min-h-screen bg-neutral-darkBg text-neutral-light flex flex-col">
      <header className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          Interview Session Active
        </div>
        <div className="font-mono text-xl">{formatTime(secondsElapsed)}</div>
      </header>

      <main className="flex-1 p-6 flex flex-col lg:flex-row gap-6 relative">
        
        {/* Main Workspace (Video + Optional Code) */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          
          <div className={`flex gap-4 w-full h-[600px] md:h-[500px] ${isCodingQuestion ? 'flex-col md:flex-row' : 'flex-col'}`}>
            <div className={`relative bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-300 ${isCodingQuestion ? 'w-full h-[250px] md:h-full md:w-1/3 shrink-0' : 'w-full h-full'}`}>
              {webcamError ? (
                <div className="absolute inset-0 flex items-center justify-center text-red-400 p-4 text-center text-sm">
                  {webcamError}
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                />
              )}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div> Live
              </div>
            </div>

            {isCodingQuestion && (
              <div className="w-full md:w-2/3 h-full overflow-hidden rounded-xl">
                <CodeEditor code={code} setCode={setCode} language="javascript" />
              </div>
            )}
          </div>
          
          <div className="flex justify-center items-center gap-4 py-4">
            <button 
              onClick={isListening ? stopListening : startListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-white text-black hover:bg-neutral-light'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {isListening ? (
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                ) : (
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                )}
              </svg>
            </button>
            <Button 
              size="lg" 
              onClick={handleEndEarly} 
              disabled={isSubmitting}
              className="px-6 border border-red-500 text-red-500 hover:bg-red-500/10 bg-transparent"
            >
              End Interview
            </Button>
            <Button 
              size="lg" 
              onClick={handleNext} 
              isLoading={isSubmitting}
              className="px-8 bg-primary hover:bg-primary-dark"
            >
              Submit & Next
            </Button>
          </div>
        </div>

        {/* AI Column */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex-1 flex flex-col relative overflow-hidden max-h-[300px]">
             <AnimatePresence>
                {isAiSpeaking && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary/10 pointer-events-none" 
                  />
                )}
             </AnimatePresence>
             
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">AI</div>
               <div>
                 <h3 className="font-semibold text-white">AI Interviewer</h3>
                 <p className="text-xs text-neutral-400 capitalize">{currentQuestion?.type.replace('-', ' ') || 'Preparing...'}</p>
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-lg leading-relaxed font-medium">
                  {currentQuestion?.content || 'Connecting to AI engine...'}
                </p>
             </div>
             
             {isAiSpeaking && (
               <div className="mt-4 flex justify-center gap-1">
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             )}
          </div>
          
          <div className="bg-black/40 border border-white/5 rounded-xl p-6 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4 flex justify-between items-center">
              Your Live Transcript
              {isListening && <span className="text-red-500 text-xs lowercase flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> recording</span>}
            </h3>
            <div className="flex-1 overflow-y-auto text-white/80 font-mono text-sm leading-relaxed p-4 bg-black/50 rounded-lg border border-white/5">
              {!hasSupport ? (
                <span className="text-red-400">Speech recognition is not supported in this browser.</span>
              ) : transcript ? (
                transcript
              ) : (
                <span className="text-white/30 italic">Start speaking to see your transcript...</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewRoom;
