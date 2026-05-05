import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, HelpCircle } from 'lucide-react';
import { usePatients } from '../../hooks/usePatients';
import { SkeletonCard } from '../../components/common/Skeleton';
import PetCard from '../../components/common/PetCard';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/dashboard.css';

const Patients = () => {
  const { patients, loading: isLoading } = usePatients();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p =>
    (p.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.type?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.profiles?.full_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  // Group by status for counts (using standard status keys)
  const counts = patients.reduce((acc, p) => {
    const s = p.status?.toLowerCase() || 'healthy';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Simple mapping for display labels in the chips
  const STATUS_LABELS = {
    healthy: 'Healthy',
    treatment: 'Treatment',
    emergency: 'Emergency'
  };

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header" style={{ marginBottom: '1.25rem' }}>
        <h1 className="dashboard-title">Patients</h1>
        <p className="dashboard-subtitle">Directory of all registered patients — click a patient to view their records</p>
      </div>

      {/* Summary chips */}
      {!isLoading && patients.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.875rem', borderRadius: 99, background: '#f1f5f9', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>All · {patients.length}</div>
          {Object.entries(counts).map(([status, count]) => (
            <div 
              key={status} 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 6, 
                padding: '0.4rem 0.875rem', borderRadius: 99, 
                background: status === 'emergency' ? '#fee2e2' : status === 'treatment' ? '#fef9c3' : '#dcfce7', 
                color: status === 'emergency' ? '#b91c1c' : status === 'treatment' ? '#a16207' : '#15803d', 
                fontSize: '0.8rem', fontWeight: 700 
              }}
            >
              <span style={{ 
                width: 7, height: 7, borderRadius: '50%', 
                background: status === 'emergency' ? '#ef4444' : status === 'treatment' ? '#eab308' : '#22c55e' 
              }} />
              {STATUS_LABELS[status] || status} · {count}
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '1rem 1.25rem', marginBottom: '1.25rem', boxShadow: 'var(--shadow-soft)', position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', left: 36, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by pet name, type, or owner…"
          style={{ width: '100%', padding: '0.65rem 2.25rem', border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)', fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: 'var(--text-main)', transition: 'border-color 0.2s, box-shadow 0.2s' }}
          onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
        )}
      </div>

      {/* Patient Grid */}
      <div className="pets-page-grid">
        {isLoading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : filtered.length === 0 ? (
          <div className="section-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <HelpCircle size={40} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 700 }}>No patients found</p>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try adjusting your search</p>
          </div>
        ) : (
          filtered.map((pet) => (
            <PetCard
              key={pet.id}
              id={pet.id}
              name={pet.name}
              type={pet.type}
              breed={pet.breed}
              age={pet.age}
              status={pet.status}
              image={pet.image_url}
              ownerName={pet.profiles?.full_name}
              createdAt={pet.created_at}
              medicalRecordsCount={pet.medical_records?.length || 0}
              onClick={() => navigate('/doctor-dashboard/records', { state: { preselectedPetId: pet.id } })}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Patients;

