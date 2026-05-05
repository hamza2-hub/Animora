import React from 'react';
import { motion } from 'framer-motion';
import { Cat, Dog, Bird, HelpCircle, ShieldCheck, Activity, Heart, Clock, ChevronRight, User } from 'lucide-react';
import '../../styles/components/PetCard.css';

const TYPE_ICONS = { cat: Cat, dog: Dog, bird: Bird };

const STATUS_CONFIG = {
  healthy:   { label: 'Healthy',   icon: ShieldCheck, bg: '#dcfce7', color: '#15803d', border: '#86efac', dot: '#22c55e' },
  treatment: { label: 'Treatment', icon: Activity,    bg: '#fef9c3', color: '#a16207', border: '#fde047', dot: '#eab308' },
  emergency: { label: 'Emergency', icon: Heart,       bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#ef4444' },
};

/* ─── Avatar (same style as Doctor cards) ──── */
const PetAvatar = ({ image, name, type, size = 60 }) => {
  const TypeIcon = TYPE_ICONS[type?.toLowerCase()] || HelpCircle;
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];

  return image ? (
    <img src={image} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}22, ${color}44)`,
      border: `2px solid ${color}33`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color,
    }}>
      <TypeIcon size={size * 0.4} strokeWidth={1.5} />
    </div>
  );
};

const PetCard = ({ id, name, type, age, breed, status, image, ownerName, createdAt, medicalRecordsCount = 0, onClick }) => {
  const TypeIcon = TYPE_ICONS[type?.toLowerCase()] || HelpCircle;
  const statusKey = status?.toLowerCase();
  
  // Logic: Only show "Healthy" if status is healthy AND they've actually seen a doctor (has medical records)
  const isHealthyButNotVisited = statusKey === 'healthy' && medicalRecordsCount === 0;
  
  const cfg = isHealthyButNotVisited 
    ? { label: 'Registered', icon: ShieldCheck, bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0', dot: '#94a3b8' }
    : (STATUS_CONFIG[statusKey] || {
        label: status || 'Unknown', icon: ShieldCheck,
        bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', dot: '#94a3b8',
      });

  const formatAge = (a) => {
    if (a === null || a === undefined || a === '') return null;
    return Number(a) === 1 ? '1 yr' : `${a} yrs`;
  };

  const addedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '1.5rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: 'var(--shadow-soft)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(16,185,129,0.12)', borderColor: 'var(--primary)' }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${cfg.color}aa, ${cfg.dot})`,
        opacity: isHealthyButNotVisited ? 0 : 0, // Keep it hidden if just registered
        transition: 'opacity 0.2s',
      }} className="pet-card-accent" />

      {/* Header row: avatar + name + status */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <PetAvatar image={image} name={name} type={type} size={60} />
          {/* Online-style status dot */}
          {!isHealthyButNotVisited && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 14, height: 14, borderRadius: '50%',
              background: cfg.dot, border: '2px solid white',
            }} />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)',
            marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {name || 'Unknown'}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 4, textTransform: 'capitalize' }}>
            {type || 'Pet'}{breed ? ` · ${breed}` : ''}
          </p>
          {/* Status pill inline */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 700, color: cfg.color }}>
            {!isHealthyButNotVisited && <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />}
            {cfg.label}
          </div>
        </div>
      </div>

      {/* Info chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {formatAge(age) && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: '0.75rem', fontWeight: 600,
            padding: '0.3rem 0.65rem', borderRadius: 99,
            background: 'var(--primary-light)', color: 'var(--primary-dark)',
          }}>
            <Clock size={11} /> {formatAge(age)} old
          </span>
        )}
        {ownerName && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: '0.75rem', fontWeight: 500,
            padding: '0.3rem 0.65rem', borderRadius: 99,
            background: '#f1f5f9', color: 'var(--text-muted)',
          }}>
            <User size={11} /> {ownerName}
          </span>
        )}
      </div>

      {/* Status description */}
      <p style={{
        fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {isHealthyButNotVisited 
          ? 'This pet has been registered successfully. Schedule a checkup to verify their health status.'
          : statusKey === 'emergency'
          ? 'This pet needs urgent veterinary attention and is marked for emergency care.'
          : statusKey === 'treatment'
          ? 'This pet is currently undergoing treatment. Follow up on their recovery.'
          : 'This pet is in good health. Regular checkups are recommended.'}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '0.75rem', borderTop: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {addedDate ? `Joined ${addedDate}` : 'Recently added'} <ChevronRight size={14} />
        </span>
        {!isHealthyButNotVisited && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: '0.72rem', fontWeight: 700, color: cfg.color,
            background: cfg.bg, padding: '0.3rem 0.65rem', borderRadius: 99,
          }}>
            {React.createElement(cfg.icon || ShieldCheck, { size: 12 })}
            {cfg.label}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PetCard;
