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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to login');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setServerError('');
      const response = await authApi.googleLogin({ credential: credentialResponse.credential });
      setAuth(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Google authentication failed');
    }
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
            <h1 className="text-3xl font-bold text-neutral-darkBg">Welcome back</h1>
            <p className="text-neutral mt-2">Log in to continue your interview preparation journey.</p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-darkBg mb-1">Email</label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-neutral-darkBg">Password</label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            
            <Button type="submit" className="w-full mt-2" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-lightBg text-neutral">Or continue with</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setServerError('Google Sign-In failed')}
              useOneTap
            />
          </div>

          <p className="mt-8 text-center text-sm text-neutral">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding/Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-darkBg relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 to-secondary-dark/20 z-0"></div>
        <div className="relative z-10 text-center max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6">Master your next tech interview</h2>
          <p className="text-neutral-light/80 text-lg">
            Join thousands of candidates who landed offers at top tech companies using our AI-powered mock interviews and targeted feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
