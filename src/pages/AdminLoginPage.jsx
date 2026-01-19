import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/adminService';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.iconContainer}>
              <svg style={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 style={styles.title}>Admin Portal</h1>
            <p style={styles.subtitle}>Secure administrative access</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
              <div style={styles.error}>
                <svg style={styles.errorIcon} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Username</label>
              <input
                type="text"
                style={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                autoFocus
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Admin Password</label>
              <input
                type="password"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Login to Admin Portal'}
            </button>

            <div style={styles.footer}>
              <a href="/auth" style={styles.link}>
                ← Back to User Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f1115 0%, #1a1d24 50%, #0f1115 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  container: {
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 1
  },
  card: {
    background: 'rgba(24, 27, 33, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    animation: 'slideUp 0.5s ease-out'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
    border: '2px solid rgba(99, 102, 241, 0.3)'
  },
  icon: {
    width: '40px',
    height: '40px',
    color: 'white'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f3f4f6',
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #6366f1 0%, #f472b6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  error: {
    padding: '12px 16px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    color: '#ef4444',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  errorIcon: {
    width: '16px',
    height: '16px',
    flexShrink: 0
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#9ca3af',
    marginLeft: '4px'
  },
  input: {
    padding: '14px 16px',
    background: 'rgba(15, 17, 21, 0.5)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '12px',
    fontSize: '15px',
    color: '#f3f4f6',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  submitButton: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '8px'
  },
  link: {
    color: '#6366f1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  }
};

export default AdminLoginPage;
