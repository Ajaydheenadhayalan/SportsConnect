import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
      return (
        <div style={{ 
            height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            background: 'var(--color-bg)', color: 'var(--color-text-muted)' 
        }}>
            Loading...
        </div>
      );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
