import React from 'react';
import '../../styles/components/ui.css';

const Skeleton = ({ className = '', style = {} }) => {
  return (
    <div 
      className={`skeleton ${className}`} 
      style={{ ...style }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="card h-full flex-col justify-center">
    <Skeleton className="w-full mb-4" style={{ height: '140px', borderRadius: 'var(--border-radius-md)' }} />
    <Skeleton className="mb-2" style={{ height: '24px', width: '80%' }} />
    <Skeleton style={{ height: '16px', width: '60%' }} />
  </div>
);

export const SkeletonStat = () => (
  <div className="card stat-card flex-col">
    <div className="flex justify-between items-center mb-4">
      <div className="w-full">
        <Skeleton className="mb-2" style={{ height: '14px', width: '50%' }} />
        <Skeleton style={{ height: '28px', width: '40%' }} />
      </div>
      <Skeleton style={{ height: '48px', width: '48px', borderRadius: '50%' }} />
    </div>
    <Skeleton style={{ height: '16px', width: '70%' }} />
  </div>
);

export default Skeleton;
