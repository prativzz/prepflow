import React from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, LineChart, Sparkles } from 'lucide-react';

const FeaturePreview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0, opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  const features = [
    {
      icon: <Brain size={24} />,
      title: "Hyper-Realistic AI Voice",
      description: "Engage in lifelike, conversational interviews with our advanced AI that adapts to your responses in real-time.",
      color: "bg-blue-100 text-primary",
      borderColor: "border-primary/20",
    },
    {
      icon: <FileText size={24} />,
      title: "Smart Resume Parsing",
      description: "Upload your resume and instantly get tailored, industry-specific questions based on your actual experience.",
      color: "bg-purple-100 text-accent",
      borderColor: "border-accent/20",
    },
    {
      icon: <LineChart size={24} />,
      title: "Actionable Analytics",
      description: "Receive deep insights into your pacing, clarity, and STAR method usage with a comprehensive performance breakdown.",
      color: "bg-emerald-100 text-emerald-600",
      borderColor: "border-emerald-500/20",
    }
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-24 mb-40 px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-neutral-200 text-sm font-semibold text-neutral-700 mb-6 shadow-sm"
        >
          <Sparkles size={16} className="text-accent" />
          Prep. Practice. Perform.
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight"
        >
          Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">ace it.</span>
        </motion.h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden group`}
          >
            {/* Subtle gradient overlay on hover */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-transparent to-current ${feature.color.split(' ')[1]} transition-opacity duration-300 pointer-events-none`} />
            
            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 border ${feature.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {feature.icon}
            </div>
            
            <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
            <p className="text-neutral-500 leading-relaxed font-medium">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturePreview;
