import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import { appointmentService } from '../../services/appointmentService';
import '../../styles/pages/dashboard.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAppointments();
  }, []);

  const upcoming = appointments.filter(a => new Date(a.date) >= new Date());
  const past = appointments.filter(a => new Date(a.date) < new Date());

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
        {isLoading ? (
          <p className="mt-4">Loading appointments...</p>
        ) : upcoming.length === 0 ? (
          <p className="mt-4 text-muted">No upcoming appointments.</p>
        ) : (
          upcoming.map(app => (
            <div key={app.id} className="appointment-card mt-4">
              <div className="flex items-center gap-4">
                <div className="appointment-icon-wrapper">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{app.notes || 'Appointment'} - {app.pets?.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(app.date).toLocaleString()} • {app.doctor?.full_name || 'Unassigned'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="small">Reschedule</Button>
            </div>
          ))
        )}
      </div>

      <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s', marginTop: '1.5rem' }}>
        <div className="section-header">
          <h2 className="section-title">Past Appointments</h2>
        </div>
        {isLoading ? (
          <p className="mt-4">Loading appointments...</p>
        ) : past.length === 0 ? (
          <p className="mt-4 text-muted">No past appointments.</p>
        ) : (
          past.map(app => (
            <div key={app.id} className="appointment-card mt-4" style={{ opacity: 0.7 }}>
              <div className="flex items-center gap-4">
                <div className="appointment-icon-wrapper" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{app.notes || 'Appointment'} - {app.pets?.name}</h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(app.date).toLocaleDateString()} • {app.doctor?.full_name || 'Unassigned'}
                  </p>
                </div>
              </div>
              <Button variant="text" size="small">View Details</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
