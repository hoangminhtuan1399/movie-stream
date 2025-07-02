import React, { useState } from 'react';
import FileManager from './FileManager';

// Modal for selecting a file (image/video) from FileManager
const FileSelectModal = ({ show, onClose, onSelect, selectable = true, fileType = 'all', onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleSelectionChange = (files) => {
    setSelectedFiles(files);
  };

  const handleConfirmSelection = () => {
    onSelect?.(selectedFiles);
    onClose();
  };

  return (
    <div className={`modal fade modal-file-select${show ? ' show d-block' : ''}`} tabIndex="-1" style={{ background: show ? 'rgba(0,0,0,0.3)' : 'none', zIndex: 2000, display: show ? 'block' : 'none' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content" style={{ overflowY: 'auto' }}>
          <div className="modal-header">
            <h5 className="modal-title">Chọn file</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* FileManager component for file selection */}
            <FileManager 
              showUploadZone 
              onSelect={handleSelectionChange}
              selectable={selectable} 
              type={fileType}
              onUploadSuccess={onUploadSuccess}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button className="btn btn-primary" onClick={handleConfirmSelection} disabled={selectedFiles.length === 0}>Chọn</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSelectModal; 