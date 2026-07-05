import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PremiumNavbar from '../components/layout/PremiumNavbar';
import InteractiveBackground from '../components/ui/InteractiveBackground';
import PremiumButton from '../components/ui/PremiumButton';
import FeaturePreview from '../components/sections/FeaturePreview';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuthStore();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const yText = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  const ySub = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 overflow-hidden font-sans selection:bg-primary/20 selection:text-primary-dark">
      <InteractiveBackground />
      <PremiumNavbar />

      <main className="relative z-10 flex flex-col items-center pt-32 lg:pt-48 pb-20">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          
          <motion.div 
            style={{ y: yText, opacity: opacityText }}
            className="flex flex-col items-center"
          >
            {/* Subtle intro badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="px-4 py-1.5 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-md shadow-sm mb-8 flex items-center gap-2 text-sm font-medium text-neutral-600"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse-slow"></span>
              The new standard for AI interview prep
            </motion.div>

            {/* Massive Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] text-neutral-900 max-w-5xl">
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                Master Interviews.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x"
              >
                Land Offers.
              </motion.span>
            </h1>

            {/* Subheading */}
            <motion.p
              style={{ y: ySub }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="mt-8 text-xl sm:text-2xl text-neutral-500 max-w-2xl leading-relaxed"
            >
              Practice with hyper-realistic AI interviewers tailored to your resume. Get actionable feedback and build unbreakable confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-4"
            >
              {isAuthenticated ? (
                <PremiumButton to="/dashboard">
                  <span className="flex items-center gap-2">
                    Enter Dashboard <ArrowRight size={18} />
                  </span>
                </PremiumButton>
              ) : (
                <>
                  <PremiumButton to="/register">
                    Start Practicing Free
                  </PremiumButton>
                </>
              )}
            </motion.div>
          </motion.div>

        </section>

        {/* FEATURE PREVIEW */}
        <section id="features" className="w-full">
          <FeaturePreview />
        </section>

      </main>
    </div>
  );
};

export default LandingPage;
