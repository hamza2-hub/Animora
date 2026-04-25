import React from 'react';
import PetCard from '../../components/ui/PetCard';
import { mockPatients } from '../../data/mockData';

const Patients = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Patients</h1>
          <p className="dashboard-subtitle">Directory of all registered patients</p>
        </div>
      </div>

      <div className="section-card animate-slide-up">
        <div className="pets-grid">
          {mockPatients.map(pet => (
            <PetCard key={pet.id} name={pet.name} type={pet.type} age={pet.breed || pet.age} status={pet.status} image={pet.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
