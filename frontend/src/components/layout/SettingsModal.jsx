import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user, setAuth, accessToken } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
    }
  }, [user]);

  // Reset messages when tab changes
  useEffect(() => {
    setProfileSuccess('');
    setProfileError('');
    setPasswordSuccess('');
    setPasswordError('');
  }, [activeTab]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);

    try {
      const data = await authApi.updateProfile({ firstName, lastName });
      // Update global user state
      setAuth({ ...user, firstName: data.profile.firstName, lastName: data.profile.lastName, name: `${data.profile.firstName} ${data.profile.lastName}`.trim() }, accessToken);
      setProfileSuccess('Profile updated successfully');
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      return setPasswordError('New passwords do not match');
    }
    if (newPassword.length < 6) {
      return setPasswordError('New password must be at least 6 characters');
    }

    setPasswordLoading(true);
    try {
      await authApi.updatePassword({ oldPassword, newPassword });
      setPasswordSuccess('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-darkBg/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
          >
          <div className="flex justify-between items-center p-6 border-b border-neutral/10">
            <h2 className="text-xl font-bold text-neutral-darkBg dark:text-white">Settings</h2>
            <button onClick={onClose} className="text-neutral hover:text-neutral-darkBg dark:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-neutral/10">
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-neutral hover:text-neutral-darkBg dark:text-white'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'password' ? 'border-primary text-primary' : 'border-transparent text-neutral hover:text-neutral-darkBg dark:text-white'}`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {activeTab === 'profile' ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4" autoComplete="off">
                {profileSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">{profileSuccess}</div>}
                {profileError && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{profileError}</div>}
                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg dark:text-white mb-1">First Name</label>
                    <Input 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      placeholder="" 
                      autoComplete="off"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-neutral-darkBg dark:text-white mb-1">Last Name</label>
                    <Input 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      placeholder="" 
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg dark:text-white mb-1">Email</label>
                  <Input 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-neutral-light dark:bg-slate-700 cursor-not-allowed"
                    autoComplete="off"
                  />
                  <p className="text-xs text-neutral dark:text-neutral-400 mt-1">Email cannot be changed.</p>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" isLoading={profileLoading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordUpdate} className="space-y-4" autoComplete="off">
                {passwordSuccess && <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">{passwordSuccess}</div>}
                {passwordError && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{passwordError}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg dark:text-white mb-1">Old Password</label>
                  <Input 
                    type="password" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    placeholder="" 
                    autoComplete="new-password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg dark:text-white mb-1">New Password</label>
                  <Input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="" 
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-darkBg dark:text-white mb-1">Confirm New Password</label>
                  <Input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="" 
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" isLoading={passwordLoading}>
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
