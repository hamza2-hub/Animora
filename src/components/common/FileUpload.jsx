import React, { useState, useRef } from 'react';
import { UploadCloud, File, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const FileUpload = ({ appointmentId, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed.');
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be under 10MB.');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `appointments/${appointmentId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('medical-files')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('medical-files')
        .getPublicUrl(filePath);

      const fileInfo = {
        name: file.name,
        url: publicUrl,
        type: file.type,
        path: filePath,
        uploaded_at: new Date().toISOString()
      };

      toast.success('File uploaded successfully!');
      if (onUploadComplete) onUploadComplete(fileInfo);
      
    } catch (error) {
      console.error('Upload Error:', error);
      toast.error('Failed to upload file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,image/jpeg,image/png"
          style={{ display: 'none' }}
        />

        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--primary)' }}>
            <Loader2 size={40} className="animate-spin" style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 500, fontSize: '0.875rem' }}>Uploading file...</p>
          </div>
        ) : (
          <>
            <div className="file-upload-icon-wrapper">
              <UploadCloud size={32} />
            </div>
            <p className="file-upload-text">
              Drag & drop a file here, or{' '}
              <span className="file-upload-browse">browse</span>
            </p>
            <p className="file-upload-subtext">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
