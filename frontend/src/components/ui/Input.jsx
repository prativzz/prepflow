import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full relative group">
      <input
        type={inputType}
        className={cn(
          "flex h-11 w-full rounded-[14px] border border-neutral/30 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm dark:text-white placeholder:text-neutral dark:placeholder:text-neutral-400 transition-all duration-300",
          "hover:border-primary/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
          "focus-visible:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500 focus-visible:shadow-[0_0_15px_rgba(239,68,68,0.15)]",
          isPassword && "pr-10",
          className
        )}
        ref={ref}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[10px] text-neutral hover:text-primary transition-colors focus:outline-none"
          tabIndex="-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
Input.displayName = "Input";

export { Input };
