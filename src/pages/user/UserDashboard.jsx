import React, { useState, useEffect } from 'react';
import { Plus, FileText, X, Loader2, Paperclip } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';
import PetCard from '../../components/common/PetCard';
import { SkeletonCard } from '../../components/common/Skeleton';
import FileAttachZone from '../../components/common/FileAttachZone';
import { usePets } from '../../hooks/usePets';
import { useAppointments } from '../../hooks/useAppointments';
import { appointmentService } from '../../services/appointmentService';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

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

  return (
    <div className="animate-fade-in relative">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Manage your pets and upcoming activities</p>
        </div>
        <Button onClick={() => navigate('/dashboard/pets')}>
          <Plus size={18} className="mr-2" /> Add Pet
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
                <p className="text-muted text-center py-4">No pets found. Add one to get started!</p>
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
                  <div className="skeleton h-14 rounded-lg opacity-50" />
                  <div className="skeleton h-14 rounded-lg opacity-50" />
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-muted text-sm text-center py-4">No recent requests found.</p>
              ) : (
                appointments.map(req => (
                  <div key={req.id} className="request-item">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{req.notes || `${req.pets?.name} Appointment`}</h4>
                      <p className="text-xs text-muted">
                        {new Date(req.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {req.doctor && ` • Dr. ${req.doctor.full_name}`}
                      </p>
                    </div>
                    <span className={`req-badge req-${req.status.toLowerCase()}`}>{req.status}</span>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-6" onClick={() => setIsModalOpen(true)}>
              Create New Request
            </Button>
          </div>
        </div>
      </div>

      {/* ── Create Request Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content max-w-[560px] w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Create Appointment Request</h3>
              <button className="modal-close" onClick={closeModal}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-1">
              {/* Pet */}
              <div className="form-group">
                <label className="form-label">Which Pet?</label>
                <select name="pet_id" className="form-input" value={formData.pet_id} onChange={handleInputChange} required>
                  <option value="">Select a pet</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div className="form-group">
                <label className="form-label">Select Doctor (Optional)</label>
                <select name="doctor_id" className="form-input" value={formData.doctor_id} onChange={handleInputChange}>
                  <option value="">Any Available Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input type="datetime-local" name="date" className="form-input" value={formData.date} onChange={handleInputChange} required />
              </div>

              {/* Reason */}
              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea name="notes" className="form-input min-h-[100px] resize-vertical" placeholder="e.g. Annual checkup, acting lethargic, previous treatment info..." rows="3" value={formData.notes} onChange={handleInputChange} required />
              </div>

              {/* File attachment */}
              <div className="form-group">
                <label className="form-label flex items-center gap-1.5">
                  <Paperclip size={13} className="text-primary" />
                  Attach Files (Optional)
                  <span className="text-[11px] text-muted font-normal ml-0.5">
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
                <div className="flex items-center gap-2 text-xs text-primary bg-primary-light px-4 py-2 rounded-lg">
                  <Loader2 size={14} className="animate-spin" />
                  {uploadProgress}
                </div>
              )}

              <div className="flex gap-3 justify-end mt-2">
                <Button variant="outline" type="button" onClick={closeModal} disabled={isSubmitting}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting} className="min-w-[140px]">
                  {isSubmitting
                    ? <><Loader2 size={16} className="animate-spin mr-2" />Submitting…</>
                    : 'Submit Request'
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
