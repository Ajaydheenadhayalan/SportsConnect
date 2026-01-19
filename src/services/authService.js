import api from './api';
import Cookies from 'js-cookie';

// Cookie options - 7 days expiry
const cookieOptions = {
    expires: 7,
    sameSite: 'strict',
    secure: window.location.protocol === 'https:'
};

/**
 * Request OTP for email verification
 */
export const requestOTP = async (email, fullName) => {
    const response = await api.post('/auth/request-otp', { email, fullName });
    return response;
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (email, otp) => {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response;
};

/**
 * Check if username is available
 */
export const checkUsername = async (username) => {
    const response = await api.post('/auth/check-username', { username });
    return response;
};

/**
 * Complete user signup
 */
export const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);

    // Store token and user data in both cookies and localStorage
    if (response.success && response.token) {
        Cookies.set('auth_token', response.token, cookieOptions);
        Cookies.set('user_session', JSON.stringify(response.user), cookieOptions);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_session', JSON.stringify(response.user));
    }

    return response;
};

/**
 * User login
 */
export const login = async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });

    // Store token and user data in both cookies and localStorage
    if (response.success && response.token) {
        Cookies.set('auth_token', response.token, cookieOptions);
        Cookies.set('user_session', JSON.stringify(response.user), cookieOptions);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_session', JSON.stringify(response.user));
    }

    return response;
};

/**
 * User logout
 */
export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout API error:', error);
    } finally {
        // Clear both cookies and localStorage
        Cookies.remove('auth_token');
        Cookies.remove('user_session');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_session');
    }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    const response = await api.get('/auth/me');
    return response.user;
};

/**
 * Update user profile
 */
export const updateProfile = async (updates) => {
    const response = await api.put('/users/profile', updates);

    // Update both cookies and localStorage
    if (response.success && response.user) {
        Cookies.set('user_session', JSON.stringify(response.user), cookieOptions);
        localStorage.setItem('user_session', JSON.stringify(response.user));
    }

    return response;
};

/**
 * Get token from cookies or localStorage
 */
export const getToken = () => {
    return Cookies.get('auth_token') || localStorage.getItem('auth_token');
};

/**
 * Get user from cookies or localStorage
 */
export const getUser = () => {
    const userCookie = Cookies.get('user_session');
    const userLocal = localStorage.getItem('user_session');

    try {
        return userCookie ? JSON.parse(userCookie) : (userLocal ? JSON.parse(userLocal) : null);
    } catch (error) {
        return null;
    }
};
