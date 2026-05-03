import React, { useState, useEffect, useRef } from 'react';
import { Plus, FileText, X, Loader2, Paperclip, UploadCloud, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { usePets } from '../../hooks/usePets';
import { useAppointments } from '../../hooks/useAppointments';
import { appointmentService } from '../../services/appointmentService';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

/* ── File Attachment Zone ──────────────────── */
const FileAttachZone = ({ files, onAdd, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f => {
      if (f.size > 10 * 1024 * 1024) { toast.error(`${f.name} is too large (max 10 MB)`); return false; }
      return true;
    });
    onAdd(valid);
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--border-radius-md)',
          background: dragging ? 'var(--primary-light)' : '#f8fafc',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <UploadCloud size={28} style={{ color: dragging ? 'var(--primary)' : '#94a3b8', margin: '0 auto 6px', display: 'block' }} />
        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: dragging ? 'var(--primary-dark)' : '#475569' }}>
          Click or drag files here
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
          Images, PDFs, X-rays — max 10 MB each
        </p>
        <input ref={inputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Attached files list */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.6rem' }}>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-sm)' }}>
              <Paperclip size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" onClick={() => onRemove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: 2, flexShrink: 0 }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main Page ─────────────────────────────── */
const UserDashboard = () => {
  const navigate = useNavigate();
  const { pets, loading: isLoadingPets } = usePets();
  const { appointments, loading: isLoadingAppointments } = useAppointments();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState('');
  const [formData, setFormData] = useState({ pet_id: '', doctor_id: '', date: '', notes: '' });

  const location = useLocation();

  useEffect(() => {
    if (isModalOpen && doctors.length === 0) {
      appointmentService.getDoctors().then(data => setDoctors(data)).catch(console.error);
    }
  }, [isModalOpen, doctors.length]);

  useEffect(() => {
    if (location.state?.openAppointmentModal) {
      setIsModalOpen(true);
      if (location.state?.preselectedDoctorId) {
        setFormData(prev => ({ ...prev, doctor_id: location.state.preselectedDoctorId }));
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ pet_id: '', doctor_id: '', date: '', notes: '' });
    setAttachedFiles([]);
    setUploadProgress('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /* Upload files to Supabase Storage and return URLs */
  const uploadFiles = async (files) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setUploadProgress(`Uploading file ${i + 1} of ${files.length}…`);
      const ext = f.name.split('.').pop();
      const path = `appointments/${Date.now()}_${i}.${ext}`;
      const { error } = await supabase.storage.from('medical-files').upload(path, f);
      if (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${f.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from('medical-files').getPublicUrl(path);
      urls.push({ name: f.name, url: urlData.publicUrl, size: f.size, type: f.type });
    }
    setUploadProgress('');
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.pet_id) throw new Error('Please select a pet');
      if (!formData.date) throw new Error('Please select a date');

      // Upload attached files first
      let fileRecords = [];
      if (attachedFiles.length > 0) {
        fileRecords = await uploadFiles(attachedFiles);
      }

      const payload = { ...formData, files: fileRecords };
      if (payload.doctor_id === '') payload.doctor_id = null;

      await appointmentService.createAppointment(payload);
      toast.success('Appointment requested successfully!');
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Failed to request appointment');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.65rem 0.875rem',
    border: '1.5px solid var(--border)', borderRadius: 'var(--border-radius-md)',
    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
    background: '#f8fafc', color: 'var(--text-main)', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const focusInput = e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-light)'; };
  const blurInput  = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="animate-fade-in relative">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Manage your pets and upcoming activities</p>
        </div>
        <Button onClick={() => navigate('/dashboard/pets')}>
          <Plus size={18} style={{ marginRight: 6 }} /> Add Pet
        </Button>
      </div>

      <div className="dashboard-grid">
        <div className="grid-left">
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="section-header">
              <h2 className="section-title">Quick Overview</h2>
              <Button variant="text" size="small" onClick={() => navigate('/dashboard/pets')}>View All Pets</Button>
            </div>
            <div className="pets-grid" style={{ gridTemplateColumns: '1fr' }}>
              {isLoadingPets ? (
                <><SkeletonCard /><SkeletonCard /></>
              ) : pets.length === 0 ? (
                <p>No pets found. Add one to get started!</p>
              ) : (
                pets.slice(0, 2).map(pet => (
                  <PetCard
                    key={pet.id}
                    name={pet.name}
                    type={pet.type}
                    breed={pet.breed}
                    age={pet.age}
                    status={pet.status}
                    image={pet.image_url}
                    createdAt={pet.created_at}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid-right">
          <div className="section-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-header">
              <h2 className="section-title">Recent Requests</h2>
              <Button variant="text" size="small"><FileText size={16} /></Button>
            </div>
            <div className="request-list">
              {isLoadingAppointments ? (
                <div className="flex flex-col gap-3">
                  <div style={{ height: '60px', background: 'var(--border)', borderRadius: '8px', opacity: 0.5 }} className="skeleton" />
                  <div style={{ height: '60px', background: 'var(--border)', borderRadius: '8px', opacity: 0.5 }} className="skeleton" />
                </div>
              ) : appointments.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>No recent requests found.</p>
              ) : (
                appointments.map(req => (
                  <div key={req.id} className="request-item">
                    <div>
                      <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{req.notes || `${req.pets?.name} Appointment`}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {req.doctor && ` • Dr. ${req.doctor.full_name}`}
                      </p>
                    </div>
                    <span className={`req-badge req-${req.status.toLowerCase()}`}>{req.status}</span>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-4" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setIsModalOpen(true)}>
              Create New Request
            </Button>
          </div>
        </div>
      </div>

      {/* ── Create Request Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div className="modal-header">
              <h3 className="modal-title">Create Appointment Request</h3>
              <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.25rem 0' }}>
              {/* Pet */}
              <div className="form-group">
                <label className="form-label">Which Pet?</label>
                <select name="pet_id" style={inputStyle} value={formData.pet_id} onChange={handleInputChange} onFocus={focusInput} onBlur={blurInput} required>
                  <option value="">Select a pet</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div className="form-group">
                <label className="form-label">Select Doctor (Optional)</label>
                <select name="doctor_id" style={inputStyle} value={formData.doctor_id} onChange={handleInputChange} onFocus={focusInput} onBlur={blurInput}>
                  <option value="">Any Available Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input type="datetime-local" name="date" style={inputStyle} value={formData.date} onChange={handleInputChange} onFocus={focusInput} onBlur={blurInput} required />
              </div>

              {/* Reason */}
              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea name="notes" style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} placeholder="e.g. Annual checkup, acting lethargic, previous treatment info..." rows="3" value={formData.notes} onChange={handleInputChange} onFocus={focusInput} onBlur={blurInput} required />
              </div>

              {/* File attachment */}
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Paperclip size={13} style={{ color: 'var(--primary)' }} />
                  Attach Files (Optional)
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: 2 }}>
                    — previous treatments, X-rays, test results
                  </span>
                </label>
                <FileAttachZone
                  files={attachedFiles}
                  onAdd={newFiles => setAttachedFiles(prev => [...prev, ...newFiles])}
                  onRemove={idx => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                />
              </div>

              {/* Upload progress */}
              {uploadProgress && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.5rem 0.875rem', borderRadius: 'var(--border-radius-sm)' }}>
                  <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} />
                  {uploadProgress}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting} style={{ minWidth: 140 }}>
                  {isSubmitting
                    ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite', marginRight: 6 }} />Submitting…</>
                    : 'Submit Request'
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default UserDashboard;
