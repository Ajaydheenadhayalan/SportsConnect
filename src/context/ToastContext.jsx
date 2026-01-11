import React, { createContext, useContext, useState, useEffect } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    // Auto-remove
    setTimeout(() => {
        removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`toast toast-${toast.type} slide-in`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="toast-content">
                {toast.type === 'sms' && <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💬</span>}
                <div>
                    {toast.type === 'sms' && <strong>New Message</strong>}
                    <p>{toast.message}</p>
                </div>
            </div>
            <button className="toast-close">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
