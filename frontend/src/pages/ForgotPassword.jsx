import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative">
        <Link to="/" className="absolute top-8 left-8 sm:left-16 lg:left-24 font-bold text-xl tracking-tight text-primary-dark">
          PrepFlow
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-darkBg">Reset your password</h1>
            <p className="text-neutral mt-2">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">Check your email</h3>
              <p className="text-emerald-700 text-sm mb-6">
                If an account exists for <span className="font-medium">{email}</span>, you will receive password reset instructions.
              </p>
              <Link to="/login">
                <Button className="w-full" variant="outline">Back to Log in</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-darkBg mb-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={error}
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
                Send Reset Link
              </Button>
              
              <div className="text-center mt-6">
                <Link to="/login" className="text-sm font-medium text-primary hover:underline flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to log in
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>

      {/* Right Side - Branding/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-darkBg relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-primary-dark/20 z-0"></div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-6">Secure your account</h2>
          <p className="text-neutral-light/80 text-lg">
            We'll help you get back to practicing and preparing for your next big interview.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
