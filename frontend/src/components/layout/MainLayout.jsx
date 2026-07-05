import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 font-sans selection:bg-primary/20 selection:text-primary-dark">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 w-full">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-xl border-b border-neutral-200/50 dark:border-white/10 sticky top-0 z-30 transition-colors duration-300">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">PrepFlow</h1>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -mr-2 text-neutral hover:text-neutral-darkBg dark:hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
