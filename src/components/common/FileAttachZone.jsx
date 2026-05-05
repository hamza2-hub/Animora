import React, { useState, useRef } from 'react';
import { UploadCloud, Paperclip, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const FileAttachZone = ({ files, onAdd, onRemove }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f => {
      if (f.size > 10 * 1024 * 1024) { 
        toast.error(`${f.name} is too large (max 10 MB)`); 
        return false; 
      }
      return true;
    });
    onAdd(valid);
  };

  return (
    <div className="file-attach-zone">
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
      >
        <UploadCloud size={28} className="drop-icon" />
        <p className="drop-text">Click or drag files here</p>
        <p className="drop-subtext">Images, PDFs, X-rays — max 10 MB each</p>
        <input 
          ref={inputRef} 
          type="file" 
          multiple 
          accept="image/*,.pdf,.doc,.docx" 
          className="hidden-input" 
          onChange={e => handleFiles(e.target.files)} 
        />
      </div>

      {files.length > 0 && (
        <div className="attached-files-list">
          {files.map((f, i) => (
            <div key={i} className="attached-file-item">
              <Paperclip size={13} className="file-icon" />
              <span className="file-name">{f.name}</span>
              <span className="file-size">{(f.size / 1024).toFixed(0)} KB</span>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); onRemove(i); }} 
                className="remove-file-btn"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileAttachZone;
