import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, CheckCircle2, Mic, FileText, Activity } from 'lucide-react';

const FeaturePreview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-32 mb-40 px-6 perspective-[2000px]">
      
      {/* Glow behind the preview */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        whileHover={{ rotateX: 2, rotateY: -2, y: -5 }}
        className="relative bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-transform duration-500 transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Top Header Mock */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
              <Brain size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-neutral-900">AI Interview Feedback</h3>
              <p className="text-sm text-neutral-500">Session complete. Score generated.</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> 94% ATS Match
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Communication */}
          <motion.div variants={itemVariants} className="bg-white/70 border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 text-primary">
                <Mic size={20} />
              </div>
              <h4 className="font-semibold text-neutral-800">Communication</h4>
            </div>
            <div className="text-3xl font-extrabold text-neutral-900 mb-2">9.2<span className="text-sm font-medium text-neutral-500">/10</span></div>
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '92%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="bg-primary h-full rounded-full"
              />
            </div>
          </motion.div>

          {/* Card 2: Analytics */}
          <motion.div variants={itemVariants} className="bg-white/70 border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-100 text-accent">
                <BarChart3 size={20} />
              </div>
              <h4 className="font-semibold text-neutral-800">Clarity & Pacing</h4>
            </div>
            <div className="flex items-end gap-2 h-16 mt-4">
              {[40, 60, 45, 80, 55, 90, 75].map((height, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  transition={{ duration: 0.8, delay: 0.8 + (i * 0.1) }}
                  className="flex-1 bg-accent/80 rounded-t-sm"
                />
              ))}
            </div>
          </motion.div>

          {/* Card 3: Feedback */}
          <motion.div variants={itemVariants} className="bg-white/70 border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Activity size={20} />
              </div>
              <h4 className="font-semibold text-neutral-800">Key Takeaways</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Strong technical terminology",
                "Good STAR method usage",
                "Slight hesitation on Q3"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

export default FeaturePreview;
