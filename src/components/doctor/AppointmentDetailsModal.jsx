import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Download, File as FileIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import FileUpload from '../ui/FileUpload';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AppointmentDetailsModal = ({ isOpen, onClose, appointment, onUpdate, isOwner = false }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentDetails, setTreatmentDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (appointment) {
      setDiagnosis(appointment.diagnosis || '');
      setTreatmentDetails(appointment.treatment_details || '');
      setFiles(appointment.files || []);
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

  const handleUploadComplete = async (newFileInfo) => {
    try {
      const updatedFiles = [...files, newFileInfo];
      
      const { error } = await supabase
        .from('appointments')
        .update({
          files: updatedFiles,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment.id);

      if (error) throw error;
      
      setFiles(updatedFiles);
      onUpdate(); // Refresh parent state if needed
    } catch (error) {
      console.error('Error saving file reference:', error);
      toast.error('Failed to attach file to appointment');
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes('image')) return <ImageIcon size={20} className="text-blue-500" />;
    return <FileText size={20} className="text-red-500" />;
  };

  return (
    <div className="modal-wrapper">
      <div className="details-modal-bg" onClick={onClose}></div>
      <div className="details-modal-container">
        
        {/* Modal Header */}
        <div className="details-header">
          <div className="details-title-area">
            <h2>{appointment.pets?.name || 'Patient Details'}</h2>
            <div className="details-subtitle">
              <span>{new Date(appointment.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span className="dot-separator"></span>
              <span>Owner: <span style={{fontWeight: 500, color: '#334155'}}>{appointment.owner?.full_name || 'Unknown'}</span></span>
            </div>
          </div>
          <div className="details-header-actions">
            <StatusBadge status={appointment.status} />
            <button onClick={onClose} className="details-close-btn">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="details-body">
          
          {/* Pet Info Card */}
          <div className="details-card">
            <div className="details-card-header">
              <FileIcon size={16} /> Patient Information
            </div>
            <div className="details-grid-3">
              <div>
                <p className="details-label">Species/Type</p>
                <p className="details-value">{appointment.pets?.type || '—'}</p>
              </div>
              <div>
                <p className="details-label">Breed</p>
                <p className="details-value">{appointment.pets?.breed || 'Mixed'}</p>
              </div>
              <div>
                <p className="details-label">Age</p>
                <p className="details-value">{appointment.pets?.age ? `${appointment.pets.age} Years` : 'Unknown'}</p>
              </div>
            </div>
            
            {appointment.notes && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <p className="details-label">Reason for Visit</p>
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', color: '#1e293b' }}>
                  {appointment.notes}
                </div>
              </div>
            )}
          </div>

          {/* Medical Section */}
          <div className="details-card">
            <div className="details-card-header">
              <FileText size={16} /> Medical Notes
            </div>
            
            <div className="details-textarea-group">
              <label>Clinical Diagnosis</label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                readOnly={isOwner}
                rows={2}
                placeholder={isOwner ? "No diagnosis provided yet." : "Enter formal diagnosis..."}
                className="details-textarea"
              />
            </div>

            <div className="details-textarea-group">
              <label>Treatment Plan & Details</label>
              <textarea
                value={treatmentDetails}
                onChange={(e) => setTreatmentDetails(e.target.value)}
                readOnly={isOwner}
                rows={4}
                placeholder={isOwner ? "No treatment details provided yet." : "Detail the prescribed treatment, medications, and next steps..."}
                className="details-textarea"
              />
            </div>
            
            {!isOwner && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button 
                  variant="outline" 
                  size="small" 
                  onClick={handleSaveNotes}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className="details-card">
            <div className="details-card-header">
              <Download size={16} /> Attachments & Reports
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!isOwner && <FileUpload appointmentId={appointment.id} onUploadComplete={handleUploadComplete} />}

              {files.length > 0 ? (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.75rem' }}>Uploaded Files</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {files.map((file, idx) => (
                      <div key={idx} className="file-item">
                        <div className="file-item-info">
                          <div className="file-item-icon">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="file-item-text">
                            <p className="file-item-name" title={file.name}>{file.name}</p>
                            <p className="file-item-date">
                              {new Date(file.uploaded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-item-download"
                          title="Download/View"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                isOwner && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No attachments provided yet.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        {!isOwner && (
          <div className="details-footer">
            {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
              <Button 
                variant="outline" 
                onClick={() => handleStatusUpdate('cancelled')}
                disabled={isUpdating}
                style={{ color: '#B91C1C', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', marginRight: 'auto' }}
              >
                Cancel Appointment
              </Button>
            )}

            {appointment.status !== 'in_progress' && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
              <Button 
                onClick={() => handleStatusUpdate('in_progress')}
                disabled={isUpdating}
                style={{ backgroundColor: '#eab308', borderColor: '#eab308', color: 'white' }}
              >
                {isUpdating ? 'Starting...' : 'Start Treatment'}
              </Button>
            )}

            {appointment.status === 'in_progress' && (
              <Button 
                onClick={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', color: 'white' }}
              >
                {isUpdating ? 'Completing...' : 'Mark as Completed'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
