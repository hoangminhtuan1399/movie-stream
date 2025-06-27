import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <Spinner animation="border" variant="warning" style={{ width: 64, height: 64 }} />
  </div>
);

export default LoadingOverlay; 