import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// We will implement these next
import LoginForm from '../components/Auth/LoginForm';
import SignupWizard from '../components/Auth/SignupWizard';

const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleAuthMode = () => setIsLogin(!isLogin);

  return (
    <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--color-bg)'
    }}>
      <div style={{ 
          width: '100%', 
          maxWidth: '480px', 
          padding: '2rem',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            SportsConnect
        </h1>
        
        {isLogin ? (
            <LoginForm onSwitch={toggleAuthMode} />
        ) : (
            <SignupWizard onSwitch={toggleAuthMode} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
