import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Use absolute path to logo in public directory instead of import

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '#about' },
    { label: 'Gallery', path: '#gallery' },
    { label: 'Contact', path: '#contact' }
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('#')) {
      // Handle anchor links for sections on homepage
      if (window.location.pathname !== '/') {
        // Navigate to home first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(path);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // Already on homepage, just scroll
        const element = document.querySelector(path);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else if (path === '/events') {
      // Check authentication for events page
      if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', path);
        navigate('/login');
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const handleAuthAction = () => {
    setMobileMenuOpen(false);
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="cursor-pointer"
          >
            <img
              src="/assets/images/EventRift LOGO.png"
              alt="EventRift"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Auth & CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to={
                    user?.role === 'Organizer' ? '/organizer/dashboard' :
                    user?.role === 'Vendor' ? '/vendor/dashboard' :
                    '/goer/dashboard'
                  }
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleAuthAction}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => handleNavClick('/events')}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors"
                >
                  Find Events
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="text-white/80 hover:text-white transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
              {isAuthenticated ? (
                <>
                  <Link 
                    to={
                      user?.role === 'Organizer' ? '/organizer/dashboard' :
                      user?.role === 'Vendor' ? '/vendor/dashboard' :
                      '/goer/dashboard'
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleAuthAction}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavClick('/login')}
                    className="text-white/80 hover:text-white transition-colors text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick('/signup')}
                    className="text-white/80 hover:text-white transition-colors text-left"
                  >
                    Sign Up
                  </button>
                  <button 
                    onClick={() => handleNavClick('/events')}
                    className="bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors w-full"
                  >
                    Find Events
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}