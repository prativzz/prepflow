import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Register = () => {
  const [serverError, setServerError] = useState('');
  const [pendingGoogleAuth, setPendingGoogleAuth] = useState(null);
  const [googleFirstName, setGoogleFirstName] = useState('');
  const [googleLastName, setGoogleLastName] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleConfirmPassword, setGoogleConfirmPassword] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await authApi.register(data);
      setAuth(response.user, response.accessToken);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to register');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setServerError('');
      const response = await authApi.googleLogin({ credential: credentialResponse.credential });
      
      if (response.requiresPassword) {
        setPendingGoogleAuth(response.googleData);
        setGoogleFirstName('');
        setGoogleLastName('');
        return;
      }
      
      setAuth(response.user, response.accessToken);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Google authentication failed');
    }
  };

  const handleCompleteGoogleAuth = async (e) => {
    e.preventDefault();
    if (googlePassword.length < 6) {
      setServerError('Password must be at least 6 characters');
      return;
    }
    if (googlePassword !== googleConfirmPassword) {
      setServerError('Passwords do not match');
      return;
    }

    try {
      setServerError('');
      const response = await authApi.googleRegister({
        credential: pendingGoogleAuth.credential,
        password: googlePassword,
        firstName: googleFirstName,
        lastName: googleLastName
      });
      setAuth(response.user, response.accessToken);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to complete Google registration');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white text-neutral-900">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative">
        <Link to="/" className="absolute top-8 left-8 sm:left-16 lg:left-24 font-extrabold text-2xl tracking-tight text-neutral-900 flex items-center gap-2">
          <span><span className="text-primary">Prep</span>Flow</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-darkBg">Create an account</h1>
            <p className="text-neutral mt-2">Start your journey to landing your dream tech job.</p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {serverError}
            </div>
          )}

          {pendingGoogleAuth ? (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex items-center gap-4 mb-6">
                <img src={pendingGoogleAuth.picture} alt="Avatar" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-semibold text-neutral-darkBg">Hi, {pendingGoogleAuth.given_name}!</p>
                  <p className="text-sm text-neutral">{pendingGoogleAuth.email}</p>
                </div>
              </div>
              <p className="text-sm text-neutral mb-4">You are almost there! Please set a password for your account to complete registration.</p>
              
              <form onSubmit={handleCompleteGoogleAuth} className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg mb-1">First Name</label>
                    <Input 
                      type="text" 
                      placeholder="John" 
                      value={googleFirstName}
                      onChange={(e) => setGoogleFirstName(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg mb-1">Last Name</label>
                    <Input 
                      type="text" 
                      placeholder="Doe" 
                      value={googleLastName}
                      onChange={(e) => setGoogleLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg mb-1">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={googlePassword}
                    onChange={(e) => setGooglePassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg mb-1">Confirm Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={googleConfirmPassword}
                    onChange={(e) => setGoogleConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="w-1/3" onClick={() => {
                    setPendingGoogleAuth(null);
                    setGoogleFirstName('');
                    setGoogleLastName('');
                    setGooglePassword('');
                    setGoogleConfirmPassword('');
                  }}>Cancel</Button>
                  <Button type="submit" className="w-2/3">Complete Registration</Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg mb-1">First Name</label>
                    <Input 
                      placeholder="John" 
                      autoComplete="off"
                      {...register('firstName')}
                      error={errors.firstName?.message}
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg mb-1">Last Name</label>
                    <Input 
                      placeholder="Doe" 
                      autoComplete="off"
                      {...register('lastName')}
                      error={errors.lastName?.message}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg mb-1">Email</label>
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    autoComplete="off"
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg mb-1">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    autoComplete="new-password"
                    {...register('password')}
                    error={errors.password?.message}
                  />
                </div>
                
                <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
                  Sign Up
                </Button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-neutral/20"></div>
                <span className="px-3 text-sm text-neutral">Or continue with</span>
                <div className="flex-grow border-t border-neutral/20"></div>
              </div>
              
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={(err) => console.log('Google Sign-In prompt closed or failed', err)}
                  text="signup_with"
                />
              </div>

              <p className="mt-8 text-center text-sm text-neutral">
                Already have an account?{' '}
                <Link to="/login" replace className="font-medium text-primary hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Side - Branding/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A0A0A] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Animated Glowing Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2], x: [0, -30, 0], y: [0, 50, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-accent/20 blur-[100px]" 
          />
        </div>

        {/* Floating Glass Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <div className="h-4 w-32 bg-white/20 rounded-full mb-2"></div>
              <div className="h-3 w-24 bg-white/10 rounded-full"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-white/10 rounded-full"></div>
            <div className="h-2 w-5/6 bg-white/10 rounded-full"></div>
            <div className="h-2 w-4/6 bg-white/10 rounded-full"></div>
          </div>
        </motion.div>

        <div className="relative z-10 text-center max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6"
          >
            Ace the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">technical round</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-neutral-400 text-lg font-medium leading-relaxed"
          >
            Practice real coding problems and behavioral questions in a realistic environment with instant AI feedback.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Register;
