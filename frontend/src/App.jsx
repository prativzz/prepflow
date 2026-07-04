import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import ATSAnalysis from './pages/ATSAnalysis';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import InterviewFeedback from './pages/InterviewFeedback';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PublicOnlyRoute from './components/layout/PublicOnlyRoute';
import { MainLayout } from './components/layout/MainLayout';

import { authApi } from './api/auth.api';

function App() {
  const { setAuth, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getMe();
        const currentToken = useAuthStore.getState().accessToken;
        setAuth(response.user, currentToken);
      } catch (error) {
        setAuth(null, null);
      }
    };
    
    checkAuth();
  }, [setAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-neutral-darkBg bg-neutral-light">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          {/* Public-only Routes (redirect to dashboard if logged in) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resumes" element={<ResumeAnalysis />} />
              <Route path="/ats" element={<ATSAnalysis />} />
              <Route path="/interview/setup" element={<InterviewSetup />} />
              <Route path="/interview/:id/feedback" element={<InterviewFeedback />} />
            </Route>
            {/* Interview Room doesn't use the sidebar layout because it needs full screen focus */}
            <Route path="/interview/:id" element={<InterviewRoom />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
