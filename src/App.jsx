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
import CreateEventForm from './components/CreateEventForm';
import { VendorSetup } from './components/VendorSetup';
import { Footer } from './components/Footer';
import Navbar from './components/Navbar';

// Component for Protected Routes (Client-Side RBAC)
const ProtectedRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    // Show a minimal loading state while checking token
    if (loading) {
        return <div className="text-center pt-48 text-xl text-gray-400">Loading user session...</div>;
    }

    if (!isAuthenticated) {
        // Store current path for redirect after login
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return <NavigateToLogin />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        // Redirect unauthorized users
        return <NavigateToHome />;
    }

    return element;
};

// Separate components to avoid calling hooks during render
const NavigateToLogin = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/login');
    }, [navigate]);
    return null;
};

const NavigateToHome = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/');
    }, [navigate]);
    return <div className="text-center pt-48 text-xl text-red-500">Access Denied: Insufficient Permissions.</div>;
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
                                path="/organizer/create-event"
                                element={<ProtectedRoute element={<CreateEventForm />} requiredRole="organizer" />}
                            />
                            <Route
                                path="/goer/dashboard"
                                element={<ProtectedRoute element={<GoerDashboard />} />}
                            />
                            <Route
                                path="/vendor/dashboard"
                                element={<ProtectedRoute element={<VendorDashboard />} />}
                            />
                            <Route
                                path="/vendor/setup"
                                element={<ProtectedRoute element={<VendorSetup />} requiredRole="vendor" />}
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