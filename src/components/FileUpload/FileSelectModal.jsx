import React from 'react';
import FileManager from './FileManager';

// Modal for selecting a file (image/video) from FileManager
const FileSelectModal = ({ show, onClose, onSelect, onUpload }) => {
  const handleUpload = (file) => {
    onUpload && onUpload(file);
    onClose();
  };
  return (
    <div className={`modal fade modal-file-select${show ? ' show d-block' : ''}`} tabIndex="-1" style={show ? { background: 'rgba(0,0,0,0.3)', zIndex: 2000 } : { display: 'none' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content" style={{ overflowY: 'auto' }}>
          <div className="modal-header">
            <h5 className="modal-title">Chọn file</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* FileManager component for file selection */}
            <FileManager showUploadZone onUpload={handleUpload} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button className="btn btn-primary" onClick={() => { onSelect && onSelect(); onClose(); }}>Chọn</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSelectModal; 