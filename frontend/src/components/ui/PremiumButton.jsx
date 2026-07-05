import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PremiumButton = ({ children, to, onClick, className = '' }) => {
  const content = (
    <>
      <span className="relative z-10 font-semibold tracking-wide">{children}</span>
      
      {/* Shine Sweep Effect */}
      <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] z-0" />
      
      {/* Inner subtle glow */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-white/20 to-transparent z-0" />
    </>
  );

  const baseClasses = `
    relative group overflow-hidden inline-flex items-center justify-center 
    px-8 py-4 rounded-full bg-primary text-white 
    shadow-[0_4px_14px_0_rgba(79,124,255,0.39)] 
    hover:shadow-[0_6px_20px_rgba(79,124,255,0.45)] 
    transition-shadow duration-300
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className="inline-block">
        <motion.div
          whileHover={{ scale: 1.02, rotate: 1, y: -2 }}
          whileTap={{ scale: 0.98, rotate: 0 }}
          className={baseClasses}
        >
          {content}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, rotate: 1, y: -2 }}
      whileTap={{ scale: 0.98, rotate: 0 }}
      className={baseClasses}
    >
      {content}
    </motion.button>
  );
};

export default PremiumButton;
