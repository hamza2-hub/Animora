import React from 'react';
import '../../styles/components/ui.css';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <button 
      className={`custom-btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
