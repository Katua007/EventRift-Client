// This file handles all authentication-related tasks like login, logout, and user profile
// It communicates with the backend server to manage user sessions

// Import our configured API instance
import api from './api.js';

// Object containing all authentication functions
export const authService = {
  // Function to log a user in by sending credentials to the server
  login: async (credentials) => {
    // Log what we're trying to do (hiding password for security)
    console.log('Frontend AuthService: Login attempt with credentials:', { email_or_username: credentials.email_or_username, password: '***' });
    console.log('Frontend AuthService: Login request URL:', api.defaults.baseURL + '/api/auth/login');

    try {
      // Send login request to the server
      const response = await api.post('/api/auth/login', credentials);
      console.log('Frontend AuthService: Login API response:', response.data);

      // Check if the server says login was successful
      if (response.data.success) {
        // Extract the token and user data from the response
        const { access_token, user } = response.data;

        // Save the authentication data in browser storage
        localStorage.setItem('jwt_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));

        // Log success and return the data
        console.log('Frontend AuthService: Login successful for user:', user.email);
        return { token: access_token, user };
      } else {
        // If server says login failed, throw an error
        console.log('Frontend AuthService: Login failed -', response.data.message);
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Frontend AuthService: Login error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error; // Re-throw the error for the calling code to handle
    }
  },

  // Function to register a new user account
  register: async (userData) => {
    // Log the registration attempt (hiding password)
    console.log('Frontend AuthService: Register attempt with data:', { username: userData.username, email: userData.email, role: userData.role, password: '***' });
    console.log('Frontend AuthService: Register request URL:', api.defaults.baseURL + '/api/auth/register');

    try {
      // Send registration request to the server
      const response = await api.post('/api/auth/register', userData);
      console.log('Frontend AuthService: Register API response:', response.data);

      // Check if registration was successful
      if (response.data.success) {
        // Log success and return success message
        console.log('Frontend AuthService: Register successful for user:', userData.username);
        return {
          message: response.data.message || 'Registration successful!',
          success: true
        };
      } else {
        // If server says registration failed, throw error
        console.log('Frontend AuthService: Register failed -', response.data.message);
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      // Handle any errors during registration
      console.error('Frontend AuthService: Register error:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error; // Re-throw for calling code to handle
    }
  },

  // Function to log the user out
  logout: async () => {
    try {
      // Try to tell the server we're logging out
      console.log('Frontend AuthService: Logout attempt');
      console.log('Frontend AuthService: Logout request URL:', api.defaults.baseURL + '/auth/logout');
      await api.post('/api/auth/logout');
    } catch (error) {
      // If server logout fails, just log it but continue
      console.error('Frontend AuthService: Logout API error:', error);
      // Continue with local cleanup even if API call fails
    }

    // Always clear local authentication data, even if server call failed
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    console.log('Frontend AuthService: Local session cleared');
    return { success: true };
  },

  // Function to get the current user's profile information
  getProfile: async () => {
    try {
      // Log the profile request
      console.log('Frontend AuthService: Get profile attempt');
      console.log('Frontend AuthService: Profile request URL:', api.defaults.baseURL + '/auth/profile');
      // Request user profile from server
      const response = await api.get('/api/auth/profile');
      console.log('Frontend AuthService: Profile API response:', response.data);

      // Check if request was successful
      if (response.data.success) {
        return { user: response.data.user };
      } else {
        // If server says failed, throw error
        throw new Error(response.data.message || 'Failed to get profile');
      }
    } catch (error) {
      // Handle errors
      console.error('Frontend AuthService: Get profile error:', error);
      // If API fails, try to use cached user data from local storage
      const userData = localStorage.getItem('user_data');
      if (userData) {
        console.log('Frontend AuthService: Using cached user data');
        return { user: JSON.parse(userData) };
      }
      // If no cached data, re-throw the error
      throw error;
    }
  },

  // Helper method to clear local session data (useful for testing)
  clearLocalSession: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }
};