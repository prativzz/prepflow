import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <header className="h-16 w-full flex items-center justify-between px-6 border-b border-neutral/20 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight text-primary-dark">PrepFlow</div>
        <nav className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Features</button>
          <Link to="/login" className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary-dark transition-all">Sign In</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center mt-20">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-neutral-darkBg">
            Master Interviews. <span className="text-primary">Land Offers.</span>
          </h1>
          <p className="text-lg text-neutral leading-relaxed">
            100% Free AI-powered mock interviews tailored to your resume and target job. Practice with realistic voice & video environments to build confidence.
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Link to="/register" className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark hover:-translate-y-0.5 transition-all shadow-md">
              Start Practicing
            </Link>
            <Link to="/login" className="px-8 py-3 bg-white text-neutral-darkBg font-semibold rounded-lg border border-neutral/20 hover:bg-neutral-light transition-all shadow-sm">
              See Demo
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
