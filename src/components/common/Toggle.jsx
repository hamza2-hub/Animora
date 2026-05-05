import React from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ isOn, onToggle }) => {
  return (
    <div 
      className={`toggle-container ${isOn ? 'on' : 'off'}`} 
      onClick={onToggle}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        backgroundColor: isOn ? 'var(--primary)' : 'var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <motion.div 
        className="toggle-thumb"
        layout
        initial={false}
        animate={{ x: isOn ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
      />
    </div>
  );
};

export default Toggle;
