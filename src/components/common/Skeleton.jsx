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
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius-lg)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }}>
    {/* Header row */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div className="skeleton-pulse" style={{ width: 60, height: 60, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div className="skeleton-pulse" style={{ height: 16, width: '55%' }} />
        <div className="skeleton-pulse" style={{ height: 12, width: '40%' }} />
        <div className="skeleton-pulse" style={{ height: 10, width: '30%' }} />
      </div>
    </div>
    {/* Chips */}
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <div className="skeleton-pulse" style={{ height: 24, width: 72, borderRadius: 99 }} />
      <div className="skeleton-pulse" style={{ height: 24, width: 90, borderRadius: 99 }} />
    </div>
    {/* Text */}
    <div className="skeleton-pulse" style={{ height: 36, width: '100%', borderRadius: 8 }} />
    {/* Footer */}
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
      <div className="skeleton-pulse" style={{ height: 14, width: 100 }} />
      <div className="skeleton-pulse" style={{ height: 22, width: 64, borderRadius: 99 }} />
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
