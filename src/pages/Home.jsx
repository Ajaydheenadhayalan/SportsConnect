import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProfileCard from '../components/Dashboard/ProfileCard';
import ProfileEditor from '../components/Dashboard/ProfileEditor';
import FeatureCard from '../components/Dashboard/FeatureCard';
import { Trophy, CalendarCheck, Users } from 'phosphor-react';

const Home = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(!user.age && !user.location); // Auto-edit if profile incomplete

  return (
    <DashboardLayout>
        {/* Profile Section */}
        <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ marginBottom: '1rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                Your Player Profile
            </h2>
            {isEditing ? (
                <ProfileEditor 
                    initialData={user} 
                    onCancel={() => setIsEditing(false)} 
                />
            ) : (
                <ProfileCard 
                    user={user} 
                    onEdit={() => setIsEditing(true)} 
                />
            )}
        </section>

        {/* Dashboard Placeholder Section */}
        <section>
            <h2 style={{ marginBottom: '1rem', fontWeight: '500', color: 'var(--color-text-muted)' }}>
                Discover
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <FeatureCard title="Matches Near You" icon={<Trophy />} />
                <FeatureCard title="My Bookings" icon={<CalendarCheck />} />
                <FeatureCard title="Find Teams" icon={<Users />} />
            </div>
        </section>
    </DashboardLayout>
  );
};

export default Home;
