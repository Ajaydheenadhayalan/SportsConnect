import api from './api';
import Cookies from 'js-cookie';

// Cookie options - 7 days expiry
const cookieOptions = {
    expires: 7,
    sameSite: 'strict',
    secure: window.location.protocol === 'https:'
};

/**
 * Admin login
 */
export const adminLogin = async (username, password) => {
    const response = await api.post('/admin/login', { username, password });

    // Store admin token in both cookies and localStorage
    if (response.success && response.token) {
        Cookies.set('admin_token', response.token, cookieOptions);
        Cookies.set('admin_session', JSON.stringify(response.admin), cookieOptions);
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_session', JSON.stringify(response.admin));
    }

    return response;
};

/**
 * Get dashboard statistics
 */
export const getStats = async () => {
    const response = await api.get('/admin/stats');
    return response.stats;
};

/**
 * Get all users with filters
 */
export const getUsers = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/users?${queryString}`);
    return response;
};

/**
 * Get user details by ID
 */
export const getUserDetails = async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.user;
};

/**
 * Update user
 */
export const updateUser = async (userId, updates) => {
    const response = await api.put(`/admin/users/${userId}`, updates);
    return response;
};

/**
 * Delete user
 */
export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response;
};

/**
 * Export users
 */
export const exportUsers = async (format = 'json') => {
    const token = getAdminToken();
    const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/admin/export?format=${format}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );

    if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.csv';
        a.click();
    } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.json';
        a.click();
    }
};

/**
 * Admin logout
 */
export const adminLogout = () => {
    Cookies.remove('admin_token');
    Cookies.remove('admin_session');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_session');
};

/**
 * Get admin token from cookies or localStorage
 */
export const getAdminToken = () => {
    return Cookies.get('admin_token') || localStorage.getItem('admin_token');
};

/**
 * Get admin session from cookies or localStorage
 */
export const getAdminSession = () => {
    const adminCookie = Cookies.get('admin_session');
    const adminLocal = localStorage.getItem('admin_session');

    try {
        return adminCookie ? JSON.parse(adminCookie) : (adminLocal ? JSON.parse(adminLocal) : null);
    } catch (error) {
        return null;
    }
};
