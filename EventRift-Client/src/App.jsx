import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, ShoppingCart, Home, Settings } from 'lucide-react'; // Added Settings for setup
// --- IMPORT PAGES ---
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import CheckoutPage from './pages/CheckoutPage';
import VendorServiceSetup from './pages/VendorServiceSetup';
import EventListPage from './pages/EventListPage';
import StallBookingPage from './pages/StallBookingPage'; 
import OrganizerDashboard from './pages/OrganizerDashboard'; // Imported Abu's component
import GoerDashboard from './pages/GoerDashboard';       // Imported Abu's component
// --- END IMPORT PAGES ---


// --- PLACEHOLDER COMPONENTS (Replace with actual components as they are built) ---
const HomePage = () => <div className="text-center pt-48 text-2xl text-er-light">Welcome to EventRift (Home Page)</div>;
const EventDetailPage = () => <div className="text-center pt-48 text-2xl text-er-light">Event Detail Page</div>;
// const OrganizerDashboard = () => <div className="text-center pt-48 text-2xl text-er-primary">Organizer Dashboard</div>;
// const GoerDashboard = () => <div className="text-center pt-48 text-2xl text-er-primary">Goer Dashboard</div>;
// --- END PLACEHOLDER COMPONENTS ---


// --- AUTH CONTEXT & PROVIDER ---
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    // Structure of user: { id: 1, username: 'JohnDoe', role: 'Organizer'|'Goer'|'Vendor', token: '...' }
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

export const useAuth = () => useContext(AuthContext);
// --- END AUTH CONTEXT & PROVIDER ---


// --- PROTECTED ROUTE COMPONENT (Client-Side RBAC) ---
const ProtectedRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const navigate = useNavigate();
    
    if (loading) {
        return <div className="text-center pt-48 text-xl text-gray-400">Loading user session...</div>;
    }

    if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        navigate('/login');
        return null;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        // Redirect unauthorized users to home or a specific denial page
        navigate('/'); 
        return <div className="text-center pt-48 text-xl text-red-500">Access Denied: Insufficient Permissions.</div>;
    }

    // Render the element if authenticated and authorized
    return element;
};
// --- END PROTECTED ROUTE COMPONENT ---


// --- HEADER & FOOTER COMPONENTS ---
const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    // Dynamic navigation items based on authentication status and role
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Events', path: '/events', icon: ShoppingCart },
        ...(isAuthenticated ? [] : [
            { name: 'Login', path: '/login', icon: User },
            { name: 'Signup', path: '/signup', icon: LogOut },
        ]),
        // Dashboard/Profile links
        ...(user?.role === 'Organizer' ? [{ name: 'Organizer Dash', path: '/organizer/dashboard', icon: Settings }] : []),
        ...(user?.role === 'Goer' ? [{ name: 'My Profile', path: '/goer/profile', icon: User }] : []),
        // Vendor Setup link (since it's a one-time setup)
        ...(user?.role === 'Vendor' ? [{ name: 'Vendor Setup', path: '/vendor/setup-service', icon: Settings }] : []),
    ];

    return (
        <header className="fixed w-full top-0 z-50 bg-black shadow-lg border-b border-gray-900">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold text-er-primary hover:text-pink-400 transition">EventRift</Link>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map(item => (
                        <Link key={item.name} to={item.path} className="text-er-light hover:text-er-primary transition font-medium flex items-center space-x-1">
                            <item.icon className="w-4 h-4"/>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button onClick={logout} className="bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700 transition flex items-center space-x-1">
                            <LogOut className="w-4 h-4"/>
                            <span>Logout ({user.username})</span>
                        </button>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-er-light" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <nav className="flex flex-col p-4 space-y-2 bg-gray-900">
                    {navItems.map(item => (
                        <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="text-er-light hover:text-er-primary transition font-medium py-2 border-b border-gray-800">
                            {item.name}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button onClick={() => { logout(); setIsOpen(false); }} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition mt-2">
                            Logout ({user.username})
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
};

const Footer = () => (
    <footer className="bg-black border-t border-gray-900 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} EventRift. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for the Kenyan event scene.</p>
        </div>
    </footer>
);
// --- END HEADER & FOOTER COMPONENTS ---


// --- MAIN APP COMPONENT ---
const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                {/* Apply global background and text color classes */}
                <div className="min-h-screen bg-er-dark text-er-light flex flex-col">
                    <Header />
                    
                    <main className="flex-grow"> 
                        <Routes>
                            {/* 1. Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<EventListPage />} />
                            <Route path="/events/:eventId" element={<EventDetailPage />} />

                            {/* 2. Auth Routes */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            
                            {/* 3. Transaction/Booking Routes (Public access, but usually requires auth check inside component) */}
                            <Route path="/events/:eventId/checkout" element={<CheckoutPage />} /> 
                            <Route path="/events/:eventId/book-stall" element={<StallBookingPage />} /> 

                            {/* 4. Protected Routes (RBAC enforcement via ProtectedRoute component) */}
                            
                            {/* Organizer (Phase 3/4) */}
                            <Route 
                                path="/organizer/dashboard" 
                                element={<ProtectedRoute element={<OrganizerDashboard />} requiredRole="Organizer" />} 
                            />
                            
                            {/* Goer (Phase 4) */}
                            <Route 
                                path="/goer/profile" 
                                element={<ProtectedRoute element={<GoerDashboard />} requiredRole="Goer" />} 
                            />
                            
                            {/* Vendor Setup (Phase 3/4) */}
                            <Route 
                                // Changed path to match nav item name in Header
                                path="/vendor/setup-service" 
                                element={<ProtectedRoute element={<VendorServiceSetup />} requiredRole="Vendor" />} 
                            />
                            
                            {/* 5. Catch-all/404 Page */}
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