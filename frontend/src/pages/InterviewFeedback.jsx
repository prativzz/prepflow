import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewApi } from '../api/interview.api';
import { ProgressCircle } from '../components/ui/ProgressCircle';
import { Button } from '../components/ui/Button';

const InterviewFeedback = () => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await interviewApi.getFeedback(id);
        setSession(response.session);
        setQuestions(response.questions);
      } catch (err) {
        setError('Failed to load feedback');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-light flex items-center justify-center">Loading feedback...</div>;
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-darkBg mb-4">Oops!</h2>
          <p className="text-red-500 mb-6">{error || 'Session not found'}</p>
          <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-neutral/20">
            <h1 className="text-3xl font-bold text-neutral-darkBg mb-2">Interview Feedback</h1>
            <p className="text-neutral mb-6">
              Target Role: <span className="font-semibold text-primary">{session.jobDescription?.title}</span>
              {session.jobDescription?.company && ` at ${session.jobDescription.company}`}
            </p>
            
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
              <h3 className="font-semibold text-primary-dark mb-2">Overall Summary</h3>
              <p className="text-neutral-darkBg leading-relaxed">{session.overallFeedback}</p>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-white p-8 rounded-2xl shadow-sm border border-neutral/20 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-neutral-darkBg mb-4">Overall Score</h3>
            <ProgressCircle percentage={session.overallScore} size={140} strokeWidth={12} />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <h2 className="text-2xl font-bold text-neutral-darkBg mt-8 mb-4">Question Breakdown</h2>
        
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q._id} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold px-2 py-1 bg-neutral-light text-neutral rounded uppercase tracking-wider">
                    {q.type.replace('-', ' ')}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-darkBg mt-2">
                    {index + 1}. {q.content}
                  </h3>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {q.feedback?.score}%
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-neutral-light/50 rounded-lg border border-neutral/10 font-mono text-sm text-neutral-darkBg whitespace-pre-wrap">
                <span className="text-xs text-neutral font-bold uppercase mb-2 block">Your Answer:</span>
                {q.userAnswer || <span className="text-neutral/50 italic">No answer provided.</span>}
              </div>
              
              {q.feedback && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      Strengths
                    </h4>
                    <ul className="list-disc list-inside text-sm text-emerald-700 space-y-1">
                      {q.feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Areas for Improvement
                    </h4>
                    <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
                      {q.feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-center pt-8">
          <Link to="/dashboard">
            <Button size="lg">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
