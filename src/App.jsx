// This file sets up the main structure of our React application
// It handles routing between different pages and provides authentication to all components

// Import React and routing components
import React from 'react'; // React is the main library for building user interfaces
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'; // These help us navigate between different pages
// Import authentication system
import { AuthProvider } from './contexts/AuthContext.jsx'; // Provides login/logout functionality to the whole app
import { useAuth } from './hooks/useAuth'; // Hook to access authentication state
// Import all the different pages and components
import LoginPage from './pages/LoginPage'; // The login page
import SignupPage from './pages/SignupPage'; // The sign up page
import HomePage from './components/HomePage'; // The main landing page
import EventsPage from './components/EventsPage'; // Page showing all events
import EventDetailPage from './components/EventDetailPage'; // Page showing details of one event
import GoerDashboard from './components/GoerDashboard'; // Dashboard for event attendees
import OrganizerDashboard from './components/OrganizerDashboard'; // Dashboard for event organizers
import VendorDashboard from './components/VendorDashboard'; // Dashboard for vendors
import CreateEventForm from './components/CreateEventForm'; // Form to create new events
import ServiceForm from './components/ServiceForm'; // Form to add vendor services
import { VendorSetup } from './components/VendorSetup'; // Setup page for new vendors
import { Footer } from './components/Footer'; // Footer shown on all pages
import Navbar from './components/Navbar'; // Navigation bar at the top

// Dashboard Router Component - handles automatic redirection based on user role
const DashboardRouter = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user?.role) {
            switch (user.role.toLowerCase()) {
                case 'organizer':
                    navigate('/organizer/dashboard', { replace: true });
                    break;
                case 'vendor':
                    navigate('/vendor/dashboard', { replace: true });
                    break;
                case 'goer':
                default:
                    navigate('/goer/dashboard', { replace: true });
                    break;
            }
        }
    }, [user, navigate]);

    return <div className="text-center pt-48 text-xl text-gray-400">Redirecting to your dashboard...</div>;
};

// This component protects certain pages so only logged-in users can access them
// It also checks if users have the right permissions (like organizer or vendor roles)
const ProtectedRoute = ({ element, requiredRole }) => {
    // Get authentication information from our auth system
    const { isAuthenticated, hasRole, loading } = useAuth();

    // While we're checking if the user is logged in, show a loading message
    if (loading) {
        return <div className="text-center pt-48 text-xl text-gray-400">Loading user session...</div>;
    }

    // If user is not logged in, save where they were trying to go and send them to login
    if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return <NavigateToLogin />;
    }

    // If this page requires a specific role (like organizer) and user doesn't have it, redirect home
    if (requiredRole && !hasRole(requiredRole)) {
        return <NavigateToHome />;
    }

    // If everything is okay, show the protected page
    return element;
};

// These are helper components that redirect users to different pages
// We need them as separate components because we can't use navigation hooks directly in the ProtectedRoute component

// Component that redirects to the login page
const NavigateToLogin = () => {
    const navigate = useNavigate(); // Hook to change pages
    React.useEffect(() => { // Run this when component mounts
        navigate('/login'); // Go to login page
    }, [navigate]); // Only run when navigate function changes
    return null; // Don't show anything on screen
};

// Component that redirects to home page and shows access denied message
const NavigateToHome = () => {
    const navigate = useNavigate(); // Hook to change pages
    React.useEffect(() => { // Run this when component mounts
        navigate('/'); // Go to home page
    }, [navigate]); // Only run when navigate function changes
    return <div className="text-center pt-48 text-xl text-red-500">Access Denied: Insufficient Permissions.</div>; // Show error message
};

// This is the main App component that defines the entire application structure
const App = () => {
    return (
        // BrowserRouter enables navigation between different pages in the app
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* AuthProvider gives all components access to login/logout functionality */}
            <AuthProvider>
                {/* Main app container with dark background and full height */}
                <div className="min-h-screen bg-er-dark text-er-text flex flex-col">
                    {/* Navigation bar at the top */}
                    <Navbar />

                    {/* Main content area that grows to fill available space */}
                    <main className="flex-grow">
                        {/* Define all the different pages/routes in our app */}
                        <Routes>
                            {/* Public Routes - anyone can access these */}
                            <Route path="/" element={<HomePage />} /> {/* Home/landing page */}

                            {/* Events Routes - require user to be logged in */}
                            <Route
                                path="/events" // URL path
                                element={<ProtectedRoute element={<EventsPage />} />} // Page component wrapped in protection
                            />
                            <Route
                                path="/events/:eventId" // URL with event ID parameter
                                element={<ProtectedRoute element={<EventDetailPage />} />} // Event details page
                            />

                            {/* Authentication Routes - for login/signup */}
                            <Route path="/login" element={<LoginPage />} /> {/* Login page */}
                            <Route path="/signup" element={<SignupPage />} /> {/* Sign up page */}

                            {/* Protected Dashboard Routes - only for logged-in users with specific roles */}
                            <Route
                                path="/dashboard" // Generic dashboard route that redirects based on role
                                element={<ProtectedRoute element={<DashboardRouter />} />}
                            />
                            <Route
                                path="/organizer/dashboard" // Organizer's main dashboard
                                element={<ProtectedRoute element={<OrganizerDashboard />} requiredRole="organizer" />}
                            />
                            <Route
                                path="/organizer/create-event" // Form to create new events
                                element={<ProtectedRoute element={<CreateEventForm />} requiredRole="organizer" />}
                            />
                            <Route
                                path="/organizer/edit-event/:eventId" // Form to edit existing events
                                element={<ProtectedRoute element={<CreateEventForm />} requiredRole="organizer" />}
                            />
                            <Route
                                path="/goer/dashboard" // Attendee's dashboard
                                element={<ProtectedRoute element={<GoerDashboard />} requiredRole="goer" />}
                            />
                            <Route
                                path="/vendor/dashboard" // Vendor's dashboard
                                element={<ProtectedRoute element={<VendorDashboard />} requiredRole="vendor" />}
                            />
                            <Route
                                path="/vendor/setup" // Initial vendor setup
                                element={<ProtectedRoute element={<VendorSetup />} requiredRole="vendor" />}
                            />
                            <Route
                                path="/vendor/add-service" // Form to add new services
                                element={<ProtectedRoute element={<ServiceForm />} requiredRole="vendor" />}
                            />
                            <Route
                                path="/vendor/edit-service/:serviceId" // Form to edit existing services
                                element={<ProtectedRoute element={<ServiceForm />} requiredRole="vendor" />}
                            />

                            {/* Catch-all route for pages that don't exist */}
                            <Route path="*" element={<div className="text-center pt-48 text-xl text-red-500">404 - Page Not Found</div>} />
                        </Routes>
                    </main>

                    {/* Footer at the bottom of every page */}
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};

// Export the App component so it can be used in main.jsx to start the application
export default App;