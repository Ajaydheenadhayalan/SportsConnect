import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Store pending user info during signup flow
  const [pendingUser, setPendingUser] = useState(null);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_session');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid or expired
          console.error('Session validation failed:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_session');
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Request OTP
  const requestOTP = async (email, fullName) => {
    try {
      const response = await authService.requestOTP(email, fullName);
      
      // Store pending user info
      setPendingUser({ email, fullName });
      
      addToast(`OTP sent to ${email}`, 'success');
      
      // Show dev OTP if available
      if (response.devOTP) {
        console.log(`🔐 DEV OTP: ${response.devOTP}`);
        addToast(`DEV MODE - OTP: ${response.devOTP}`, 'info');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Request OTP error:', error);
      throw new Error(error.message || 'Failed to send verification code');
    }
  };

  // Verify OTP
  const verifyOTP = async (otpInput) => {
    try {
      await delay(300); // Small delay for UX
      
      if (!pendingUser) {
        throw new Error('No pending verification');
      }
      
      await authService.verifyOTP(pendingUser.email, otpInput);
      return { success: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error(error.message || 'Invalid OTP');
    }
  };

  // Check Username Availability
  const checkUsername = async (username) => {
    try {
      await delay(300);
      await authService.checkUsername(username);
      return true;
    } catch (error) {
      console.error('Check username error:', error);
      throw new Error(error.message || 'Username check failed');
    }
  };

  // Signup
  const signup = async (userData) => {
    try {
      await delay(500);
      
      const response = await authService.signup(userData);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setPendingUser(null);
        
        addToast('Account created successfully!', 'success');
        return response.user;
      }
      
      throw new Error('Signup failed');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  // Login
  const login = async (identifier, password) => {
    try {
      await delay(500);
      
      const response = await authService.login(identifier, password);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        addToast('Login successful!', 'success');
        return;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid username or password');
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setPendingUser(null);
      addToast('Logged out successfully', 'info');
    }
  };

  // Update Profile
  const updateProfile = async (updates) => {
    try {
      await delay(500);
      
      const response = await authService.updateProfile(updates);
      
      if (response.success && response.user) {
        setUser(response.user);
        addToast('Profile updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
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
      updateProfile 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
