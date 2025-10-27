import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, ShoppingCart, Home } from 'lucide-react'; 
import { AuthProvider } from './contexts/AuthContext.jsx';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import CheckoutPage from './pages/CheckoutPage'; 
import HomePage from './components/HomePage';
import EventsPage from './components/EventsPage';
import CreateEventForm from './components/CreateEventForm';
import OrganizerDashboard from './components/OrganizerDashboard';

const EventDetailPage = () => <div className="text-center pt-48 text-2xl">Event Detail Page</div>;
const GoerDashboard = () => <div className="text-center pt-48 text-2xl text-er-primary">Goer Dashboard</div>;

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


const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Events', path: '/events', icon: ShoppingCart },
        ...(isAuthenticated ? [] : [
            { name: 'Login', path: '/login', icon: User },
            { name: 'Signup', path: '/signup', icon: LogOut }, // LogOut icon used metaphorically for starting new journey
        ]),
        ...(user?.role === 'Organizer' ? [{ name: 'Dashboard', path: '/organizer/dashboard', icon: User }] : []),
        ...(user?.role === 'Goer' ? [{ name: 'My Profile', path: '/goer/profile', icon: User }] : []),
        ...(user?.role === 'Vendor' ? [{ name: 'Vendor Setup', path: '/vendor/setup', icon: User }] : []),
    ];

    return (
        <header className="fixed w-full top-0 z-50 bg-er-dark/95 backdrop-blur-sm shadow-lg border-b border-gray-800">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="font-heading text-3xl font-bold text-er-primary hover:text-pink-400 transition">EventRift</Link>
                
                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navItems.map(item => (
                        <Link key={item.name} to={item.path} className="text-er-text hover:text-er-primary transition font-medium flex items-center space-x-1">
                            <item.icon className="w-4 h-4"/>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition flex items-center space-x-1">
                            <LogOut className="w-4 h-4"/>
                            <span>Logout ({user.username})</span>
                        </button>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-er-text" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <nav className="flex flex-col p-4 space-y-2 bg-er-gray">
                    {navItems.map(item => (
                        <Link key={item.name} to={item.path} onClick={() => setIsOpen(false)} className="text-er-text hover:text-er-primary transition font-medium py-2 border-b border-gray-800">
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
    <footer className="bg-er-gray border-t border-gray-800 mt-12 py-12">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <Link to="/" className="font-heading text-2xl font-bold text-er-primary mb-4 block hover:text-pink-400 transition-colors">
                        EventRift
                    </Link>
                    <p className="text-er-text text-sm mb-4">
                        Connecting Kenya through unforgettable events and experiences.
                    </p>
                    <div className="flex space-x-4">
                        <button className="w-8 h-8 bg-er-primary rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors transform hover:scale-110">
                            <span className="text-white text-sm">f</span>
                        </button>
                        <button className="w-8 h-8 bg-er-secondary rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors transform hover:scale-110">
                            <span className="text-white text-sm">t</span>
                        </button>
                        <button className="w-8 h-8 bg-er-accent rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors transform hover:scale-110">
                            <span className="text-er-dark text-sm">i</span>
                        </button>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-heading text-lg font-semibold text-er-light mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/events" className="text-er-text hover:text-er-primary transition-colors text-sm">Browse Events</Link></li>
                        <li><Link to="/signup" className="text-er-text hover:text-er-primary transition-colors text-sm">Create Account</Link></li>
                        <li><Link to="/login" className="text-er-text hover:text-er-primary transition-colors text-sm">Sign In</Link></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Host Event</button></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-heading text-lg font-semibold text-er-light mb-4">Categories</h3>
                    <ul className="space-y-2">
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Music & Concerts</button></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Technology</button></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Food & Drink</button></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Sports & Fitness</button></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-heading text-lg font-semibold text-er-light mb-4">Support</h3>
                    <ul className="space-y-2">
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Help Center</button></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Contact Us</button></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Privacy Policy</button></li>
                        <li><button className="text-er-text hover:text-er-primary transition-colors text-sm">Terms of Service</button></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center">
                <p className="text-er-text text-sm mb-2">
                    &copy; {new Date().getFullYear()} EventRift. All rights reserved.
                </p>
                <p className="text-er-text text-sm">
                    Made with <span className="text-er-primary animate-pulse">❤️</span> for the Kenyan event scene.
                </p>
            </div>
        </div>
    </footer>
);



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
