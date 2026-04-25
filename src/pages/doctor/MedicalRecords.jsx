import React from 'react';
import { FileText } from 'lucide-react';
import Button from '../../components/ui/Button';

const MedicalRecords = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header flex justify-between items-center hide-mobile">
        <div>
          <h1 className="dashboard-title">Medical Records</h1>
          <p className="dashboard-subtitle">Search and view patient medical history</p>
        </div>
      </div>

      <div className="section-card animate-slide-up text-center p-8 mt-6">
        <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
        <h2 className="section-title text-muted">No records selected</h2>
        <p className="text-muted mt-2 mb-4">Please search for a patient to view their medical history.</p>
        <Button variant="outline">Search Patients</Button>
      </div>
    </div>
  );
};

export default MedicalRecords;
