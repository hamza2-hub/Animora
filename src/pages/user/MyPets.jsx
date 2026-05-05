import React, { useState } from 'react';
import { Plus, X, Loader2, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import PetCard from '../../components/common/PetCard';
import EmptyState from '../../components/common/EmptyState';
import { usePets } from '../../hooks/usePets';
import { SkeletonCard } from '../../components/common/Skeleton';
import { petService } from '../../services/petService';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

const MyPets = () => {
  const { pets, loading: isLoading, removePetFromState, addPetToState } = usePets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    image_url: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPet = await petService.addPet(formData);
      // Optimistically add to UI instantly
      addPetToState(newPet);
      toast.success('Pet registered successfully!');
      setIsModalOpen(false);
      setFormData({ name: '', type: '', breed: '', age: '', image_url: '' });
    } catch (error) {
      toast.error('Failed to register pet. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (petId, petName) => {
    if (!window.confirm(`Are you sure you want to remove "${petName}" from your pets? This cannot be undone.`)) return;
    // Optimistic update: remove immediately from UI
    removePetFromState(petId);
    try {
      await petService.deletePet(petId);
      toast.success(`${petName} has been removed.`);
    } catch (error) {
      toast.error('Failed to delete pet. Please try again.');
      console.error(error);
      // Re-fetch to restore state if delete failed
      window.location.reload();
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">My Pets</h1>
          <p className="dashboard-subtitle">View and manage your registered pets</p>
        </div>
      </div>

      <div className="section-card animate-slide-up">
        <div className="section-header">
          <h2 className="section-title">All Pets</h2>
          {(!isLoading && pets.length > 0) && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={18} className="mr-2" /> Register Pet
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="pets-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : pets.length === 0 ? (
          <div 
            className="empty-state-container"
            style={{ 
              border: '1px solid rgba(255, 255, 255, 0.5)', 
              borderRadius: '24px', 
              background: 'linear-gradient(145deg, #ffffff, #f0f4f8)', 
              marginTop: '1.5rem',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,1)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 60%)',
              pointerEvents: 'none'
            }}></div>
            <EmptyState 
              title="No pets yet" 
              message="You haven't registered any pets yet. Add your first furry friend to get started! 🐾" 
              actionText="Register Pet"
              onAction={() => setIsModalOpen(true)}
            />
          </div>
        ) : (
          <div className="pets-grid">
            {pets.map(pet => (
              <div key={pet.id} style={{ position: 'relative' }}>
                <PetCard 
                  name={pet.name} 
                  type={pet.type} 
                  breed={pet.breed}
                  age={pet.age} 
                  status={pet.status} 
                  image={pet.image_url} 
                  createdAt={pet.created_at}
                />
                <button
                  onClick={() => handleDelete(pet.id, pet.name)}
                  disabled={deletingId === pet.id}
                  title="Remove pet"
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc2626',
                    transition: 'background 0.2s',
                    zIndex: 10,
                  }}
                >
                  {deletingId === pet.id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Pet Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Register New Pet</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Pet Name</label>
                <input type="text" name="name" className="form-input" placeholder="e.g. Bella" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Animal Type</label>
                <input type="text" name="type" className="form-input" placeholder="e.g. Dog, Cat, Bird" value={formData.type} onChange={handleInputChange} required />
              </div>
              <div className="settings-grid-2">
                <div className="form-group">
                  <label className="form-label">Breed (Optional)</label>
                  <input type="text" name="breed" className="form-input" placeholder="e.g. Golden Retriever" value={formData.breed} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age in Years (Optional)</label>
                  <input type="number" min="0" max="50" name="age" className="form-input" placeholder="e.g. 5" value={formData.age} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group settings-col-span-2">
                <label className="form-label">Image URL (Optional)</label>
                <input type="url" name="image_url" className="form-input" placeholder="https://example.com/image.jpg" value={formData.image_url} onChange={handleInputChange} />
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Pet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPets;
