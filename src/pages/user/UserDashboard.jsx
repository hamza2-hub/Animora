import React, { useState, useEffect } from 'react';
import { Plus, FileText, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import PetCard from '../../components/ui/PetCard';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { usePets } from '../../hooks/usePets';
import { useAppointments } from '../../hooks/useAppointments';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { pets, loading: isLoadingPets } = usePets();
  const { appointments, loading: isLoadingAppointments } = useAppointments();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    pet_id: '',
    doctor_id: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    if (isModalOpen && doctors.length === 0) {
      appointmentService.getDoctors().then(data => setDoctors(data)).catch(console.error);
    }
  }, [isModalOpen, doctors.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.pet_id) throw new Error('Please select a pet');
      if (!formData.date) throw new Error('Please select a date');
      
      const payload = { ...formData };
      if (payload.doctor_id === '') payload.doctor_id = null;

      await appointmentService.createAppointment(payload);
      toast.success('Appointment requested successfully!');
      setIsModalOpen(false);
      setFormData({ pet_id: '', doctor_id: '', date: '', notes: '' });
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
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
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
              <Button variant="text" size="small"><FileText size={16}/></Button>
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
                    <span className={`req-badge req-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Button className="w-full mt-4" style={{ marginTop: '1.5rem' }} onClick={() => setIsModalOpen(true)}>
              Create New Request
            </Button>
          </div>
        </div>
      </div>

      {/* Create Request Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Appointment Request</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Which Pet?</label>
                <select name="pet_id" className="form-input" value={formData.pet_id} onChange={handleInputChange} required>
                  <option value="">Select a pet</option>
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Select Doctor (Optional)</label>
                <select name="doctor_id" className="form-input" value={formData.doctor_id} onChange={handleInputChange}>
                  <option value="">Any Available Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Date</label>
                <input type="datetime-local" name="date" className="form-input" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <textarea name="notes" className="form-input" placeholder="e.g. Annual checkup, acting lethargic..." rows="3" value={formData.notes} onChange={handleInputChange} required></textarea>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Submit Request'}
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
