import React from 'react';
import PetCard from '../../components/ui/PetCard';
import { usePatients } from '../../hooks/usePatients';
import { SkeletonCard } from '../../components/ui/Skeleton';

const Patients = () => {
  const { patients, loading: isLoading } = usePatients();

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Patients</h1>
          <p className="dashboard-subtitle">Directory of all registered patients</p>
        </div>
      </div>

      <div className="section-card animate-slide-up">
        {isLoading ? (
          <div className="pets-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <div className="pets-grid">
            {patients.map(pet => (
              <PetCard 
                key={pet.id} 
                name={pet.name} 
                type={pet.type} 
                breed={pet.breed}
                age={pet.age} 
                status={pet.status} 
                image={pet.image_url} 
                ownerName={pet.profiles?.full_name}
                createdAt={pet.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
