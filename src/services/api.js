import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add JWT token to requests
api.interceptors.request.use(
    (config) => {
        // Try to get token from cookies first, then localStorage
        const token = Cookies.get('auth_token') || Cookies.get('admin_token') ||
            localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                Cookies.remove('auth_token');
                Cookies.remove('admin_token');
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_session');
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_session');

                // Only redirect if not already on auth page
                if (!window.location.pathname.includes('/auth') && !window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/auth';
                }
            }

            // Return error message from server
            return Promise.reject(new Error(data.message || 'An error occurred'));
        } else if (error.request) {
            // Request made but no response received
            return Promise.reject(new Error('No response from server. Please check your connection.'));
        } else {
            // Something else happened
            return Promise.reject(new Error(error.message || 'An error occurred'));
        }
    }
);

export default api;
