import React from 'react';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { userPets, userRequests } from '../../data/mockData';
import '../../styles/pages/dashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Manage your pets and upcoming activities</p>
        </div>
        <Button onClick={() => navigate('/user-dashboard/pets')}>
          <Plus size={18} className="mr-2" /> Add Pet
        </Button>
      </div>

      <div className="dashboard-grid">
        <div className="grid-left">
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2 className="section-title">Quick Overview</h2>
              <Button variant="text" size="small" onClick={() => navigate('/user-dashboard/pets')}>View All Pets</Button>
            </div>
            <div className="pets-grid">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                userPets.slice(0, 2).map(pet => (
                  <PetCard key={pet.id} name={pet.name} type={pet.type} age={pet.age} status={pet.status} image={pet.image} />
                ))
              )}
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
              {isLoading ? (
                <div className="flex flex-col gap-3">
                  <div style={{ height: '60px', background: 'var(--border)', borderRadius: '8px', opacity: 0.5 }} className="skeleton" />
                  <div style={{ height: '60px', background: 'var(--border)', borderRadius: '8px', opacity: 0.5 }} className="skeleton" />
                </div>
              ) : (
                userRequests.map(req => (
                  <div key={req.id} className="request-item">
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.title}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{req.date}</p>
                    </div>
                    <span className={`req-badge req-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-4" style={{ marginTop: '1.5rem' }}>
              Create New Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
