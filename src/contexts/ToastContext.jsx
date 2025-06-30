import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  // Hiển thị toast mới
  const showToast = useCallback((message, type = 'danger') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);
  // Đóng toast
  const handleClose = (id) => {
    setToasts((prev) => prev.filter(t => t.id !== id));
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-center" className="p-3" style={{ zIndex: 9999 }}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            onClose={() => handleClose(toast.id)}
            show={true}
            bg={toast.type}
            delay={3500}
            autohide
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}; 