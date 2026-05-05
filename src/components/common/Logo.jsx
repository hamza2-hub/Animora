import React from 'react';

const Logo = ({ size = 24, className = "" }) => {
  return (
    <div 
      className={`flex items-center justify-center rounded-[10px] overflow-hidden shadow-sm ${className}`}
      style={{ 
        width: size, 
        height: size, 
        background: 'linear-gradient(135deg, #0D9488, #059669)',
        flexShrink: 0
      }}
    >
      <svg 
        width={size * 0.7} 
        height={size * 0.7} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(4, 4)">
          {/* Main Pad - Bean Shape */}
          <path 
            d="M12.5 22.5C9.5 22.5 6.5 20.5 5.5 17.5C4.5 14.5 6.5 11.5 9.5 10.5C12.5 9.5 15.5 11.5 17.5 14.5C18.5 16.5 18.5 19.5 16.5 21.5C15.5 22.5 14.5 22.5 12.5 22.5Z" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Toes - 3 dots */}
          <circle cx="15" cy="5" r="2.2" fill="white" />
          <circle cx="21" cy="9" r="2.2" fill="white" />
          <circle cx="23" cy="15" r="2.2" fill="white" />
        </g>
      </svg>
    </div>
  );
};

export default Logo;
