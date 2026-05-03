import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment, onUpdate }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (appointment) {
      setDiagnosis(appointment.diagnosis || '');
      setTreatmentDetails(appointment.treatment_details || '');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('appointments')
        .update({
          status: newStatus,
          diagnosis: diagnosis,
          treatment_details: treatmentDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id);

      if (error) throw error;
      
      toast.success(`Appointment marked as ${newStatus.replace('_', ' ')}`);
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('appointments')
        .update({
          diagnosis: diagnosis,
          treatment_details: treatmentDetails,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id);

      if (error) throw error;
      toast.success('Medical notes saved');
      onUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save medical notes');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up relative">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-semibold">Treatment Details</h2>
            <p className="text-sm text-gray-500">
              {new Date(appointment.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{appointment.pets?.name || 'Unknown Pet'}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {appointment.pets?.type} • {appointment.pets?.breed || 'Mixed'} • {appointment.pets?.age ? `${appointment.pets.age} yrs` : 'Unknown age'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Owner: {appointment.owner?.full_name || 'Unknown'}
              </p>
            </div>
            <div>
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Initial Notes */}
          {appointment.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-1 text-gray-700">Reason for Visit</h4>
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}

          {/* Medical Section */}
          <div className="space-y-4">
            <h3 className="text-md font-semibold border-b pb-2">Medical Section</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={3}
                placeholder="Enter diagnosis details..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Details</label>
              <textarea
                value={treatmentDetails}
                onChange={(e) => setTreatmentDetails(e.target.value)}
                rows={4}
                placeholder="Describe the treatment plan or procedures..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none transition-all"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="small" 
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <Save size={16} /> Save Notes
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex flex-wrap gap-3 justify-end rounded-b-xl">
          {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isUpdating}
              style={{ color: '#B91C1C', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' }}
            >
              Cancel Appointment
            </Button>
          )}

          {appointment.status !== 'in_progress' && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
            <Button 
              onClick={() => handleStatusUpdate('in_progress')}
              disabled={isUpdating}
              style={{ backgroundColor: '#D97706', borderColor: '#D97706' }}
            >
              Start Treatment
            </Button>
          )}

          {appointment.status === 'in_progress' && (
            <Button 
              onClick={() => handleStatusUpdate('completed')}
              disabled={isUpdating}
              style={{ backgroundColor: '#059669', borderColor: '#059669' }}
            >
              Mark as Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
