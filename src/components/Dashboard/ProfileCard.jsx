import React from 'react';
import { User, MapPin, Clock, Trophy, Timer } from 'phosphor-react';

const ProfileCard = ({ user, onEdit }) => {
  return (
    <div style={{ 
        background: 'var(--color-surface)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        border: '1px solid var(--color-border)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ 
                    width: '5rem', height: '5rem', borderRadius: '50%', background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.5rem',
                    overflow: 'hidden' // Ensure image respects border radius
                }}>
                    {(user.avatar && user.avatar.startsWith('http')) ? (
                        <img 
                            src={user.avatar} 
                            alt={user.fullName} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        user.avatar || '👤'
                    )}
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{user.fullName}</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>@{user.username}</p>
                </div>
            </div>
            <button 
                onClick={onEdit}
                style={{ 
                    padding: '0.5rem 1rem', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-main)',
                    fontWeight: '500'
                }}
            >
                Edit Profile
            </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {/* Details */}
            <InfoItem icon={<User />} label="Age" value={user.age || 'Not set'} />
            <InfoItem icon={<MapPin />} label="Location" value={user.location || 'Not set'} />
            <InfoItem icon={<Trophy />} label="Sports" value={user.sports ? user.sports.join(', ') : 'None'} />
            <InfoItem icon={<Clock />} label="Availability" value={user.availability || 'Not set'} />
            <InfoItem icon={<Timer />} label="Time" value={user.availableTime || 'Not set'} />
        </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{ color: 'var(--color-primary)', marginTop: '0.2rem' }}>{icon}</div>
        <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem' }}>{label}</p>
            <p style={{ fontWeight: '500' }}>{value}</p>
        </div>
    </div>
);

export default ProfileCard;
