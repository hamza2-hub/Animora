import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Cat, Dog, Bird, HelpCircle } from 'lucide-react';
import '../../styles/components/PetCard.css';

const TYPE_ICONS = {
  cat: Cat,
  dog: Dog,
  bird: Bird,
};

const PetCard = ({ name, type, age, breed, status, image, ownerName }) => {
  const getStatusClass = (s) => {
    if (!s) return 'badge-default';
    const lower = s.toLowerCase();
    if (lower === 'healthy') return 'badge-healthy';
    if (lower === 'treatment') return 'badge-treatment';
    if (lower === 'emergency') return 'badge-emergency';
    return 'badge-default';
  };

  const formatAge = (age) => {
    if (age === null || age === undefined || age === '') return null;
    return Number(age) === 1 ? '1 year old' : `${age} years old`;
  };

  const TypeIcon = TYPE_ICONS[type?.toLowerCase()] || HelpCircle;

  return (
    <motion.div
      className="pet-card"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    >
      <div className="pet-card__header-box">
        {/* Image */}
        <div className="pet-card__image-wrap">
          {image ? (
            <img src={image} alt={name} className="pet-card__image" />
          ) : (
            <div className="pet-card__image-placeholder">
              <TypeIcon size={40} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="pet-card__body">
          <div className="pet-card__top">
            <h3 className="pet-card__name">{name}</h3>
          </div>
          {formatAge(age) && (
            <span className="pet-card__age" style={{ 
              fontWeight: 600, 
              color: '#64748b', 
              fontSize: '0.85rem',
              marginTop: '0.1rem',
              display: 'block'
            }}>
              {formatAge(age)}
            </span>
          )}
          <div className="pet-card__info" style={{ marginTop: '0.4rem' }}>
            <span className="pet-card__type-row">
              <TypeIcon size={14} strokeWidth={2} />
              <strong>{type || 'Unknown'}</strong>
            </span>
            {breed && <span className="pet-card__age" style={{ paddingLeft: 0, marginTop: 0 }}>{breed}</span>}
          </div>
        </div>
        
        <span className={`pet-card__badge ${getStatusClass(status)}`} style={{ alignSelf: 'flex-start' }}>
          {status || 'Unknown'}
        </span>
      </div>

      <div className="pet-card__footer">
        <div className="flex flex-col gap-1">
          <span className="pet-card__meta">
            <Clock size={13} /> Added recently
          </span>
        </div>
        {ownerName && (
          <span className="pet-card__owner">
            <User size={13} /> {ownerName}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PetCard;
