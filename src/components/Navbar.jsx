import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
// Use absolute path to logo in public directory instead of import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Exact Figma navigation items
  const navItems = [
    { name: 'Home', href: '/', section: 'home' },
    { name: 'About', href: '#about', section: 'about' },
    { name: 'Events', href: '/events', section: 'events', requireAuth: true },
    { name: 'Gallery', href: '#gallery', section: 'gallery' },
    { name: 'Contact', href: '#contact', section: 'contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        const sections = ['home', 'about', 'events', 'gallery', 'contact'];
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      } else {
        setActiveSection(location.pathname.slice(1) || 'home');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const handleNavClick = (href, section, requireAuth = false) => {
    setIsOpen(false);
    
    if (requireAuth && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', href);
      navigate('/login');
      return;
    }
    
    if (href.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      navigate(href);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowUserMenu(false);
    setIsOpen(false);
  };

  const getDashboardLink = () => {
    if (!user?.role) return '/';
    
    switch (user.role.toLowerCase()) {
      case 'organizer':
        return '/organizer/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      case 'goer':
      default:
        return '/goer/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-er-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Image Logo */}
          <Link to="/" className="flex items-center hover-lift">
            <img
              src="/assets/images/EventRift LOGO.png"
              alt="EventRift"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href, item.section, item.requireAuth)}
                className={`relative px-4 py-2 text-base font-semibold transition-all duration-300 hover-lift ${
                  activeSection === item.section
                    ? 'text-er-primary'
                    : 'text-white hover:text-er-primary'
                }`}
              >
                {item.name}
                {activeSection === item.section && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-er-primary to-er-secondary rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* Desktop Auth Section - Single "Get Started" Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 bg-er-gray/50 hover:bg-er-gray border border-er-border hover:border-er-primary/50 rounded-xl px-4 py-2 transition-all duration-300 hover-lift"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-er-primary to-er-secondary rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{user?.username}</span>
                  <ChevronDown className={`w-4 h-4 text-er-muted transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-er-gray border border-er-border rounded-xl shadow-xl py-2 animate-fade-in">
                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center px-4 py-2 text-er-text hover:text-er-primary hover:bg-er-primary/10 transition-colors"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <hr className="border-er-border my-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-er-error hover:bg-er-error/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signup"
                className="bg-er-primary hover:bg-er-primary/90 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-glow"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-er-primary transition-colors p-2 rounded-lg hover:bg-er-primary/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-er-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href, item.section, item.requireAuth)}
                  className={`text-left px-4 py-3 text-base font-semibold transition-colors rounded-lg ${
                    activeSection === item.section
                      ? 'text-er-primary bg-er-primary/10'
                      : 'text-white hover:text-er-primary hover:bg-er-primary/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              <div className="border-t border-er-border pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center px-4 py-3 text-white hover:text-er-primary transition-colors rounded-lg hover:bg-er-primary/5"
                    >
                      <User className="w-5 h-5 mr-3" />
                      Dashboard ({user?.username})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-er-error hover:bg-er-error/10 transition-colors rounded-lg"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block mt-2 bg-er-primary hover:bg-er-primary/90 text-white font-bold px-4 py-3 rounded-xl transition-all duration-300 text-center"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;