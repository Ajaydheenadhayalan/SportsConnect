import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ setLocation, initialPos }) => {
    const [position, setPosition] = useState(initialPos || null);
    
    // Auto-locate on first load if no position
    useEffect(() => {
        if (!initialPos && "geolocation" in navigator) {
             navigator.geolocation.getCurrentPosition((pos) => {
                 setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
             });
        }
    }, [initialPos]);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            setLocation(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    // Fly to position if it changes programmatically
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position} icon={DefaultIcon}>
            <Popup>Selected Location</Popup>
        </Marker>
    );
};

const MapController = () => {
    const map = useMapEvents({});
    useEffect(() => {
        // Force map to acknowledge its container size
        // This fixes the "grey/blank" map issue when opening in a modal
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    }, [map]);
    return null;
};

const LocateButton = ({ setLocation }) => {
    const map = useMapEvents({});
    const [loading, setLoading] = useState(false);

    const handleLocate = (e) => {
        e.stopPropagation(); // Prevent map click
        setLoading(true);
        map.locate().on("locationfound", function (e) {
            setLocation(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
            setLoading(false);
        }).on("locationerror", function (e) {
            console.error(e);
            alert("Could not access location");
            setLoading(false);
        });
    };

    return (
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
             <button 
                onClick={handleLocate}
                title="Use My Location"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem',
                    color: 'var(--color-primary)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
             >
                {loading ? '...' : '📍'}
             </button>
        </div>
    );
};

const LocationPicker = ({ onConfirm, onCancel, initialLocationName }) => {
    const [coords, setCoords] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    // Initial Coords (Default to user's approx location or Delhi)
    const defaultCenter = { lat: 28.6139, lng: 77.2090 }; 

    const handleConfirm = async () => {
        if (!coords) {
            onConfirm(initialLocationName); // No change
            return;
        }

        setLoading(true);
        try {
            // Reverse Geocode
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
            const data = await response.json();
            
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.county;
            const state = addr.state;
            const sub = addr.suburb || addr.neighbourhood;
            
            const formatted = [sub, city, state].filter(Boolean).join(', ');
            onConfirm(formatted || `Lat: ${coords.lat.toFixed(2)}, Lng: ${coords.lng.toFixed(2)}`);

        } catch (error) {
            console.error("Geocoding failed", error);
            onConfirm(`Lat: ${coords.lat.toFixed(2)}, Lng: ${coords.lng.toFixed(2)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.8)', zIndex: 10000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{ 
                width: '90%', maxWidth: '800px', height: '80vh', 
                background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                    <h3>Pick Location</h3>
                    <button onClick={onCancel} style={{ fontSize: '1.5rem' }}>×</button>
                </div>
                
                {/* IMPORTANT: Explicit height container for Leaflet */}
                <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '0' }}>
                    <MapContainer 
                        center={defaultCenter} 
                        zoom={13} 
                        style={{ height: '100%', width: '100%' }}
                    >
                        <MapController />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker setLocation={setCoords} />
                        <LocateButton setLocation={setCoords} />
                    </MapContainer>
                    
                    <div style={{ 
                        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
                        zIndex: 1000, background: 'var(--color-surface)', 
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text-main)', fontSize: '0.9rem',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        {coords ? 'Tap button to confirm selection' : 'Tap on map to select'}
                    </div>
                </div>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onCancel} style={{ color: 'var(--color-text-muted)' }}>Cancel</button>
                    <button 
                        onClick={handleConfirm}
                        disabled={loading || !coords}
                        style={{ 
                            padding: '0.6rem 1.2rem', background: 'var(--color-primary)', 
                            color: 'white', borderRadius: 'var(--radius-md)', fontWeight: '600',
                            opacity: (loading || !coords) ? 0.5 : 1
                        }}
                    >
                        {loading ? 'Getting Address...' : 'Confirm Location'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPicker;
