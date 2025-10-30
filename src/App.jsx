import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; 
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import HomePage from './components/HomePage';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage';
import GoerDashboard from './components/GoerDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import VendorDashboard from './components/VendorDashboard';
import { Footer } from './components/Footer';
import Navbar from './components/Navbar';

// Component for Protected Routes (Client-Side RBAC)
const ProtectedRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const navigate = useNavigate();
    
    // Show a minimal loading state while checking token
    if (loading) {
        return <div className="text-center pt-48 text-xl text-gray-400">Loading user session...</div>;
    }

    if (!isAuthenticated) {
        // Store current path for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        navigate('/login');
        return null;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        // Redirect unauthorized users
        navigate('/'); 
        return <div className="text-center pt-48 text-xl text-red-500">Access Denied: Insufficient Permissions.</div>;
    }

    return element;
};

const App = () => {
    return (
        // BrowserRouter must wrap the whole application
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* AuthProvider wraps the layout and routes */}
            <AuthProvider>
                <div className="min-h-screen bg-er-dark text-er-text flex flex-col">
                    <Navbar />
                    
                    <main className="flex-grow"> 
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            
                            {/* Events Routes - Require Authentication */}
                            <Route
                                path="/events"
                                element={<ProtectedRoute element={<EventsPage />} />}
                            />
                            <Route
                                path="/events/:eventId"
                                element={<ProtectedRoute element={<EventDetailPage />} />}
                            />

                            {/* Auth Routes */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />

                            {/* Protected Dashboard Routes */}
                            <Route 
                                path="/organizer/dashboard" 
                                element={<ProtectedRoute element={<OrganizerDashboard />} />} 
                            />
                            <Route 
                                path="/goer/dashboard" 
                                element={<ProtectedRoute element={<GoerDashboard />} />} 
                            />
                            <Route 
                                path="/vendor/dashboard" 
                                element={<ProtectedRoute element={<VendorDashboard />} />} 
                            />
                            
                            {/* Catch-all/404 Page */}
                            <Route path="*" element={<div className="text-center pt-48 text-xl text-red-500">404 - Page Not Found</div>} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;