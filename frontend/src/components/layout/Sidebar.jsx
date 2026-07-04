import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Settings, X, Moon, Sun } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.name || 
    (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : null) || 
    user?.firstName || 
    'User';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Resumes', path: '/resumes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'ATS Match', path: '/ats', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Mock Interview', path: '/interview/setup', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <div className={`w-64 bg-white dark:bg-slate-900 border-r border-neutral/20 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-neutral/10 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">PrepFlow</h1>
        <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-neutral dark:text-neutral-400 hover:text-neutral-darkBg dark:hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="block outline-none"
          >
            {({ isActive }) => (
              <motion.div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-[12px] cursor-pointer overflow-hidden ${
                  isActive 
                    ? 'text-primary font-medium' 
                    : 'text-neutral hover:text-neutral-darkBg dark:text-neutral-400 dark:hover:text-white'
                }`}
                whileHover="hover"
                initial="initial"
                animate={isActive ? "active" : "inactive"}
              >
                {/* Active Indicator Line & Background Fill */}
                {isActive && (
                  <>
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-md shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.8)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <motion.div 
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 bg-primary/10 rounded-[12px]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </>
                )}
                
                {/* Hover Background */}
                {!isActive && (
                  <motion.div 
                    className="absolute inset-0 bg-neutral-light dark:bg-slate-800 rounded-[12px] opacity-0"
                    variants={{
                      hover: { opacity: 1, transition: { duration: 0.2 } }
                    }}
                  />
                )}

                <motion.div 
                  className="relative z-10 flex items-center justify-center text-current"
                  variants={{
                    hover: { rotate: 5, scale: 1.1, color: "var(--color-primary)", x: 2 },
                    active: { scale: 1.15, color: "var(--color-primary)" },
                    inactive: { rotate: 0, scale: 1, x: 0 }
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </motion.div>
                
                <motion.span 
                  className="relative z-10"
                  variants={{
                    hover: { x: 4 }
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {(displayName !== 'User' ? displayName : (user?.email || '?')).charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium text-neutral-darkBg dark:text-white truncate">{displayName}</p>
            <p className="text-xs text-neutral dark:text-neutral-400 truncate">{user?.email}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-neutral hover:text-primary dark:text-neutral-400 dark:hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 text-neutral hover:text-primary dark:text-neutral-400 dark:hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
        <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
    </>
  );
};
