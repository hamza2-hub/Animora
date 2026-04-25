import React from 'react';
import { UserCheck } from 'lucide-react';
import Button from '../../components/ui/Button';

const PetOwners = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Pet Owners</h1>
          <p className="dashboard-subtitle">Manage client information and contacts</p>
        </div>
        <Button>Add Owner</Button>
      </div>

      <div className="section-card animate-slide-up">
        <div className="appointment-card mt-4">
          <div className="flex items-center gap-4">
            <div className="appointment-icon-wrapper">
              <UserCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600 }}>Jane Smith</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Pets: Bella (Dog) • 2 Active Appointments</p>
            </div>
          </div>
          <Button variant="outline" size="small">View Profile</Button>
        </div>
      </div>
    </div>
  );
};

export default PetOwners;
