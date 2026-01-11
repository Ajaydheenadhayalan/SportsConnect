import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { SignOut } from 'phosphor-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text-main)' }}>
      {/* Header */}
      <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 2rem', 
          background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)'
       }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              SportsConnect
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontWeight: '500' }}>Welcome, {user?.fullName || user?.username}</span>
              <button 
                onClick={logout}
                style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    color: 'var(--color-text-muted)', fontSize: '0.9rem',
                    padding: '0.5rem', borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                  <SignOut size={20} />
                  Logout
              </button>
          </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
