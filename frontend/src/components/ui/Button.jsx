import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, icon, ...props }, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center rounded-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-white shadow-sm border border-primary/20",
    secondary: "bg-secondary text-white hover:bg-secondary-dark shadow-sm border border-secondary/20",
    outline: "border border-neutral/30 bg-transparent text-neutral-darkBg",
    ghost: "text-neutral-darkBg",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-[12px] px-3",
    lg: "h-11 rounded-[14px] px-8",
    icon: "h-10 w-10",
  };

  const isPrimary = variant === 'primary';

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={isLoading || props.disabled}
      whileHover={
        !props.disabled && !isLoading ? {
          y: -3,
          scale: 1.03,
          boxShadow: isPrimary 
            ? "0 10px 25px -5px rgba(var(--color-primary-rgb), 0.5), 0 8px 10px -6px rgba(var(--color-primary-rgb), 0.5)" 
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          backgroundColor: isPrimary ? "var(--color-primary-light)" : undefined,
          transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
        } : {}
      }
      whileTap={
        !props.disabled && !isLoading ? { 
          scale: 0.96, 
          transition: { duration: 0.1 } 
        } : {}
      }
      {...props}
    >
      {/* Primary variant background gradient animation */}
      {isPrimary && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        />
      )}
      
      <span className="relative flex items-center z-10">
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
        {icon && (
          <motion.span 
            className="ml-2 inline-flex"
            variants={{
              hover: { x: 4 }
            }}
          >
            {icon}
          </motion.span>
        )}
      </span>
    </motion.button>
  );
});
Button.displayName = "Button";

export { Button };
