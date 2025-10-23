import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <header className="absolute top-0 left-0 w-full z-10 text-er-light p-4 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-er-light">EventRift</Link>
        <nav className="hidden md:flex space-x-6 uppercase text-sm">
          {navItems.map(item => (
            <Link key={item.name} to={item.path} className="hover:text-er-primary transition duration-300">{item.name}</Link>
          ))}
          <Link to="/get-started" className="ml-6 px-4 py-1 border border-er-light rounded hover:bg-er-primary hover:border-er-primary transition duration-300">GET STARTED</Link>
        </nav>
        {/* Mobile menu icon goes here */}
      </div>
    </header>
  );
};

export default Header;