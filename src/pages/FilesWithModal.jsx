import React, { useRef, useState } from 'react';
import FileManager from '../components/FileUpload/FileManager';
import FileSelectModal from '../components/FileUpload/FileSelectModal';
import { FaHome } from 'react-icons/fa';

// Page with FileManager and file select modal
const FilesWithModal = () => {
  const [showModal, setShowModal] = useState(false);
  const refFileManager = useRef(null);

  // Handle file select from modal
  const handleSelect = () => {
    // You can get selected file here
    alert('File selected!');
    setShowModal(false);
  };

  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/admin"><FaHome className="me-1"/></a></li>
          <li className="breadcrumb-item active" aria-current="page"> Files</li>
        </ol>
      </nav>
      {/* Button to open modal */}
      <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>
        Chọn file
      </button>
      {/* FileManager component */}
      <FileManager ref={refFileManager} />
      {/* File select modal */}
      <FileSelectModal show={showModal} onClose={() => setShowModal(false)} onSelect={handleSelect} onUploadSuccess={() => {
        setShowModal(false);
        refFileManager.current.refreshFiles();
      }} />
    </div>
  );
};

export default FilesWithModal; 