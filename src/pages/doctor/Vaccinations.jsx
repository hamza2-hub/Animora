import React from 'react';
import { Syringe } from 'lucide-react';

const Vaccinations = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Vaccinations</h1>
          <p className="dashboard-subtitle">Track vaccination schedules and inventory</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="section-card animate-slide-up grid-left">
          <h2 className="section-title">Upcoming Vaccinations</h2>
          <div className="appointment-card mt-4">
            <div className="flex items-center gap-4">
              <div className="appointment-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                <Syringe size={24} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600 }}>Rabies Booster - Milo</h4>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Due: Oct 15, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vaccinations;
