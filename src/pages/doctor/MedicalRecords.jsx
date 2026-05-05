import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Cat, Dog, Bird, HelpCircle, User, FileText,
  Calendar, Stethoscope, Plus, Loader2, ShieldCheck, Activity, Heart,
  ChevronRight, Clock, Pill
} from 'lucide-react';
import Button from '../../components/common/Button';
import { medicalService } from '../../services/medicalService';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import PetCard from '../../components/common/PetCard';
import '../../styles/pages/dashboard.css';

/* ── helpers ───────────────────────────────── */
const TYPE_ICONS = { cat: Cat, dog: Dog, bird: Bird };

const STATUS_CFG = {
  healthy:   { label: 'Healthy',   bg: '#dcfce7', color: '#15803d', dot: '#22c55e', Icon: ShieldCheck },
  treatment: { label: 'Treatment', bg: '#fef9c3', color: '#a16207', dot: '#eab308', Icon: Activity },
  emergency: { label: 'Emergency', bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', Icon: Heart },
};

const APT_STATUS = {
  pending:     { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b' },
  confirmed:   { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  in_progress: { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
  completed:   { bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
  cancelled:   { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' },
};

const getStatusCfg = (s) => STATUS_CFG[s?.toLowerCase()] || STATUS_CFG.healthy;
const getAptCfg    = (s) => APT_STATUS[s?.toLowerCase()] || APT_STATUS.pending;

/* ── PatientListItem ───────────────────────── */
const PatientListItem = ({ pet, isSelected, onClick }) => {
  const TypeIcon = TYPE_ICONS[pet.type?.toLowerCase()] || HelpCircle;
  const cfg = getStatusCfg(pet.status);
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ x: 3 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.875rem',
        padding: '0.875rem 1rem', borderRadius: 'var(--border-radius-md)',
        cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
        background: isSelected ? 'var(--primary-light)' : 'transparent',
        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'transparent'}`,
        marginBottom: '0.25rem',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: isSelected ? 'white' : '#f1f5f9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isSelected ? 'var(--primary)' : '#64748b',
        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
      }}>
        {pet.image_url
          ? <img src={pet.image_url} alt={pet.name} style={{ width: '100%', height: '100%', borderRadius: 12, objectFit: 'cover' }} />
          : <TypeIcon size={20} strokeWidth={1.5} />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pet.name}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <TypeIcon size={11} /> {pet.type} {pet.breed ? `· ${pet.breed}` : ''}
        </p>
      </div>
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
    </motion.div>
  );
};

/* ── RecordRow ────────────────────────────── */
const RecordRow = ({ rec }) => (
  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-md)', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Pill size={16} style={{ color: '#7c3aed' }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{rec.diagnosis}</p>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {new Date(rec.date || rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      {rec.treatment && <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: 4, lineHeight: 1.6 }}>{rec.treatment}</p>}
    </div>
  </div>
);

/* ── AppointmentRow ────────────────────────── */
const AptRow = ({ apt }) => {
  const cfg = getAptCfg(apt.status);
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-md)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
          {new Date(apt.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
          {apt.notes || 'General visit'} {apt.doctor?.full_name ? `· Dr. ${apt.doctor.full_name}` : ''}
        </p>
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.2rem 0.6rem', borderRadius: 99, background: cfg.bg, fontSize: '0.7rem', fontWeight: 700, color: cfg.color, whiteSpace: 'nowrap' }}>
        {apt.status?.replace('_', ' ')}
      </span>
    </div>
  );
};

/* ── AddRecordForm ─────────────────────────── */
const AddRecordForm = ({ petId, onAdded }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ diagnosis: '', treatment: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.diagnosis.trim()) { toast.error('Diagnosis is required'); return; }
    setSaving(true);
    try {
      await medicalService.addMedicalRecord(petId, form);
      toast.success('Medical record added');
      setForm({ diagnosis: '', treatment: '' });
      setOpen(false);
      onAdded();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add record');
    } finally { setSaving(false); }
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.875rem',
    border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)',
    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    background: '#f8fafc', color: 'var(--text-main)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.6rem 1rem', borderRadius: 'var(--border-radius-md)', background: 'var(--primary-light)', border: '1.5px dashed var(--primary)', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', width: '100%', justifyContent: 'center', fontFamily: 'inherit' }}>
          <Plus size={16} /> Add Medical Record
        </button>
      ) : (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f8fafc', border: '1.5px solid var(--primary)', borderRadius: 'var(--border-radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={16} style={{ color: 'var(--primary)' }} /> New Medical Record</p>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>Diagnosis *</label>
            <input value={form.diagnosis} onChange={e => setForm(p => ({ ...p, diagnosis: e.target.value }))} placeholder="e.g. Mild skin infection" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>Treatment</label>
            <textarea value={form.treatment} onChange={e => setForm(p => ({ ...p, treatment: e.target.value }))} placeholder="Prescribed treatment, medication..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setOpen(false)} style={{ padding: '0.5rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)', background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>Cancel</button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Record'}</Button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

/* ── DetailPanel ───────────────────────────── */
const DetailPanel = ({ pet }) => {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('records');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [apts, recs] = await Promise.all([
        medicalService.getAppointmentsForPet(pet.id),
        medicalService.getMedicalRecordsForPet(pet.id),
      ]);
      setAppointments(apts || []);
      setRecords(recs || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load patient data');
    } finally { setLoading(false); }
  }, [pet.id]);

  useEffect(() => { 
    load(); 
    const channel = supabase.channel(`pet_details_${pet.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medical_records', filter: `pet_id=eq.${pet.id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments', filter: `pet_id=eq.${pet.id}` }, () => load())
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [load, pet.id]);

  const tabs = [
    { id: 'records',      label: 'Medical Records', count: records.length,      icon: FileText },
    { id: 'appointments', label: 'Appointments',    count: appointments.length, icon: Calendar },
  ];

  return (
    <motion.div key={pet.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <PetCard 
          name={pet.name} type={pet.type} breed={pet.breed} age={pet.age}
          status={pet.status} image={pet.image_url} ownerName={pet.profiles?.full_name}
          createdAt={pet.created_at} medicalRecordsCount={records.length}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.5rem', borderRadius: 'var(--border-radius-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem', background: activeTab === t.id ? 'white' : 'transparent', color: activeTab === t.id ? 'var(--text-main)' : 'var(--text-muted)' }}>
            <t.icon size={14} /> {t.label}
            <span style={{ padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.68rem', background: activeTab === t.id ? 'var(--primary-light)' : 'var(--border)' }}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 70, borderRadius: 'var(--border-radius-md)' }} />)
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeTab === 'records' ? (
                <>
                  <AddRecordForm petId={pet.id} onAdded={load} />
                  {records.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No records yet</p> : records.map(r => <RecordRow key={r.id} rec={r} />)}
                </>
              ) : (
                appointments.length === 0 ? <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No appointments</p> : appointments.map(a => <AptRow key={a.id} apt={a} />)
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

/* ── Main Page ─────────────────────────────── */
const MedicalRecords = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const location = useLocation();

  useEffect(() => {
    medicalService.getAllPets()
      .then(data => {
        setPets(data || []);
        if (location.state?.preselectedPetId) {
          const preselected = (data || []).find(p => p.id === location.state.preselectedPetId);
          if (preselected) setSelectedPet(preselected);
          window.history.replaceState({}, document.title);
        }
      })
      .catch(err => { console.error(err); toast.error('Failed to load patients'); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = pets.filter(p => (p.name || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div className="dashboard-header" style={{ marginBottom: '1.25rem' }}>
        <h1 className="dashboard-title">Medical Records</h1>
        <p className="dashboard-subtitle">Select a patient to view their history</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-md)' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
            {loading ? <p>Loading...</p> : filtered.map(pet => (
              <PatientListItem key={pet.id} pet={pet} isSelected={selectedPet?.id === pet.id} onClick={() => setSelectedPet(pet)} />
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', padding: '1.5rem', overflowY: 'auto' }}>
          {!selectedPet ? <p style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Select a patient to start</p> : <DetailPanel pet={selectedPet} />}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
