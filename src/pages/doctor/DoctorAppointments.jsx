import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';
import StatusBadge from '../../components/ui/StatusBadge';
import AppointmentDetailsModal from '../../components/doctor/AppointmentDetailsModal';
import { supabase } from '../../lib/supabase';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('appointments')
        .select('*, pets(name, type, breed, age), owner:profiles!owner_id(full_name)')
        .gte('date', todayStart.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
      
      // Update selected appointment if it's currently open
      if (selectedAppointment) {
        const updated = data?.find(a => a.id === selectedAppointment.id);
        if (updated) setSelectedAppointment(updated);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    const appointmentsChannel = supabase
      .channel('doctor_appointments_page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments)
      .subscribe();

    return () => {
      appointmentsChannel.unsubscribe();
    };
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todaysAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate >= today && appDate < tomorrow;
  });

  const upcomingAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate >= tomorrow;
  });

  return (
    <div className="animate-fade-in relative">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Appointments</h1>
          <p className="dashboard-subtitle">Manage your daily schedule and upcoming visits</p>
        </div>
        <Button>Book Appointment</Button>
      </div>

      <div className="section-card animate-slide-up">
        <h2 className="section-title">Today's Appointments</h2>
        {loading ? (
          <p className="text-muted mt-4">Loading appointments...</p>
        ) : todaysAppointments.length === 0 ? (
          <p className="text-muted mt-4">No appointments scheduled for today.</p>
        ) : (
          todaysAppointments.map(app => (
            <div key={app.id} className="appointment-card mt-4">
              <div className="flex items-center gap-4">
                <div className="appointment-icon-wrapper">
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }} className="flex items-center gap-2">
                    {app.notes || 'Routine Checkup'} - {app.pets?.name || 'Unknown Pet'}
                    <StatusBadge status={app.status} />
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Owner: {app.owner?.full_name || 'Unknown'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="small" onClick={() => setSelectedAppointment(app)}>
                View Details
              </Button>
            </div>
          ))
        )}
      </div>

      {upcomingAppointments.length > 0 && (
        <div className="section-card animate-slide-up mt-6" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title">Upcoming Appointments</h2>
          {upcomingAppointments.map(app => (
            <div key={app.id} className="appointment-card mt-4">
              <div className="flex items-center gap-4">
                <div className="appointment-icon-wrapper" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: 600 }} className="flex items-center gap-2">
                    {app.notes || 'Routine Checkup'} - {app.pets?.name || 'Unknown Pet'}
                    <StatusBadge status={app.status} />
                  </h4>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(app.date).toLocaleDateString()} at {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Owner: {app.owner?.full_name || 'Unknown'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="small" onClick={() => setSelectedAppointment(app)}>
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      <AppointmentDetailsModal 
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onUpdate={fetchAppointments}
      />
    </div>
  );
};

export default DoctorAppointments;
