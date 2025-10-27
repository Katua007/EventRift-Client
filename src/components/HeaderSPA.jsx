import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function HeaderSPA({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', section: 'home' },
    { label: 'Events', section: 'events' },
    { label: 'About', section: 'about' },
    { label: 'Gallery', section: 'gallery' },
    { label: 'Contact', section: 'contact' }
  ];

  const handleNavClick = (section) => {
    setMobileMenuOpen(false);
    onNavigate(section);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer"
          >
            <span className="text-white tracking-wider font-bold text-xl">EVENTRIFT</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.section}
                onClick={() => handleNavClick(item.section)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => handleNavClick('events')}
              className="bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors"
            >
              Find Events
            </button>
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
                  key={item.section}
                  onClick={() => handleNavClick(item.section)}
                  className="text-white/80 hover:text-white transition-colors text-left"
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => handleNavClick('events')}
                className="bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors w-full"
              >
                Find Events
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}