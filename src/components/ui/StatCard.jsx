import React from 'react';
import '../../styles/components/ui.css';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = 'primary' }) => {
  return (
    <div className={`card stat-card animate-fade-in`}>
      <div className="stat-header flex justify-between items-center">
        <div>
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
        </div>
        <div className={`stat-icon-wrapper ${colorClass}`}>
          {Icon && <Icon size={24} />}
        </div>
      </div>
      {trend && (
        <div className="stat-trend flex items-center gap-2 mt-3">
          <span className={`trend-value ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="trend-label">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
