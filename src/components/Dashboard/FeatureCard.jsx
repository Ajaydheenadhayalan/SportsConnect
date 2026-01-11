import React from 'react';

const FeatureCard = ({ title, icon }) => {
  return (
    <div style={{ 
        background: 'var(--color-surface)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '1.5rem',
        border: '1px solid var(--color-border)',
        opacity: 0.6,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '1rem', height: '180px'
    }}>
        <div style={{ fontSize: '2.5rem', color: 'var(--color-text-muted)' }}>{icon}</div>
        <h3 style={{ color: 'var(--color-text-muted)' }}>{title}</h3>
        <span style={{ 
            fontSize: '0.75rem', padding: '0.2rem 0.5rem', 
            background: 'var(--color-bg)', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)' 
        }}>
            Coming Soon
        </span>
    </div>
  );
};

export default FeatureCard;
