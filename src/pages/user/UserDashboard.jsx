import React, { useState } from 'react';
import { Plus, FileText, HelpCircle, Heart, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import PetCard from '../../components/common/PetCard';
import StatCard from '../../components/common/StatCard';
import { usePets } from '../../hooks/usePets';
import { useAppointments } from '../../hooks/useAppointments';
import { SkeletonCard, SkeletonStat } from '../../components/common/Skeleton';
import BookingModal from '../../components/user/BookingModal';
import '../../styles/pages/dashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { pets, loading: petsLoading } = usePets();
  const { appointments, loading: aptsLoading, refetch: refetchApts } = useAppointments();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { title: 'My Pets', value: pets.length, icon: Heart, colorClass: 'primary' },
    { title: 'Upcoming', value: appointments.filter(a => a.status === 'confirmed').length, icon: Calendar, colorClass: 'primary' },
    { title: 'Pending', value: appointments.filter(a => a.status === 'pending').length, icon: Activity, colorClass: 'primary' },
  ];

  const recentRequests = appointments.slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Manage your pets and upcoming activities</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Create New Request</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-8">
        {petsLoading || aptsLoading ? (
          <><SkeletonStat /><SkeletonStat /><SkeletonStat /></>
        ) : (
          stats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))
        )}
      </div>

      <div className="dashboard-grid">
        {/* Pets Section */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Quick Overview</h2>
            <button className="btn-text" onClick={() => navigate('/dashboard/pets')}>View All Pets</button>
          </div>
          
          <div className="pets-grid-compact mt-4">
            {petsLoading ? (
              <><SkeletonCard /><SkeletonCard /></>
            ) : pets.length === 0 ? (
              <div className="empty-state">
                <p>No pets registered yet.</p>
                <button className="btn-outline mt-2" onClick={() => navigate('/dashboard/pets')}>Add your first pet</button>
              </div>
            ) : (
              pets.slice(0, 2).map(pet => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  name={pet.name}
                  type={pet.type}
                  breed={pet.breed}
                  age={pet.age}
                  status={pet.status}
                  image={pet.image_url}
                  createdAt={pet.created_at}
                  medicalRecordsCount={pet.medical_records?.length || 0}
                  onClick={() => navigate('/dashboard/pets')}
                />
              ))
            )}
          </div>
        </div>

        {/* Requests Section */}
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Requests</h2>
            <div className="icon-button" onClick={() => navigate('/dashboard/appointments')}><FileText size={20} /></div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {aptsLoading ? (
              <p className="text-muted">Loading requests...</p>
            ) : recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle size={40} className="mx-auto text-zinc-200 mb-2" />
                <p className="text-muted">No recent requests found.</p>
              </div>
            ) : (
              recentRequests.map((req) => (
                <div key={req.id} className="request-item" onClick={() => navigate('/dashboard/appointments')} style={{ cursor: 'pointer' }}>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{req.notes || 'General Checkup'}</h4>
                    <p className="text-muted text-xs">
                      {new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {req.doctor?.full_name && ` • Dr. ${req.doctor.full_name}`}
                    </p>
                  </div>
                  <span className={`req-badge req-${req.status}`}>
                    {req.status?.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <button 
            className="w-full mt-4 btn-primary-alt"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Request
          </button>
        </div>
      </div>

      {/* Shared Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookingSuccess={refetchApts}
      />
    </div>
  );
};

export default UserDashboard;
