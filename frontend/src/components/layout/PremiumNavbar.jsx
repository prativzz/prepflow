import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const PremiumNavbar = () => {
  const { isAuthenticated } = useAuthStore();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 flex justify-center ${
        isScrolled ? 'py-2' : 'py-6'
      }`}
    >
      <div 
        className={`w-full flex items-center justify-between px-6 transition-all duration-500 ${
          isScrolled 
            ? 'max-w-4xl mx-auto h-14 bg-white/60 backdrop-blur-xl border border-neutral-200/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
            : 'max-w-7xl mx-auto h-16 bg-transparent border-transparent'
        }`}
      >
        <div className="font-extrabold text-xl tracking-tight text-neutral-900 flex items-center gap-2">
          {/* Subtle logo animation on load */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
             <span className="text-primary">Prep</span>Flow
          </motion.div>
        </div>
        
        <nav className="flex items-center gap-6">
          <Link to="/about-us" className="text-sm font-medium text-neutral-600 hover:text-primary transition-colors">
            About Us
          </Link>
          
          {!isAuthenticated && (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-neutral-700 hover:text-primary transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="relative overflow-hidden px-5 py-2 text-sm font-semibold bg-primary text-white rounded-full hover:bg-primary-dark transition-all shadow-glow-primary hover:shadow-ambient-hover transform hover:-translate-y-0.5 group"
              >
                <span className="relative z-10">Get Started</span>
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default PremiumNavbar;
