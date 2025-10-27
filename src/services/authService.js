import api from './api';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.isCorsError) {
        throw { message: 'Connection error: Please contact support. The backend needs CORS configuration.' };
      }
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Logout user
  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  }
};