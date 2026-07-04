import React from 'react';
import { motion } from 'framer-motion';
import { PAGE_TRANSITION } from '../../utils/animations';

export const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={PAGE_TRANSITION}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
