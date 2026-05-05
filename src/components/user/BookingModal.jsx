import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import { appointmentService } from '../../services/appointmentService';
import { petService } from '../../services/petService';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, onBookingSuccess }) => {
  const [doctors, setDoctors] = useState([]);
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsBooking] = useState(false);
  
  const [formData, setFormData] = useState({
    doctor_id: '',
    pet_id: '',
    date: '',
    time: '',
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
      setDoctors(docsData);
      setPets(petsData);
      
      // Auto-select first pet if available
      if (petsData.length > 0) {
        setFormData(prev => ({ ...prev, pet_id: petsData[0].id }));
      }
    } catch (error) {
      console.error("Failed to load booking data:", error);
      toast.error("Failed to load required information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctor_id || !formData.pet_id || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsBooking(true);
      await appointmentService.createAppointment({
        doctor_id: formData.doctor_id,
        pet_id: formData.pet_id,
        date: `${formData.date}T${formData.time}:00`,
        notes: formData.notes,
        status: 'pending'
      });
      
      toast.success("Appointment booked successfully!");
      onBookingSuccess();
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-emerald-50/50 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Book Appointment</h2>
              <p className="text-sm text-zinc-500">Schedule a visit with our specialists</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-zinc-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
                <p className="text-zinc-500 font-medium">Loading details...</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                    <User size={16} className="text-emerald-600" /> Select Veterinarian *
                  </label>
                  <select 
                    required
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                    <span className="size-4 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white">P</span> Select Pet *
                  </label>
                  <select 
                    required
                    value={formData.pet_id}
                    onChange={(e) => setFormData({...formData, pet_id: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                  >
                    <option value="">Select your pet</option>
                    {pets.map(pet => (
                      <option key={pet.id} value={pet.id}>{pet.name} ({pet.type})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <Calendar size={16} className="text-emerald-600" /> Date *
                    </label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                      <Clock size={16} className="text-emerald-600" /> Time *
                    </label>
                    <input 
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                    <MessageSquare size={16} className="text-emerald-600" /> Notes
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Briefly describe the reason for visit..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none bg-zinc-50/50 resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-[2]"
                    isLoading={isSubmitting}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
