import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import EmptyState from '../../components/ui/EmptyState';
import { userPets } from '../../data/mockData';
import '../../styles/pages/dashboard.css';

const MyPets = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">My Pets</h1>
          <p className="dashboard-subtitle">View and manage your registered pets</p>
        </div>
      </div>

      <div className="section-card animate-slide-up">
        <div className="section-header">
          <h2 className="section-title">All Pets</h2>
          <Button>
            <Plus size={18} className="mr-2" /> Register Pet
          </Button>
        </div>
        {userPets.length === 0 ? (
          <EmptyState 
            title="No pets yet" 
            message="You haven't registered any pets yet. Add your first furry friend to get started! 🐾" 
            actionText="Register Pet"
            onAction={() => alert("Open register modal")}
          />
        ) : (
          <div className="pets-grid">
            {userPets.map(pet => (
              <PetCard key={pet.id} name={pet.name} type={pet.type} age={pet.age} status={pet.status} image={pet.image} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPets;
