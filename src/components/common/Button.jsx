import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/ui.css';

const Button = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
  const variants = {
    primary: 'bg-primary text-white shadow-lg hover:bg-primary-dark shadow-primary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary-light/10',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-zinc-600 hover:bg-zinc-100',
  };

  return (
    <motion.button 
      className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
      whileHover={!isLoading && !props.disabled ? { scale: 1.01, y: -1 } : {}}
      whileTap={!isLoading && !props.disabled ? { scale: 0.97 } : {}}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
};

export default Button;
