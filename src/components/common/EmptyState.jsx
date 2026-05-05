import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title, message, actionText, onAction, icon: Icon = PawPrint }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 p-6 rounded-full" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
        <Icon size={64} />
      </div>
      <h3 className="text-2xl font-bold mb-2 text-main" style={{ color: 'var(--text-main)' }}>{title}</h3>
      <p className="text-muted mb-8 max-w-md" style={{ color: 'var(--text-muted)' }}>{message}</p>
      {actionText && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default EmptyState;
