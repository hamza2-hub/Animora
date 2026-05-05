import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MessageSquare, Loader2, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import FileAttachZone from '../common/FileAttachZone';
import { appointmentService } from '../../services/appointmentService';
import { petService } from '../../services/petService';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, onBookingSuccess }) => {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState('');
  
  const [formData, setFormData] = useState({
    doctor_id: '',
    pet_id: '',
    date: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [docsData, petsData] = await Promise.all([
        appointmentService.getDoctors(),
        petService.getPets()
      ]);
      setDoctors(docsData || []);
      setPets(petsData || []);
      
      if (petsData?.length > 0) {
        setFormData(prev => ({ ...prev, pet_id: petsData[0].id }));
      }
    } catch (error) {
      console.error("Failed to load booking data:", error);
      toast.error("Failed to load required information");
    } finally {
      setIsLoading(false);
    }
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
      urls.push({ 
        name: f.name, 
        url: urlData.publicUrl, 
        size: f.size, 
        type: f.type 
      });
    }
    setUploadProgress('');
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pet_id || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      
      let fileRecords = [];
      if (attachedFiles.length > 0) {
        fileRecords = await uploadFiles(attachedFiles);
      }

      const payload = {
        doctor_id: formData.doctor_id || null,
        pet_id: formData.pet_id,
        date: formData.date,
        notes: formData.notes,
        files: fileRecords,
        status: 'pending'
      };

      await appointmentService.createAppointment(payload);
      
      toast.success("Appointment requested successfully!");
      onBookingSuccess();
      handleClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ doctor_id: '', pet_id: '', date: '', notes: '' });
    setAttachedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-emerald-50/50 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{t('booking.title')}</h2>
              <p className="text-sm text-zinc-500">{t('booking.subtitle')}</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white rounded-full transition-colors text-zinc-400">
              <X size={20} />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {isLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-emerald-600" size={32} />
                  <p className="text-zinc-500 font-medium">Loading details...</p>
                </div>
              ) : (
                <>
                  {/* Pet Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <span className="size-4 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white">P</span> {t('booking.form.select_pet')} *
                    </label>
                    <select 
                      required
                      value={formData.pet_id}
                      onChange={(e) => setFormData({...formData, pet_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                    >
                      <option value="">{t('booking.form.select_pet')}</option>
                      {pets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                      ))}
                    </select>
                  </div>

                  {/* Doctor Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <User size={16} className="text-emerald-600" /> {t('booking.form.select_doctor')}
                    </label>
                    <select 
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                    >
                      <option value="">Any Available Doctor</option>
                      {doctors.map(doc => (
                        <option key={doc.id} value={doc.id}>Dr. {doc.full_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date/Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-600" /> {t('booking.form.date')} *
                    </label>
                    <input 
                      type="datetime-local"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                    />
                  </div>

                  {/* File Attachment */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <Paperclip size={16} className="text-emerald-600" />
                      Attach Medical Records or Images
                    </label>
                    <FileAttachZone 
                      files={attachedFiles}
                      onAdd={(newFiles) => setAttachedFiles(prev => [...prev, ...newFiles])}
                      onRemove={(index) => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                    />
                    <p className="text-[10px] text-zinc-400">PDF, JPG, PNG or DOC — Max 10MB each</p>
                  </div>

                  {/* Reason/Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <MessageSquare size={16} className="text-emerald-600" /> {t('booking.form.reason')}
                    </label>
                    <textarea 
                      rows={3}
                      placeholder={t('booking.form.reason_placeholder')}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50 resize-none"
                    />
                  </div>


                  {/* Progress Indicator */}
                  {uploadProgress && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                      <Loader2 size={14} className="animate-spin" />
                      {uploadProgress}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-4 flex gap-3 sticky bottom-0 bg-white pb-2 mt-auto">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="flex-1"
                      onClick={handleClose}
                    >
                      {t('booking.form.cancel')}
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-[2]"
                      isLoading={isSubmitting}
                    >
                      {t('booking.form.book')}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;

