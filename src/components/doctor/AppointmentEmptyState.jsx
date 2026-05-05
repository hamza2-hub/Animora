import React from 'react';
import { History, CalendarCheck } from 'lucide-react';

const AppointmentEmptyState = ({ tab }) => (
  <div className="appointment-empty-state">
    <div className="empty-state-overlay" />
    <div className="empty-state-content">
      <div className="empty-state-icon">
        {tab === 'previous' ? <History size={28} /> : <CalendarCheck size={28} />}
      </div>
      <p className="empty-state-title">
        {tab === 'today' ? 'No appointments today' : tab === 'upcoming' ? 'No upcoming appointments' : tab === 'search' ? 'No results found' : 'No previous appointments'}
      </p>
      <p className="empty-state-subtitle">
        {tab === 'today' ? 'Your schedule is clear for today.' : tab === 'upcoming' ? 'Nothing scheduled yet.' : tab === 'search' ? 'Try searching for something else.' : 'Completed visits will appear here.'}
      </p>
    </div>
  </div>
);

export default AppointmentEmptyState;
