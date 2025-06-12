import React from 'react';
import FileManager from '../components/FileManager';

// Files page with Breadcrumbs and FileManager
const Files = () => {
  return (
    <div className="container py-4">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
          <li className="breadcrumb-item active" aria-current="page">Files</li>
        </ol>
      </nav>
      {/* FileManager component */}
      <FileManager />
    </div>
  );
};

export default Files; 