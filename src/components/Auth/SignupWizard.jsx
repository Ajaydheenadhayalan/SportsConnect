import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import OTPInput from './OTPInput';

const SignupWizard = ({ onSwitch }) => {
  const { requestOTP, verifyOTP, signup, checkUsername } = useAuth();
  const [step, setStep] = useState(0); // 0: Info, 1: OTP, 2: Password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form States
  const [info, setInfo] = useState({ fullName: '', username: '', email: '' });
  const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });

  // Validate & Request OTP
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (!info.fullName || !info.username || !info.email) {
        setError("All fields are required");
        setLoading(false);
        return;
    }

    try {
        await checkUsername(info.username);
        await requestOTP(info.email, info.fullName);
        setStep(1);
    } catch (err) {
        setError(err.message || "Failed to send OTP");
    } finally {
        setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (otpValue) => {
      setLoading(true);
      setError('');
      try {
          await verifyOTP(otpValue);
          setStep(2);
      } catch (err) {
          setError("Invalid OTP. Try 1234");
      } finally {
          setLoading(false);
      }
  };

  // Create Password & Signup
  const handleSignup = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      if (passwordData.password !== passwordData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
      }
      if (passwordData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
      }

      try {
          await signup({ ...info, password: passwordData.password });
          // AuthContext triggers state change, routing handles redirect
      } catch (err) {
          setError(err.message || "Signup failed");
          setLoading(false);
      }
  };

  return (
    <div className="auth-wizard">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            {step === 0 && "Create Account"}
            {step === 1 && "Verify Identity"}
            {step === 2 && "Secure Your Account"}
        </h2>

        {error && (
            <div style={{ 
                background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-error)', 
                padding: '0.75rem', borderRadius: 'var(--radius-md)',
                marginBottom: '1rem', textAlign: 'center'
            }}>
                {error}
            </div>
        )}

        {step === 0 && (
            <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                    type="text" placeholder="Full Name" value={info.fullName}
                    onChange={e => setInfo({...info, fullName: e.target.value})}
                    style={inputStyle} required 
                />
                <input 
                    type="text" placeholder="Username (unique)" value={info.username}
                    onChange={e => setInfo({...info, username: e.target.value})}
                    style={inputStyle} required 
                />
                <input 
                    type="email" placeholder="Email Address" value={info.email}
                    onChange={e => setInfo({...info, email: e.target.value})}
                    style={inputStyle} required 
                />
                <button type="submit" style={btnStyle} disabled={loading}>
                    {loading ? 'Sending OTP...' : 'Next'}
                </button>
            </form>
        )}

        {step === 1 && (
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    Enter the code sent to your <strong>Email</strong>
                </p>
                <OTPInput length={6} onComplete={handleVerifyOTP} />
                {loading && <p style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>Verifying...</p>}
                
                <button 
                    onClick={() => setStep(0)} 
                    style={{ marginTop: '2rem', color: 'var(--color-text-muted)', textDecoration: 'underline' }}
                >
                    Back to Info
                </button>
            </div>
        )}

        {step === 2 && (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                    type="password" placeholder="Create Password" value={passwordData.password}
                    onChange={e => setPasswordData({...passwordData, password: e.target.value})}
                    style={inputStyle} required 
                />
                <input 
                    type="password" placeholder="Confirm Password" value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    style={inputStyle} required 
                />
                <button type="submit" style={btnStyle} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Finish'}
                </button>
            </form>
        )}

      <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <span 
            onClick={onSwitch} 
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '500' }}
        >
            Login
        </span>
      </p>
    </div>
  );
};

const inputStyle = {
    width: '100%', 
    padding: '0.75rem', 
    borderRadius: 'var(--radius-md)', 
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    color: 'var(--color-text-main)'
};

const btnStyle = {
    marginTop: '0.5rem',
    padding: '0.85rem', 
    background: 'var(--color-primary)', 
    color: 'white', 
    fontWeight: '600',
    borderRadius: 'var(--radius-md)'
};

export default SignupWizard;
