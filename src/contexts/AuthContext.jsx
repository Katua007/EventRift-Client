import React, { useState, useEffect, createContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('jwt_token');
            const userData = localStorage.getItem('user_data');

            if (token && userData) {
                try {
                    // Verify token with backend
                    const profile = await authService.getProfile();
                    setUser(profile.user || JSON.parse(userData));
                    setIsAuthenticated(true);
                } catch (error) {
                    // Token invalid, clear storage
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_data');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, user } = response;
            
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('user_data', JSON.stringify(user));
            setUser(user);
            setIsAuthenticated(true);
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message || 'Login failed' };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_data');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const hasRole = (role) => isAuthenticated && user?.role?.toLowerCase() === role.toLowerCase();

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: error.message || 'Registration failed' };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            hasRole, 
            login, 
            logout, 
            register,
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};