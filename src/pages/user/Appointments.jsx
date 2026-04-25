import React from 'react';
import { Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import '../../styles/pages/dashboard.css';

const Appointments = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">Appointments</h1>
          <p className="dashboard-subtitle">Schedule and manage your clinic visits</p>
        </div>
        <Button>Book Appointment</Button>
      </div>

      <div className="section-card animate-slide-up">
        <div className="section-header">
          <h2 className="section-title">Upcoming Appointments</h2>
        </div>
        <div className="appointment-card mt-4">
          <div className="flex items-center gap-4">
            <div className="appointment-icon-wrapper">
              <Calendar size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600 }}>Annual Checkup - Buddy</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>Tomorrow at 10:00 AM • Dr. Smith</p>
            </div>
          </div>
          <Button variant="outline" size="small">Reschedule</Button>
        </div>
      </div>

      <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s', marginTop: '1.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">Past Appointments</h2>
        </div>
        <div className="appointment-card mt-4" style={{ opacity: 0.7 }}>
          <div className="flex items-center gap-4">
            <div className="appointment-icon-wrapper" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <h4 style={{ fontWeight: 600 }}>Vaccination - Milo</h4>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>March 15, 2026 • Dr. Johnson</p>
            </div>
          </div>
          <Button variant="text" size="small">View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
