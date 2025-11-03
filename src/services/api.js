// This file sets up the connection to our backend server
// It handles all HTTP requests and adds authentication automatically

// Import axios library for making HTTP requests
import axios from 'axios';

// Define the backend server URL - use environment variable or default to production server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eventrift-server.onrender.com';

// Create a configured axios instance for all our API calls
const api = axios.create({
  baseURL: API_BASE_URL, // Base URL for all requests
  timeout: 30000, // Wait up to 30 seconds for response (good for slow connections)
  headers: {
    'Content-Type': 'application/json', // Send data as JSON
  },
  withCredentials: true, // Include cookies/credentials for authentication
});

// This runs before every API request to add the authentication token
api.interceptors.request.use(
  (config) => {
    // Get the JWT token from browser storage
    const token = localStorage.getItem('jwt_token');
    // If we have a token, add it to the request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Return the modified request config
    return config;
  },
  (error) => Promise.reject(error) // If there's an error, reject the promise
);

// This runs after every API response to handle errors
api.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  (error) => {
    // If the server returns 401 (unauthorized), the token is invalid
    if (error.response?.status === 401) {
      // Clear stored authentication data
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Redirect user back to login page
      window.location.href = '/login';
    }

    // Handle network and connection errors
    if (error.code === 'ERR_NETWORK' || // Network completely down
        error.message.includes('CORS') || // Cross-origin request blocked
        error.code === 'ECONNABORTED' || // Request timed out
        error.name === 'TypeError' || // Usually network issues
        error.message.includes('ERR_FAILED')) { // General network failure
      console.error('Network Error: Backend connection issue or CORS restriction');
      console.error('Error details:', error);
      // Mark the error so other parts of the app know it's a network issue
      error.isCorsError = true;
      error.isNetworkError = true;
    }

    // Return the error so the calling code can handle it
    return Promise.reject(error);
  }
);

// Export the configured API instance so other files can use it to make requests
export default api;