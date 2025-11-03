// This file manages user authentication state across the entire application
// It handles login, logout, and keeps track of whether users are logged in and what their roles are

// Import React hooks and functions we need
import React, { useState, useEffect, createContext } from 'react'; // React hooks for state and context
import { authService } from '../services/authService'; // Our authentication service functions

// Create a context that other components can use to access authentication state
export const AuthContext = createContext(null);

// This component provides authentication state to all child components
// It manages user login status, user data, and authentication functions
export const AuthProvider = ({ children }) => {
    // Store the current user information (name, email, role, etc.)
    const [user, setUser] = useState(null);
    // Track whether the user is logged in or not
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Show loading state while checking authentication on app start
    const [loading, setLoading] = useState(true);

    // This runs when the app first loads to check if user was already logged in
    useEffect(() => {
        // Function to check and restore user's login session
        const initAuth = async () => {
            // Get stored authentication data from browser storage
            const token = localStorage.getItem('jwt_token'); // The login token
            const userData = localStorage.getItem('user_data'); // User information

            // If we have both token and user data, try to verify they're still valid
            if (token && userData) {
                try {
                    // Ask the server to verify our token is still good
                    const profile = await authService.getProfile();
                    // Update our state with the user information
                    setUser(profile.user || JSON.parse(userData));
                    setIsAuthenticated(true); // Mark user as logged in
                } catch (error) {
                    // If token is invalid or expired, clear the stored data
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_data');
                }
            }
            // Stop showing loading state
            setLoading(false);
        };

        // Run the authentication check
        initAuth();
    }, []); // Empty array means this only runs once when component mounts

    // Function that other components call when they want to log a user in
    const login = async (credentials) => {
        try {
            // Log what we're trying to do (hiding password for security)
            console.log('AuthContext: Attempting login with credentials:', { email_or_username: credentials.email_or_username, password: '***' });
            // Call our authentication service to log in
            const response = await authService.login(credentials);
            // Get the token and user data from the response
            const { token, user } = response;

            // Log successful login and save data
            console.log('AuthContext: Login successful, setting user:', user);
            localStorage.setItem('jwt_token', token); // Save token for future requests
            localStorage.setItem('user_data', JSON.stringify(user)); // Save user info
            setUser(user); // Update our state with user data
            setIsAuthenticated(true); // Mark user as logged in

            // Return success result
            return { success: true, user };
        } catch (error) {
            // Log the error and return failure result
            console.error('AuthContext: Login failed:', error);
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    // Function to log the user out
    const logout = async () => {
        try {
            // Try to tell the server we're logging out
            await authService.logout();
        } catch (error) {
            // If server logout fails, just log it but continue with local logout
            console.error('Logout error:', error);
        } finally {
            // Always clear local data and update state, even if server call fails
            localStorage.removeItem('jwt_token'); // Remove stored token
            localStorage.removeItem('user_data'); // Remove stored user data
            setUser(null); // Clear user from state
            setIsAuthenticated(false); // Mark as not logged in
        }
    };

    // Function to check if current user has a specific role (organizer, vendor, etc.)
    const hasRole = (role) => isAuthenticated && user?.role?.toLowerCase() === role.toLowerCase();

    // Function to register a new user account
    const register = async (userData) => {
        try {
            // Log the registration attempt (hiding password)
            console.log('AuthContext: Attempting registration with data:', { username: userData.username, email: userData.email, role: userData.role, password: '***' });
            // Call our authentication service to create the account
            const response = await authService.register(userData);
            // Log success and return the result
            console.log('AuthContext: Registration successful:', response);
            return { success: true, message: response.message };
        } catch (error) {
            // Log the error and return failure result
            console.error('AuthContext: Registration failed:', error);
            return { success: false, error: error.message || 'Registration failed' };
        }
    };

// Provide authentication data to all child components
    return (
        // AuthContext.Provider makes authentication functions available to all child components
        <AuthContext.Provider value={{
            user, // Current user information
            isAuthenticated, // Whether user is logged in
            hasRole, // Function to check user roles
            login, // Function to log in
            logout, // Function to log out
            register, // Function to register new account
            loading // Whether we're still checking authentication
        }}>
            {children} {/* All the components that need access to authentication */}
        </AuthContext.Provider>
    );
};