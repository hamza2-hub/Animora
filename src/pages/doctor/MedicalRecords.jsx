import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Cat, Dog, Bird, HelpCircle, User, FileText,
  Calendar, Stethoscope, Plus, Loader2, ShieldCheck, Activity, Heart,
  ChevronRight, Clock, Pill
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { medicalService } from '../../services/medicalService';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

/* ── helpers ───────────────────────────────── */
const TYPE_ICONS = { cat: Cat, dog: Dog, bird: Bird };

const STATUS_CFG = {
  healthy:   { label: 'Healthy',   bg: '#dcfce7', color: '#15803d', dot: '#22c55e', Icon: ShieldCheck },
  treatment: { label: 'Treatment', bg: '#fef9c3', color: '#a16207', dot: '#eab308', Icon: Activity },
  emergency: { label: 'Emergency', bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444', Icon: Heart },
};

const APT_STATUS = {
  pending:     { bg: '#fef9c3', color: '#a16207', dot: '#eab308' },
  confirmed:   { bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
  in_progress: { bg: '#d1fae5', color: '#065f46', dot: '#10b981' },
  completed:   { bg: '#e0f2fe', color: '#0369a1', dot: '#0ea5e9' },
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
      {/* Avatar */}
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
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pet.name}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <TypeIcon size={11} /> {pet.type} {pet.breed ? `· ${pet.breed}` : ''}
        </p>
      </div>
      {/* Status dot */}
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
    </motion.div>
  );
};

/* ── RecordRow (medical_records table) ─────── */
const RecordRow = ({ rec }) => (
  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-md)', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Pill size={16} style={{ color: '#7c3aed' }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{rec.diagnosis}</p>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.55rem 1rem', borderRadius: 'var(--border-radius-md)', background: 'var(--primary-light)', border: '1.5px dashed var(--primary)', color: 'var(--primary-dark)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', width: '100%', justifyContent: 'center', fontFamily: 'inherit' }}>
          <Plus size={15} /> Add Medical Record
        </button>
      ) : (
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f8fafc', border: '1.5px solid var(--primary)', borderRadius: 'var(--border-radius-md)', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} style={{ color: 'var(--primary)' }} /> New Medical Record</p>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>Diagnosis *</label>
            <input value={form.diagnosis} onChange={e => setForm(p => ({ ...p, diagnosis: e.target.value }))} placeholder="e.g. Mild skin infection" style={inputStyle} onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
          </div>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>Treatment</label>
            <textarea value={form.treatment} onChange={e => setForm(p => ({ ...p, treatment: e.target.value }))} placeholder="Prescribed treatment, medication, follow-up..." rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; }} onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setOpen(false)} style={{ padding: '0.5rem 1rem', border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)', background: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cancel</button>
            <Button type="submit" disabled={saving} style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
              {saving ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : 'Save Record'}
            </Button>
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

  const TypeIcon = TYPE_ICONS[pet.type?.toLowerCase()] || HelpCircle;
  const cfg = getStatusCfg(pet.status);

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

  useEffect(() => { load(); }, [load]);

  const tabs = [
    { id: 'records',      label: 'Medical Records', count: records.length,      icon: FileText },
    { id: 'appointments', label: 'Appointments',    count: appointments.length, icon: Calendar },
  ];

  return (
    <motion.div key={pet.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Pet header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #34d399 100%)', borderRadius: 'var(--border-radius-lg)', padding: '1.5rem', marginBottom: '1.25rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {pet.image_url
              ? <img src={pet.image_url} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <TypeIcon size={30} strokeWidth={1.4} />
            }
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{pet.name}</h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.85, margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TypeIcon size={13} /> {pet.type}{pet.breed ? ` · ${pet.breed}` : ''}{pet.age ? ` · ${pet.age} yrs` : ''}
            </p>
          </div>
          {/* Status badge */}
          <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{ padding: '0.3rem 0.875rem', borderRadius: 99, background: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.75rem', border: `1.5px solid ${cfg.dot}` }}>{cfg.label}</span>
            {pet.profiles?.full_name && (
              <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: 4 }}><User size={11} /> {pet.profiles.full_name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--border-radius-md)', marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.5rem', borderRadius: 'var(--border-radius-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.2s', background: activeTab === t.id ? 'white' : 'transparent', color: activeTab === t.id ? 'var(--text-main)' : 'var(--text-muted)', boxShadow: activeTab === t.id ? 'var(--shadow-soft)' : 'none' }}>
            <t.icon size={14} />
            {t.label}
            <span style={{ padding: '0.1rem 0.4rem', borderRadius: 99, fontSize: '0.68rem', fontWeight: 800, background: activeTab === t.id ? 'var(--primary-light)' : 'var(--border)', color: activeTab === t.id ? 'var(--primary-dark)' : 'var(--text-muted)' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 70, borderRadius: 'var(--border-radius-md)' }} />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeTab === 'records' ? (
                <>
                  <AddRecordForm petId={pet.id} onAdded={load} />
                  {records.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      <FileText size={36} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                      <p style={{ fontWeight: 600 }}>No medical records yet</p>
                      <p style={{ fontSize: '0.8rem', marginTop: 4 }}>Add the first record above</p>
                    </div>
                  ) : records.map(r => <RecordRow key={r.id} rec={r} />)}
                </>
              ) : (
                appointments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    <Calendar size={36} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                    <p style={{ fontWeight: 600 }}>No appointments found</p>
                  </div>
                ) : appointments.map(a => <AptRow key={a.id} apt={a} />)
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
  const [pets, setPets]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const location = useLocation();

  useEffect(() => {
    medicalService.getAllPets()
      .then(data => {
        setPets(data || []);
        // Auto-select patient if navigated from Patients page
        if (location.state?.preselectedPetId) {
          const preselected = (data || []).find(p => p.id === location.state.preselectedPetId);
          if (preselected) setSelectedPet(preselected);
          window.history.replaceState({}, document.title);
        }
      })
      .catch(err => { console.error(err); toast.error('Failed to load patients'); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = pets.filter(p =>
    (p.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.type?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.profiles?.full_name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: '1.25rem', flexShrink: 0 }}>
        <h1 className="dashboard-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <FileText size={22} style={{ color: 'var(--primary)' }} /> Medical Records
        </h1>
        <p className="dashboard-subtitle">Select a patient to view and manage their health history</p>
      </div>

      {/* Body: 2 panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.25rem', flex: 1, minHeight: 0 }}>

        {/* LEFT — patient list */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-soft)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search */}
          <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Patients</p>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, type, owner…"
                style={{ width: '100%', padding: '0.55rem 2rem 0.55rem 2rem', border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', background: '#f8fafc', boxSizing: 'border-box', color: 'var(--text-main)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
              {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><X size={14} /></button>}
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 'var(--border-radius-md)', marginBottom: 8 }} />)
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <HelpCircle size={28} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No patients found</p>
              </div>
            ) : (
              filtered.map(pet => (
                <PatientListItem key={pet.id} pet={pet} isSelected={selectedPet?.id === pet.id} onClick={() => setSelectedPet(pet)} />
              ))
            )}
          </div>

          {/* Footer count */}
          <div style={{ padding: '0.625rem 1rem', borderTop: '1px solid var(--border)', background: '#f8fafc', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
            {filtered.length} patient{filtered.length !== 1 ? 's' : ''} {search ? 'matching' : 'total'}
          </div>
        </div>

        {/* RIGHT — detail panel */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-lg)', boxShadow: 'var(--shadow-soft)', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {!selectedPet ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', gap: '0.75rem' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <Stethoscope size={32} />
              </div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>Select a Patient</h3>
              <p style={{ fontSize: '0.875rem', maxWidth: 280 }}>Choose a patient from the list on the left to view their medical records and appointment history.</p>
            </div>
          ) : (
            <DetailPanel pet={selectedPet} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .medical-records-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default MedicalRecords;
