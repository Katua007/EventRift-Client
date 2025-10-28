import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-er-gray border-t border-er-primary/20 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-er-primary to-er-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white font-heading font-bold text-xl">EventRift</span>
            </div>
            <p className="text-white mb-6 leading-relaxed">
              Connecting people through unforgettable experiences across Kenya.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-er-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-er-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-er-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-er-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white hover:text-er-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#about" className="text-white hover:text-er-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#events" className="text-white hover:text-er-primary transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-white hover:text-er-primary transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white hover:text-er-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">For Users</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/signup" className="text-white hover:text-er-primary transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <a href="#" className="text-white hover:text-er-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-er-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-er-primary" />
                <a href="mailto:info@eventrift.co.ke" className="text-white hover:text-er-primary transition-colors">
                  info@eventrift.co.ke
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-er-primary" />
                <a href="tel:+254700123456" className="text-white hover:text-er-primary transition-colors">
                  +254 700 123 456
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-er-primary mt-1" />
                <span className="text-white">
                  Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-er-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              &copy; {currentYear} EventRift. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-white hover:text-er-primary transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-white hover:text-er-primary transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-white hover:text-er-primary transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}