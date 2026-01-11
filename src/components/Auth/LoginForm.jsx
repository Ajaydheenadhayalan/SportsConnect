import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Auth.module.css'; // Shared styles

const LoginForm = ({ onSwitch }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
      
      {error && (
        <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--color-error)', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            textAlign: 'center'
        }}>
            {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Username or Email</label>
            <input 
                type="text" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-main)'
                }}
                required 
            />
        </div>
        
        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Password</label>
            <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg)',
                    color: 'var(--color-text-main)'
                }}
                required 
            />
        </div>

        <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
                marginTop: '0.5rem',
                padding: '0.85rem', 
                background: 'var(--color-primary)', 
                color: 'white', 
                fontWeight: '600',
                borderRadius: 'var(--radius-md)',
                opacity: isSubmitting ? 0.7 : 1
            }}
        >
            {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Don't have an account?{' '}
        <span 
            onClick={onSwitch} 
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}
        >
            Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
