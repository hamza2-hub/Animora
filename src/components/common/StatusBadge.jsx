import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: '#F3F4F6', color: '#4B5563', label: 'Pending' }; // Gray
      case 'confirmed':
        return { bg: '#DBEAFE', color: '#1D4ED8', label: 'Confirmed' }; // Blue
      case 'in_progress':
        return { bg: '#FEF3C7', color: '#B45309', label: 'In Progress' }; // Yellow/Orange
      case 'completed':
        return { bg: '#D1FAE5', color: '#047857', label: 'Completed' }; // Green
      case 'cancelled':
        return { bg: '#FEE2E2', color: '#B91C1C', label: 'Cancelled' }; // Red
      default:
        return { bg: '#F3F4F6', color: '#4B5563', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        textTransform: 'capitalize'
      }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
