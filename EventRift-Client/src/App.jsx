import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, ShoppingCart, Home } from 'lucide-react'; 
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 
import CheckoutPage from './pages/CheckoutPage';
import VendorServiceSetup from './pages/VendorServiceSetup'; 


const HomePage = () => <div className="text-center pt-48 text-2xl">Welcome to EventRift (Home Page)</div>;
const EventDetailPage = () => <div className="text-center pt-48 text-2xl">Event Detail Page</div>;
const OrganizerDashboard = () => <div className="text-center pt-48 text-2xl text-er-primary">Organizer Dashboard</div>;
const GoerDashboard = () => <div className="text-center pt-48 text-2xl text-er-primary">Goer Dashboard</div>;

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    // Structure of user: { id: 1, username: 'JohnDoe', role: 'Organizer', token: '...' }
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token in localStorage on mount
        const token = localStorage.getItem('jwt_token');
        const userData = JSON.parse(localStorage.getItem('user_data'));
        
        if (token && userData) {
            // Basic validation
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

    // Helper for Role-Based Access Control (RBAC)
    const hasRole = (role) => isAuthenticated && user?.role === role;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, hasRole, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

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



const App = () => {
    return (
        // BrowserRouter must wrap the whole application
        <BrowserRouter>
            {/* AuthProvider wraps the layout and routes */}
            <AuthProvider>
                <div className="min-h-screen bg-er-dark text-er-light flex flex-col">
                    <Header />
                    
                    <main className="flex-grow"> 
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<HomePage />} />
                            <Route path="/events" element={<HomePage />} /> {/* Placeholder for Event Browsing */}
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
                                path="/goer/profile" 
                                element={<ProtectedRoute element={<GoerDashboard />} requiredRole="Goer" />} 
                            />
                            <Route 
                                path="/vendor/setup-service" 
                                element={<ProtectedRoute element={<VendorServiceSetup />} requiredRole="Vendor" />} 
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
