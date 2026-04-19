import React from 'react';
import { Plus, Calendar, FileText } from 'lucide-react';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import { useAppContext } from '../../core/context/AppContext';
import { userPets, userRequests } from '../../data/mockData';
import '../../styles/pages/dashboard.css';

const UserDashboard = () => {
  const { activeTab, setActiveTab } = useAppContext();

  // Helper renderers for internal state switching
  const renderDashboardOverview = () => (
    <div className="dashboard-grid">
      <div className="grid-left">
        <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <h2 className="section-title">Quick Overview</h2>
            <Button variant="text" size="small" onClick={() => setActiveTab('pets')}>View All Pets</Button>
          </div>
          <div className="pets-grid">
            {userPets.slice(0, 2).map(pet => (
              <PetCard key={pet.id} name={pet.name} type={pet.type} age={pet.age} status={pet.status} image={pet.image} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid-right">
        <div className="section-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2 className="section-title">Recent Requests</h2>
            <Button variant="text" size="small"><FileText size={16}/></Button>
          </div>
          <div className="request-list">
            {userRequests.map(req => (
              <div key={req.id} className="request-item">
                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{req.date}</p>
                </div>
                <span className={`req-badge req-${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
          <Button className="w-full mt-4" style={{ marginTop: '1.5rem' }}>
            Create New Request
          </Button>
        </div>
      </div>
    </div>
  );

  const renderMyPets = () => (
    <div className="section-card animate-slide-up">
      <div className="section-header">
        <h2 className="section-title">My Pets</h2>
        <Button>
          <Plus size={18} className="mr-2" /> Register Pet
        </Button>
      </div>
      <div className="pets-grid">
        {userPets.map(pet => (
          <PetCard key={pet.id} name={pet.name} type={pet.type} age={pet.age} status={pet.status} image={pet.image} />
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="section-card animate-slide-up">
      <div className="section-header">
        <h2 className="section-title">Upcoming Appointments</h2>
        <Button>Book Appointment</Button>
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
  );

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">
            {activeTab === 'dashboard' && 'My Dashboard'}
            {activeTab === 'pets' && 'My Pets'}
            {activeTab === 'appointments' && 'Appointments'}
          </h1>
          <p className="dashboard-subtitle">
            {activeTab === 'dashboard' && 'Manage your pets and upcoming activities'}
            {activeTab === 'pets' && 'View and manage your registered pets'}
            {activeTab === 'appointments' && 'Schedule and manage your clinic visits'}
          </p>
        </div>
        {activeTab === 'dashboard' && (
          <Button onClick={() => setActiveTab('pets')}>
            <Plus size={18} className="mr-2" /> Add Pet
          </Button>
        )}
      </div>

      {activeTab === 'dashboard' && renderDashboardOverview()}
      {activeTab === 'pets' && renderMyPets()}
      {activeTab === 'appointments' && renderAppointments()}
    </div>
  );
};

export default UserDashboard;
