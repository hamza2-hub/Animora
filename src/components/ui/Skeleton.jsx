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
  <div className="pet-card-skeleton">
    <div className="skeleton-pulse skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-pulse skeleton-line-lg" />
      <div className="skeleton-pulse skeleton-line-md" />
      <div className="skeleton-pulse skeleton-line-sm" />
    </div>
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
