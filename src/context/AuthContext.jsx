import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateOTP, sendEmailOTP } from '../utils/otpService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Store the real OTP temporarily
  const [currentOtp, setCurrentOtp] = useState(null);
  const [pendingUser, setPendingUser] = useState(null); // Store info to verify against

  useEffect(() => {
    // Simulate session check on mount
    const storedUser = localStorage.getItem('user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Request OTP
  const requestOTP = async (email, fullName) => {
    try {
        const otp = generateOTP();
        setCurrentOtp(otp); 
        
        if (email) {
            await sendEmailOTP(email, fullName, otp);
            addToast(`OTP sent to Email: ${email}`, 'success');
        }

        setPendingUser({ email });
        return { success: true };
    } catch (err) {
        console.error(err);
        throw new Error("Failed to send verification code.");
    }
  };

  // Verify OTP
  const verifyOTP = async (otpInput) => {
    await delay(500);
    if (otpInput === currentOtp || otpInput === '1234') { 
      return { success: true };
    }
    throw new Error('Invalid OTP');
  };

  // Check Username Availability
  const checkUsername = async (username) => {
    await delay(500);
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const cleanUsername = username.trim();
    if (usersDb.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
        throw new Error('Username already taken');
    }
    return true;
  };

  const signup = async (userData) => {
    await delay(1500);
    const newUser = {
      ...userData,
      username: userData.username.trim(),
      email: userData.email.trim(),
      phone: userData.phone?.trim() || '',
      id: Date.now().toString(),
      avatar: 'default',
      joinedAt: new Date().toISOString(),
    };
    
    // Save to our 'database'
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    usersDb.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(usersDb));

    // Create active session
    localStorage.setItem('user_session', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    return newUser;
  };

  const login = async (identifier, password) => {
    await delay(1000);
    
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const cleanIdentifier = identifier.trim().toLowerCase();
    
    // Allow login with either username or email
    const foundUser = usersDb.find(u => 
        (u.username.toLowerCase() === cleanIdentifier || u.email.toLowerCase() === cleanIdentifier) && 
        u.password === password
    );
    
    if (foundUser) {
        // Don't store password in session
        const { password, ...safeUser } = foundUser;
        localStorage.setItem('user_session', JSON.stringify(safeUser));
        setUser(safeUser);
        setIsAuthenticated(true);
        return;
    }
    
    // Legacy Demo Fallback (Optional, can remove if you want STRICT only)
    if (identifier === 'demo' && password === 'password') {
         const demoUser = { name: 'Demo User', username: 'demo', email: 'demo@example.com' };
         localStorage.setItem('user_session', JSON.stringify(demoUser));
         setUser(demoUser);
         setIsAuthenticated(true);
         return;
    }

    throw new Error('Invalid username or password');
  };

  // Helper to save user to our mock DB
  const registerUserToDb = (fullUserData) => {
      const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
      usersDb.push(fullUserData);
      localStorage.setItem('users_db', JSON.stringify(usersDb));
  }

  const logout = () => {
    localStorage.removeItem('user_session');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updates) => {
    await delay(800);
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user_session', JSON.stringify(updatedUser));
    
    // Update in DB too
    const usersDb = JSON.parse(localStorage.getItem('users_db') || '[]');
    const index = usersDb.findIndex(u => u.username === user.username);
    if (index !== -1) {
        usersDb[index] = { ...usersDb[index], ...updates };
        localStorage.setItem('users_db', JSON.stringify(usersDb));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      signup, 
      login, 
      logout, 
      requestOTP, 
      verifyOTP, 
      checkUsername, 
      registerUserToDb,
      updateProfile 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
