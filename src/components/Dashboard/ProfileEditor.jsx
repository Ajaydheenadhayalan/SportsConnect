import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Spinner, Globe } from 'phosphor-react';
import LocationPicker from './LocationPicker';

const SPORTS_LIST = ["Cricket", "Football", "Tennis", "Badminton", "Basketball", "Swimming", "Running"];
// Premium Avatars using DiceBear (Adventurer collection)
const AVATAR_SEEDS = ["Felix", "Aneka", "Zack", "Molly", "Garrett", "Dustin", "Lily", "Caleb"];

const ProfileEditor = ({ onCancel, initialData }) => {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    age: initialData.age || '',
    location: initialData.location || '',
    sports: initialData.sports || [],
    avatar: initialData.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=Felix`,
    availability: initialData.availability || 'Weekends',
    availableTime: initialData.availableTime || ''
  });
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
    onCancel(); // Close editor
  };

  const toggleSport = (sport) => {
    if (formData.sports.includes(sport)) {
        setFormData({ ...formData, sports: formData.sports.filter(s => s !== sport) });
    } else {
        setFormData({ ...formData, sports: [...formData.sports, sport] });
    }
  };

  const detectLocation = () => {
      setLocLoading(true);
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              
              try {
                  // Use OpenStreetMap Nominatim (Free, no key)
                  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
                  const data = await response.json();
                  
                  // Construct a more precise location string
                  const addr = data.address || {};
                  const street = addr.road || addr.pedestrian || addr.street;
                  const area = addr.suburb || addr.neighbourhood || addr.residential || addr.village;
                  const city = addr.city || addr.town || addr.county;
                  const state = addr.state;

                  // Format: "7th Cross St, Gandhipuram, Karur"
                  const parts = [];
                  if (street) parts.push(street);
                  if (area) parts.push(area);
                  if (city) parts.push(city);
                  if (!city && state) parts.push(state); // Fallback if no city

                  const formattedLoc = parts.length > 0 ? parts.join(', ') : `Lat: ${lat.toFixed(4)}, Long: ${lng.toFixed(4)}`;

                  setFormData(prev => ({ ...prev, location: formattedLoc }));
              } catch (error) {
                  console.error("Geocoding failed:", error);
                  setFormData(prev => ({ ...prev, location: `Lat: ${lat.toFixed(4)}, Long: ${lng.toFixed(4)}` }));
              } finally {
                  setLocLoading(false);
              }

          }, async (error) => {
              console.warn("Geolocation denied/failed. Trying IP fallback.", error);
              try {
                  const response = await fetch('https://ipapi.co/json/');
                  const data = await response.json();
                  if (data.city && data.region) {
                      setFormData(prev => ({ ...prev, location: `${data.city}, ${data.region}` }));
                  } else {
                      throw new Error("IP location failed");
                  }
              } catch (ipError) {
                  console.error(ipError);
                  alert("Could not detect location. Please enter manually.");
              } finally {
                  setLocLoading(false);
              }
          });
      } else {
          alert("Geolocation not supported by this browser.");
          setLocLoading(false);
      }
  };

  return (
    <div style={{ 
        background: 'var(--color-surface)', 
        borderRadius: 'var(--radius-lg)', 
        padding: '2rem',
        border: '1px solid var(--color-primary)', // Highlight edit mode
        boxShadow: 'var(--shadow-lg)'
    }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile</h3>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Avatar */}
        <div>
            <label style={labelStyle}>Choose Avatar</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {AVATAR_SEEDS.map(seed => {
                    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
                    const isSelected = formData.avatar === avatarUrl;
                    return (
                        <div
                            key={seed} 
                            onClick={() => setFormData({...formData, avatar: avatarUrl})}
                            style={{
                                cursor: 'pointer',
                                width: '60px', height: '60px',
                                borderRadius: '50%',
                                border: isSelected ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                                overflow: 'hidden',
                                transition: 'all 0.2s',
                                transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                            }}
                        >
                            <img src={avatarUrl} alt={seed} style={{ width: '100%', height: '100%' }} />
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Age & Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
                <label style={labelStyle}>Age</label>
                <input 
                    type="number" value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                    style={inputStyle} min="5" max="99"
                />
            </div>
            <div>
                <label style={labelStyle}>Location</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        type="text" value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                        style={{ ...inputStyle, flex: 1 }} placeholder="City, Area"
                    />

                    <button 
                         type="button" onClick={() => setShowMap(true)}
                         style={{ 
                             padding: '0.5rem', background: 'var(--color-bg)', 
                             border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                             color: 'var(--color-accent)'
                         }}
                         title="Pick on Map"
                    >
                        <Globe size={20} />
                    </button>
                </div>
            </div>
        </div>

        {/* Sports */}
        <div>
            <label style={labelStyle}>Sports of Interest</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {SPORTS_LIST.map(sport => (
                    <button
                        key={sport} type="button"
                        onClick={() => toggleSport(sport)}
                        style={{
                            padding: '0.4rem 0.8rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.9rem',
                            background: formData.sports.includes(sport) ? 'var(--color-primary)' : 'var(--color-bg)',
                            color: formData.sports.includes(sport) ? 'white' : 'var(--color-text-muted)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        {sport}
                    </button>
                ))}
            </div>
        </div>

        {/* Availability & Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
                <label style={labelStyle}>Availability</label>
                <select 
                    value={formData.availability}
                    onChange={e => setFormData({...formData, availability: e.target.value})}
                    style={inputStyle}
                >
                    <option value="Weekdays - Morning">Weekdays - Morning</option>
                    <option value="Weekdays - Evening">Weekdays - Evening</option>
                    <option value="Weekends - All Day">Weekends - All Day</option>
                    <option value="Flexible">Flexible</option>
                    <option value="Weekends - Morning">Weekends - Morning</option>
                    <option value="Weekends - Evening">Weekends - Evening</option>
                </select>
            </div>
            <div>
                <label style={labelStyle}>Preferred Time</label>
                <input 
                    type="text" 
                    value={formData.availableTime}
                    onChange={e => setFormData({...formData, availableTime: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g. 6 PM - 9 PM"
                />
            </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button 
                type="button" onClick={onCancel}
                style={{ color: 'var(--color-text-muted)', fontWeight: '500' }}
            >
                Cancel
            </button>
            <button 
                type="submit"
                disabled={loading}
                style={{ 
                    padding: '0.75rem 1.5rem', 
                    background: 'var(--color-primary)', 
                    color: 'white', 
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600'
                }}
            >
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </div>

      </form>

      {/* Map Modal */}
      {showMap && (
          <LocationPicker 
            onCancel={() => setShowMap(false)}
            onConfirm={(newLoc) => {
                setFormData({ ...formData, location: newLoc });
                setShowMap(false);
            }}
            initialLocationName={formData.location}
          />
      )}
    </div>
  );
};

const labelStyle = {
    display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem'
};
const inputStyle = {
    width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-md)', 
    border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text-main)'
};

export default ProfileEditor;
