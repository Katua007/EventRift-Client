import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; 
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import CheckoutPage from './pages/CheckoutPage'; 
import HomePage from './components/HomePage';
import EventsPage from './components/EventsPage';
import EventDetailPage from './components/EventDetailPage';
import CreateEventForm from './components/CreateEventForm';
import OrganizerDashboard from './components/OrganizerDashboard';
import GoerDashboard from './components/GoerDashboard';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
// Component for Protected Routes (Client-Side RBAC)
const ProtectedRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const navigate = useNavigate();
    
    // Show a minimal loading state while checking token
    if (loading) {
        return <div className="text-center pt-48 text-xl text-gray-400">Loading user session...</div>;
    }

    if (!isAuthenticated) {
        // Redirect unauthenticated users to login
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
        <BrowserRouter>
            {/* AuthProvider wraps the layout and routes */}
            <AuthProvider>
                <div className="min-h-screen bg-er-dark text-er-text flex flex-col">
                    <Header />
                    
                    <main className="flex-grow"> 
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/events/:eventId" element={<EventDetailPage />} />

                            {/* Auth Routes */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            
                            {/*Checkout Route*/}
                            <Route path="/events/:eventId/checkout" element={<CheckoutPage />} /> 

                            {/* Protected Routes (Require Authentication and Role) */}
                            <Route 
                                path="/organizer/dashboard" 
                                element={<ProtectedRoute element={<OrganizerDashboard />} requiredRole="Organizer" />} 
                            />
                            <Route 
                                path="/organizer/create-event" 
                                element={<ProtectedRoute element={<CreateEventForm />} requiredRole="Organizer" />} 
                            />
                            <Route 
                                path="/goer/profile" 
                                element={<ProtectedRoute element={<GoerDashboard />} requiredRole="Goer" />} 
                            />
                            <Route 
                                path="/goer/dashboard" 
                                element={<ProtectedRoute element={<GoerDashboard />} requiredRole="Goer" />} 
                            />
                            <Route 
                                path="/vendor/setup" 
                                element={<ProtectedRoute element={<GoerDashboard />} requiredRole="Vendor" />} 
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
