import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        const userData = JSON.parse(localStorage.getItem('user_data'));
        
        if (token && userData) {
            setUser(userData);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        setUser(null);
        setIsAuthenticated(false);
    };

    const hasRole = (role) => isAuthenticated && user?.role === role;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, hasRole, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};