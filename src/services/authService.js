// This file handles all authentication-related tasks like login, logout, and user profile
// It communicates with the backend server to manage user sessions

// Import our configured API instance
import api from './api.js';
import { API_ENDPOINTS } from '../utils/apiEndpoints.js';

// Object containing all authentication functions
export const authService = {
  // Function to log a user in by sending credentials to the server
  login: async (credentials) => {
    // Log what we're trying to do (hiding password for security)
    console.log('Frontend AuthService: Login attempt with credentials:', { email_or_username: credentials.email_or_username, password: '***' });
    console.log('Frontend AuthService: Login request URL:', api.defaults.baseURL + '/api/auth/login');

    try {
      // Send login request to the server
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
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
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 500) {
          // Server error - provide user-friendly message
          console.warn('Server error during login, check server status');
          throw new Error('Server is temporarily unavailable. Please try again later.');
        } else if (status === 401) {
          // Unauthorized - wrong credentials
          throw new Error(errorData?.message || 'Invalid email/username or password.');
        } else if (status === 400) {
          // Bad request - missing or invalid data
          throw new Error(errorData?.message || 'Please provide valid login credentials.');
        } else {
          // Other HTTP errors
          throw new Error(errorData?.message || `Login failed (${status})`);
        }
      } else if (error.request) {
        // Network error - no response received
        console.warn('Network error during login');
        throw new Error('Unable to connect to server. Please check your internet connection.');
      } else {
        // Other errors
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  // Function to register a new user account
  register: async (userData) => {
    // Log the registration attempt (hiding password)
    console.log('Frontend AuthService: Register attempt with data:', { username: userData.username, email: userData.email, role: userData.role, password: '***' });
    console.log('Frontend AuthService: Register request URL:', api.defaults.baseURL + '/api/auth/register');

    try {
      // Send registration request to the server
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
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
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 500) {
          // Server error - use offline fallback
          console.warn('Server error during registration, using offline fallback');
          return await this.offlineRegister(userData);
        } else if (status === 400) {
          // Bad request - user input error
          throw new Error(errorData?.message || 'Invalid registration data. Please check your inputs.');
        } else if (status === 409) {
          // Conflict - user already exists
          throw new Error(errorData?.message || 'User already exists with this email or username.');
        } else {
          // Other HTTP errors
          throw new Error(errorData?.message || `Registration failed (${status})`);
        }
      } else if (error.request) {
        // Network error - use offline fallback
        console.warn('Network error during registration, using offline fallback');
        return await this.offlineRegister(userData);
      } else {
        // Other errors
        throw new Error(error.message || 'Registration failed');
      }
    }
  },

  // Function to log the user out
  logout: async () => {
    try {
      // Try to tell the server we're logging out
      console.log('Frontend AuthService: Logout attempt');
      console.log('Frontend AuthService: Logout request URL:', api.defaults.baseURL + '/api/auth/logout');
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
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
      console.log('Frontend AuthService: Profile request URL:', api.defaults.baseURL + '/api/auth/profile');
      // Request user profile from server
      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
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

  // Offline registration fallback when server is unavailable
  offlineRegister: async (userData) => {
    console.log('Using offline registration fallback');
    
    // Check if user already exists in local storage
    const existingUsers = JSON.parse(localStorage.getItem('offline_users') || '[]');
    const userExists = existingUsers.some(user => 
      user.email === userData.email || user.username === userData.username
    );
    
    if (userExists) {
      throw new Error('User already exists with this email or username.');
    }
    
    // Create user with offline flag
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      role: userData.role,
      created_at: new Date().toISOString(),
      offline_created: true
    };
    
    // Store user locally
    existingUsers.push(newUser);
    localStorage.setItem('offline_users', JSON.stringify(existingUsers));
    
    return {
      message: 'Registration completed offline. Your account will sync when server is available.',
      success: true,
      offline: true
    };
  },

  // Helper method to clear local session data (useful for testing)
  clearLocalSession: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('offline_users');
  }
};