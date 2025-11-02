import api from './api.js';
// Real auth service that communicates with backend API

export const authService = {
  login: async (credentials) => {
    console.log('🔐 Frontend AuthService: Login attempt with credentials:', { email_or_username: credentials.email_or_username, password: '***' });

    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log('🔐 Frontend AuthService: Login API response:', response.data);

      if (response.data.success) {
        const { access_token, user } = response.data;

        // Store token and user data
        localStorage.setItem('jwt_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));

        console.log('🔐 Frontend AuthService: Login successful for user:', user.email);
        return { token: access_token, user };
      } else {
        console.log('🔐 Frontend AuthService: Login failed -', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('🔐 Frontend AuthService: Login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  register: async (userData) => {
    console.log('🔐 Frontend AuthService: Register attempt with data:', { username: userData.username, email: userData.email, role: userData.role, password: '***' });

    try {
      const response = await api.post('/api/auth/register', userData);
      console.log('🔐 Frontend AuthService: Register API response:', response.data);

      if (response.data.success) {
        console.log('🔐 Frontend AuthService: Register successful for user:', userData.username);
        return {
          message: response.data.message || 'Registration successful!',
          success: true
        };
      } else {
        console.log('🔐 Frontend AuthService: Register failed -', response.data.message);
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('🔐 Frontend AuthService: Register error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('🔐 Frontend AuthService: Logout attempt');
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('🔐 Frontend AuthService: Logout API error:', error);
      // Continue with local cleanup even if API call fails
    }

    // Clear session regardless of API response
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    console.log('🔐 Frontend AuthService: Local session cleared');
    return { success: true };
  },

  getProfile: async () => {
    try {
      console.log('🔐 Frontend AuthService: Get profile attempt');
      const response = await api.get('/api/auth/profile');
      console.log('🔐 Frontend AuthService: Profile API response:', response.data);

      if (response.data.success) {
        return { user: response.data.user };
      } else {
        throw new Error(response.data.message || 'Failed to get profile');
      }
    } catch (error) {
      console.error('🔐 Frontend AuthService: Get profile error:', error);
      // Fallback to cached data if API fails
      const userData = localStorage.getItem('user_data');
      if (userData) {
        console.log('🔐 Frontend AuthService: Using cached user data');
        return { user: JSON.parse(userData) };
      }
      throw error;
    }
  },

  // Helper method to clear local session data (for testing)
  clearLocalSession: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }
};