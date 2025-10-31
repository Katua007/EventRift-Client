import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30 seconds for slow connections
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    
    // Enhanced CORS and network error handling
    if (error.code === 'ERR_NETWORK' || 
        error.message.includes('CORS') || 
        error.code === 'ECONNABORTED' ||
        error.name === 'TypeError') {
      console.error('Network Error: Backend connection issue or CORS restriction');
      error.isCorsError = true;
      error.isNetworkError = true;
    }
    
    return Promise.reject(error);
  }
);

export default api;