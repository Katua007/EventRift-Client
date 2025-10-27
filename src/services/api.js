import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eventrift-server.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
    
    // Handle CORS errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      console.error('CORS Error: Backend needs to allow requests from this domain');
      error.isCorsError = true;
    }
    
    return Promise.reject(error);
  }
);

export default api;