import React from 'react';
import { motion } from 'framer-motion';
import PremiumNavbar from '../components/layout/PremiumNavbar';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 overflow-hidden font-sans selection:bg-primary/20 selection:text-primary-dark relative">
      <PremiumNavbar />

      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply pointer-events-none"></div>
      <div className="absolute top-[40%] right-[-10%] w-[35%] h-[35%] rounded-full bg-accent/10 blur-[100px] mix-blend-multiply pointer-events-none"></div>

      <main className="relative z-10 flex flex-col items-center pt-32 lg:pt-40 pb-20 px-6 max-w-4xl mx-auto">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary mb-6">
              About the Developer
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Building intelligent <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">digital experiences.</span>
            </h1>
          </motion.div>

          {/* Content Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-lg leading-relaxed text-neutral-700 space-y-6"
          >
            <p>
              Hi, I'm <strong className="text-neutral-900 font-bold">Prativ Mallick</strong> — a B.Tech Computer Science (Artificial Intelligence) student and full-stack developer passionate about building modern, AI-powered web applications that solve real-world problems.
            </p>
            
            <p>
              I enjoy transforming ideas into fast, scalable, and intuitive digital experiences. My expertise includes the MERN stack, React, Node.js, Express.js, MongoDB, JavaScript, Java, Python, and integrating AI into practical applications. Whether it's developing intelligent interview platforms, real-time chat applications, or full-stack web solutions, I focus on writing clean code and creating products that users genuinely enjoy.
            </p>
            
            <p>
              I've built projects ranging from AI-powered career platforms and real-time communication apps to responsive web applications, continuously exploring new technologies to improve my skills. I believe great software isn't just functional—it's engaging, accessible, and thoughtfully designed.
            </p>
            
            <p className="pt-4 border-t border-neutral-200/50 font-medium text-neutral-800">
              I'm always looking for opportunities to collaborate, learn, and build products that make a meaningful impact.
            </p>
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
};

export default AboutUs;
