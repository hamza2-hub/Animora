import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Cat, Dog, Bird, HelpCircle, Heart, Activity, ShieldCheck } from 'lucide-react';
import '../../styles/components/PetCard.css';

const TYPE_ICONS = { cat: Cat, dog: Dog, bird: Bird };

const STATUS_CONFIG = {
  healthy:   { label: 'Healthy',   icon: ShieldCheck, bg: '#dcfce7', color: '#15803d', border: '#86efac', dot: '#22c55e' },
  treatment: { label: 'Treatment', icon: Activity,    bg: '#fef9c3', color: '#a16207', border: '#fde047', dot: '#eab308' },
  emergency: { label: 'Emergency', icon: Heart,       bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#ef4444' },
};

const PetCard = ({ name, type, age, breed, status, image, ownerName, createdAt }) => {
  const TypeIcon = TYPE_ICONS[type?.toLowerCase()] || HelpCircle;
  const statusKey = status?.toLowerCase();
  const cfg = STATUS_CONFIG[statusKey] || { label: status || 'Unknown', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0', dot: '#94a3b8' };

  const formatAge = (a) => {
    if (a === null || a === undefined || a === '') return null;
    return Number(a) === 1 ? '1 yr' : `${a} yrs`;
  };

  const addedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.div
      className="pet-card"
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      {/* Top accent gradient line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${cfg.color}aa, ${cfg.dot})`, borderRadius: '28px 28px 0 0' }} />

      {/* ── Header: image + name + status ── */}
      <div className="pet-card__header-box" style={{ paddingTop: '0.25rem' }}>
        {/* Image */}
        <div className="pet-card__image-wrap" style={{ borderColor: cfg.border }}>
          {image ? (
            <img src={image} alt={name} className="pet-card__image" />
          ) : (
            <div className="pet-card__image-placeholder">
              <TypeIcon size={42} strokeWidth={1.4} />
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="pet-card__body">
          <div className="pet-card__top">
            <h3 className="pet-card__name">{name || 'Unknown'}</h3>
          </div>

          {/* Status pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.25rem 0.7rem', borderRadius: 99, background: cfg.bg, border: `1.5px solid ${cfg.border}`, width: 'fit-content' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.04em' }}>{cfg.label}</span>
          </div>

          {/* Type + breed */}
          <div className="pet-card__info" style={{ marginTop: '0.35rem', gap: '0.2rem' }}>
            <span className="pet-card__type-row">
              <TypeIcon size={13} strokeWidth={2} />
              <strong style={{ textTransform: 'capitalize' }}>{type || 'Unknown'}</strong>
              {breed && <><span style={{ color: '#cbd5e1', margin: '0 2px' }}>·</span><span style={{ color: '#64748b', fontWeight: 400 }}>{breed}</span></>}
            </span>
          </div>
        </div>
      </div>

      {/* ── Info chips row ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.25rem' }}>
        {formatAge(age) && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.75rem', borderRadius: 99, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
            🎂 {formatAge(age)} old
          </div>
        )}
        {ownerName && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0.3rem 0.75rem', borderRadius: 99, background: '#ecfdf5', border: '1px solid #a7f3d0', fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
            <User size={11} /> {ownerName}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="pet-card__footer">
        <span className="pet-card__meta">
          <Clock size={12} />
          {addedDate ? `Joined ${addedDate}` : 'Recently added'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '0.2rem 0.6rem', borderRadius: 99 }}>
          {React.createElement(cfg.icon || ShieldCheck, { size: 11 })}
          {cfg.label}
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;
