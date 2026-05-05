import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X, Stethoscope, User, ChevronRight } from 'lucide-react';
import Button from '../common/Button';

const STATUS_CFG = {
  pending:     { bg: '#fef9c3', color: '#a16207', dot: '#eab308', label: 'Pending' },
  confirmed:   { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6', label: 'Confirmed' },
  in_progress: { bg: '#d1fae5', color: '#065f46', dot: '#10b981', label: 'In Progress' },
  completed:   { bg: '#e0f2fe', color: '#0369a1', dot: '#0ea5e9', label: 'Completed' },
  cancelled:   { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', label: 'Cancelled' },
};

const getStatusCfg = (s) => STATUS_CFG[s?.toLowerCase()] || STATUS_CFG.pending;

const AppointmentCard = ({ app, onViewDetails, isPast }) => {
  const cfg = getStatusCfg(app.status);
  const date = new Date(app.date);
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(16,185,129,0.10)', borderColor: 'var(--primary)' }}
      className={`appointment-card ${isPast ? 'is-past' : ''}`}
    >
      <div className="accent-bar" style={{ background: cfg.dot }} />

      <div className="date-block">
        <p className="date-day">{date.getDate()}</p>
        <p className="date-month">{date.toLocaleDateString('en-US', { month: 'short' })}</p>
        <p className="date-time">{timeStr}</p>
      </div>

      <div className="divider" />

      <div className="status-icon-wrapper" style={{ background: cfg.bg }}>
        {app.status === 'completed'
          ? <CheckCircle size={18} style={{ color: cfg.color }} />
          : app.status === 'cancelled'
          ? <X size={18} style={{ color: cfg.color }} />
          : <Stethoscope size={18} style={{ color: cfg.color }} />
        }
      </div>

      <div className="appointment-info">
        <div className="appointment-header">
          <p className="pet-name">{app.pets?.name || 'Unknown Pet'}</p>
          <span className="status-badge" style={{ background: cfg.bg, color: cfg.color }}>
            <span className="status-dot" style={{ background: cfg.dot }} />
            {cfg.label}
          </span>
        </div>
        <div className="appointment-meta">
          {app.pets?.type && (
            <span className="pet-meta">
              🐾 {app.pets.type}{app.pets.breed ? ` · ${app.pets.breed}` : ''}
            </span>
          )}
          {app.owner?.full_name && (
            <span className="owner-meta">
              <User size={10} /> {app.owner.full_name}
            </span>
          )}
          {app.notes && (
            <span className="notes-meta">
              · {app.notes}
            </span>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => onViewDetails(app)}
        className="details-btn"
      >
        Details <ChevronRight size={14} />
      </Button>
    </motion.div>
  );
};

export default AppointmentCard;
