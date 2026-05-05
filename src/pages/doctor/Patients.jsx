import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Cat, Dog, Bird, HelpCircle, User, ChevronRight, ShieldCheck, Activity, Heart, Clock } from 'lucide-react';
import { usePatients } from '../../hooks/usePatients';
import { SkeletonCard } from '../../components/common/Skeleton';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/dashboard.css';

const TYPE_ICONS = { cat: Cat, dog: Dog, bird: Bird };

const STATUS_CFG = {
  healthy:   { label: 'Healthy',   bg: '#dcfce7', color: '#15803d', dot: '#22c55e', border: '#86efac', Icon: ShieldCheck },
  treatment: { label: 'Treatment', bg: '#fef9c3', color: '#a16207', dot: '#eab308', border: '#fde047', Icon: Activity },
  emergency: { label: 'Emergency', bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', border: '#fca5a5', Icon: Heart },
};
const getStatusCfg = (s) => STATUS_CFG[s?.toLowerCase()] || { label: s || 'Unknown', bg: '#f1f5f9', color: '#475569', dot: '#94a3b8', border: '#e2e8f0', Icon: ShieldCheck };

const PetRow = ({ pet, onClick }) => {
  const TypeIcon = TYPE_ICONS[pet.type?.toLowerCase()] || HelpCircle;
  const cfg = getStatusCfg(pet.status);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -3, boxShadow: '0 12px 28px rgba(16,185,129,0.1)', borderColor: 'var(--primary)' }}
      style={{
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 'var(--border-radius-md)', padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
        cursor: 'pointer', transition: 'all 0.2s ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Status accent */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: cfg.dot, borderRadius: '4px 0 0 4px' }} />

      {/* Avatar */}
      <div style={{ width: 52, height: 52, borderRadius: 14, background: cfg.bg, border: `1.5px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
        {pet.image_url
          ? <img src={pet.image_url} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <TypeIcon size={22} strokeWidth={1.5} style={{ color: cfg.color }} />
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pet.name}</p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.15rem 0.55rem', borderRadius: 99, background: cfg.bg, color: cfg.color, fontSize: '0.68rem', fontWeight: 700, border: `1px solid ${cfg.border}`, flexShrink: 0 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />{cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <TypeIcon size={12} strokeWidth={2} /> <span style={{ textTransform: 'capitalize' }}>{pet.type}</span>
            {pet.breed && <><span style={{ color: '#cbd5e1' }}>·</span>{pet.breed}</>}
          </span>
          {pet.age && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🎂 {pet.age} yr{pet.age !== 1 ? 's' : ''}</span>}
          {pet.profiles?.full_name && (
            <span style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: 3, background: '#ecfdf5', padding: '0.15rem 0.5rem', borderRadius: 6, border: '1px solid #a7f3d0' }}>
              <User size={10} /> {pet.profiles.full_name}
            </span>
          )}
        </div>
      </div>

      {/* Added date + arrow */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRight size={16} style={{ color: 'var(--primary-dark)' }} />
        </div>
        {pet.created_at && (
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} /> {new Date(pet.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const Patients = () => {
  const { patients, loading: isLoading } = usePatients();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = patients.filter(p =>
    (p.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.type?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.profiles?.full_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  // Group by status for counts
  const counts = patients.reduce((acc, p) => {
    const s = p.status?.toLowerCase() || 'unknown';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

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
          {Object.entries(counts).map(([status, count]) => {
            const cfg = STATUS_CFG[status] || { label: status, bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
            return (
              <div key={status} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.875rem', borderRadius: 99, background: cfg.bg, color: cfg.color, fontSize: '0.8rem', fontWeight: 700 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot }} />{cfg.label} · {count}
              </div>
            );
          })}
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

      {/* Patient list */}
      <div className="section-card animate-slide-up" style={{ padding: '1.25rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 76, borderRadius: 'var(--border-radius-md)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <HelpCircle size={40} style={{ opacity: 0.25, display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 700 }}>No patients found</p>
            <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Try adjusting your search</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {filtered.map((pet, i) => (
              <motion.div key={pet.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <PetRow
                  pet={pet}
                  onClick={() => navigate('/doctor-dashboard/records', { state: { preselectedPetId: pet.id } })}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
