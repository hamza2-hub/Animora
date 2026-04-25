import React from 'react';
import { Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';

const DoctorAppointments = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Appointments</h1>
          <p className="dashboard-subtitle">Manage your daily schedule and upcoming visits</p>
        </div>
        <Button>Book Appointment</Button>
      </div>

      <div className="section-card animate-slide-up">
        <h2 className="section-title">Today's Appointments</h2>
        <div className="appointment-card mt-4">
          <div className="flex items-center gap-4">
            <div className="appointment-icon-wrapper">
              <Calendar size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600 }}>Routine Checkup - Buddy</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>10:00 AM • Owner: John Doe</p>
            </div>
          </div>
          <Button variant="outline" size="small">View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
