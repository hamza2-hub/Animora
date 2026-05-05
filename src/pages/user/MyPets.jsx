import React, { useState } from 'react';
import { Plus, X, Loader2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';
import PetCard from '../../components/common/PetCard';
import EmptyState from '../../components/common/EmptyState';
import { usePets } from '../../hooks/usePets';
import { SkeletonCard } from '../../components/common/Skeleton';
import { petService } from '../../services/petService';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import '../../styles/pages/dashboard.css';

const MyPets = () => {
  const { t } = useTranslation();
  const { pets, loading: isLoading, removePetFromState, addPetToState } = usePets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `pets/${fileName}`;

      const { data, error } = await supabase.storage
        .from('medical-files')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('medical-files')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPet = await petService.addPet(formData);
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
    removePetFromState(petId);
    try {
      await petService.deletePet(petId);
      toast.success(`${petName} has been removed.`);
    } catch (error) {
      toast.error('Failed to delete pet. Please try again.');
      console.error(error);
      window.location.reload();
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="dashboard-header flex justify-between items-center">
        <div>
          <h1 className="dashboard-title">{t('pets.title')}</h1>
          <p className="dashboard-subtitle">{t('pets.subtitle')}</p>
        </div>
      </div>

      <div className="section-card animate-slide-up">
        <div className="section-header">
          <h2 className="section-title">{t('pets.all_pets')}</h2>
          {(!isLoading && pets.length > 0) && (
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus size={18} className="mr-2" /> {t('pets.register')}
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="pets-page-grid">
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
              title={t('pets.no_pets_title')} 
              message={t('pets.no_pets_message')} 
              actionText={t('pets.register')}
              onAction={() => setIsModalOpen(true)}
            />
          </div>
        ) : (
          <div className="pets-page-grid">
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
                  medicalRecordsCount={pet.medical_records?.length || 0}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(pet.id, pet.name); }}
                  disabled={deletingId === pet.id}
                  title="Remove pet"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(254,226,226,0.95)',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '6px 7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc2626',
                    transition: 'background 0.2s, box-shadow 0.2s',
                    zIndex: 10,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {deletingId === pet.id
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Trash2 size={14} />}
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
              <h3 className="modal-title">{t('pets.form.title')}</h3>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('pets.form.name')}</label>
                <input type="text" name="name" className="form-input" placeholder={t('pets.form.name_placeholder')} value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">{t('pets.form.type')}</label>
                <input type="text" name="type" className="form-input" placeholder={t('pets.form.type_placeholder')} value={formData.type} onChange={handleInputChange} required />
              </div>
              <div className="settings-grid-2">
                <div className="form-group">
                  <label className="form-label">{t('pets.form.breed')}</label>
                  <input type="text" name="breed" className="form-input" placeholder={t('pets.form.breed_placeholder')} value={formData.breed} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('pets.form.age')}</label>
                  <input type="number" min="0" max="50" name="age" className="form-input" placeholder={t('pets.form.age_placeholder')} value={formData.age} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group settings-col-span-2">
                <label className="form-label">{t('pets.form.image')}</label>
                <div className="flex flex-col gap-2">
                  {formData.image_url ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-zinc-200 group">
                      <img src={formData.image_url} alt="Pet preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        id="pet-image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="pet-image-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          isUploading ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-50 border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/30'
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-emerald-600" size={24} />
                            <span className="text-xs text-zinc-500 font-medium">{t('pets.form.uploading')}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Plus className="text-zinc-400" size={24} />
                            <span className="text-xs text-zinc-500 font-medium text-center px-4">{t('pets.form.upload_click')}</span>
                            <span className="text-[10px] text-zinc-400">{t('pets.form.upload_limit')}</span>
                          </div>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-6 justify-end">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>{t('pets.form.cancel')}</Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('pets.form.save')}
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
