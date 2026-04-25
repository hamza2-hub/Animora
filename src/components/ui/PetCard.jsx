import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/PetCard.css';

const PetCard = ({ name, type, age, status, image }) => {
  const getStatusClass = (status) => {
    if (!status) return 'status-default';
    const s = status.toLowerCase();
    if (s.includes('healthy')) return 'status-healthy';
    if (s.includes('sick') || s.includes('treatment')) return 'status-warning';
    if (s.includes('emergency')) return 'status-emergency';
    return 'status-default';
  };

  return (
    <motion.div 
      className="pet-card-modern cursor-pointer"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="pet-card-image-wrapper">
        <img src={image} alt={name} className="pet-card-image" />
      </div>
      <div className="pet-card-content">
        <div className="pet-card-header">
          <h3 className="pet-card-name">{name}</h3>
          {status && (
            <span className={`pet-card-badge ${getStatusClass(status)}`}>
              {status}
            </span>
          )}
        </div>
        <div className="pet-card-details">
          {type && <span className="pet-card-info">{type}</span>}
          {type && age && <span className="pet-card-dot">•</span>}
          {age && <span className="pet-card-info">{age}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;
