# EventRift Client - Complete Code Explanation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Main Entry Points](#main-entry-points)
3. [Services Layer](#services-layer)
4. [Components](#components)
5. [Data Layer](#data-layer)
6. [Context & Hooks](#context--hooks)
7. [Pages](#pages)
8. [Configuration Files](#configuration-files)

---

## Project Structure & File Contributions

```
EventRift-Client/
├── src/                    # Source code directory - Contains all React application code
│   ├── assets/            # Static assets (images, icons) - Stores event images, logos, icons
│   ├── components/        # Reusable UI components - Building blocks for the interface
│   ├── contexts/          # React context providers - Global state management
│   ├── data/             # Static data files - Mock data for development and fallbacks
│   ├── hooks/            # Custom React hooks - Reusable logic for components
│   ├── pages/            # Page components - Full page layouts and views
│   ├── services/         # API service functions - Backend communication layer
│   ├── utils/            # Utility functions - Helper functions and tools
│   ├── App.jsx           # Main application component - Root component with routing
│   ├── main.jsx          # Application entry point - Renders app to DOM
│   └── index.css         # Global styles - Tailwind CSS and custom styles
├── public/               # Public assets served directly - Static files accessible via URL
├── package.json          # Project dependencies and scripts - Defines what libraries are used
├── vite.config.js        # Vite build configuration - How the app is built and served
└── tailwind.config.js    # Tailwind CSS configuration - Custom styling framework setup
```

### What Each Directory Contributes to Development:

**src/assets/**: 
- **Development Value**: Centralizes all visual assets for easy management
- **Contains**: Event images, logos, icons, graphics
- **Impact**: Improves loading performance, maintains consistent branding

**src/components/**: 
- **Development Value**: Promotes code reusability and maintainability
- **Contains**: UI building blocks like buttons, cards, forms, navigation
- **Impact**: Reduces code duplication, enables consistent design system

**src/contexts/**: 
- **Development Value**: Manages global application state without prop drilling
- **Contains**: Authentication context, theme context, user preferences
- **Impact**: Simplifies state sharing across components

**src/data/**: 
- **Development Value**: Provides mock data for development and API fallbacks
- **Contains**: Event data, categories, user profiles, sample content
- **Impact**: Enables offline development, provides reliable fallbacks

**src/hooks/**: 
- **Development Value**: Encapsulates reusable logic and side effects
- **Contains**: Authentication hooks, API hooks, form hooks
- **Impact**: Promotes code reuse, separates concerns, improves testing

**src/pages/**: 
- **Development Value**: Organizes full-page components and routing
- **Contains**: Login, signup, dashboard, event pages
- **Impact**: Clear navigation structure, better code organization

**src/services/**: 
- **Development Value**: Abstracts API communication from UI components
- **Contains**: Authentication, events, payments, user management APIs
- **Impact**: Centralized error handling, easier API changes, better testing

**src/utils/**: 
- **Development Value**: Houses helper functions and utilities
- **Contains**: Date formatting, validation, API testing, constants
- **Impact**: Reduces code duplication, improves maintainability

---

## Main Entry Points

### 1. main.jsx
**Purpose**: Application entry point that renders the React app
**Development Contribution**: 
- Sets up the React application foundation
- Enables React 18 features like concurrent rendering
- Provides development mode optimizations
- Entry point for all application functionality
```javascript
import { StrictMode } from 'react'
// StrictMode is a React wrapper that helps identify problems in development

import { createRoot } from 'react-dom/client'
// createRoot is the new React 18 API for rendering applications

import './index.css'
// Imports global CSS styles including Tailwind CSS

import App from './App.jsx'
// Imports the main App component

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// Creates a React root on the HTML element with id="root" and renders the App component
// StrictMode enables additional checks and warnings for development
```

### 2. App.jsx
**Purpose**: Main application component that sets up routing and authentication
**Development Contribution**: 
- Establishes the application's navigation structure
- Implements role-based access control
- Provides authentication-aware routing
- Creates the main layout structure
- Enables protected routes for security
```javascript
import React from 'react';
// Imports React library for creating components

import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
// BrowserRouter: Enables routing in the application
// Routes: Container for all route definitions
// Route: Defines individual routes
// useNavigate: Hook for programmatic navigation

import { AuthProvider } from './contexts/AuthContext.jsx';
// Imports authentication context provider

import { useAuth } from './hooks/useAuth';
// Custom hook for accessing authentication state

// Import all page and component files
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './components/HomePage';
// ... other imports

// ProtectedRoute Component
const ProtectedRoute = ({ element, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    // Gets authentication state from context

    if (loading) {
        return <div className="text-center pt-48 text-xl text-gray-400">Loading user session...</div>;
        // Shows loading message while checking authentication
    }

    if (!isAuthenticated) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        // Saves current page to redirect after login
        return <NavigateToLogin />;
        // Redirects to login page
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <NavigateToHome />;
        // Redirects if user doesn't have required role
    }

    return element;
    // Returns the protected component if all checks pass
};

const App = () => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {/* BrowserRouter enables routing for the entire app */}
            <AuthProvider>
                {/* AuthProvider makes authentication state available to all components */}
                <div className="min-h-screen bg-er-dark text-er-text flex flex-col">
                    {/* Main container with dark background and text color */}
                    <Navbar />
                    {/* Navigation bar component */}
                    
                    <main className="flex-grow">
                        {/* Main content area that grows to fill available space */}
                        <Routes>
                            {/* Container for all route definitions */}
                            <Route path="/" element={<HomePage />} />
                            {/* Home page route - accessible to everyone */}
                            
                            <Route path="/events" element={<ProtectedRoute element={<EventsPage />} />} />
                            {/* Events page - requires authentication */}
                            
                            <Route path="/login" element={<LoginPage />} />
                            {/* Login page - public route */}
                            
                            {/* More routes... */}
                        </Routes>
                    </main>

                    <Footer />
                    {/* Footer component */}
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
};
```

---

## Services Layer

### 1. api.js
**Purpose**: Configures HTTP client for API communication
**Development Contribution**: 
- Centralizes all API configuration in one place
- Automatically handles authentication tokens
- Provides consistent error handling across the app
- Enables request/response interceptors for logging
- Simplifies API endpoint management
- Handles CORS and network issues gracefully
```javascript
import axios from 'axios';
// Axios is a library for making HTTP requests

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eventrift-server.onrender.com/api';
// Gets API URL from environment variables or uses default
// import.meta.env is Vite's way of accessing environment variables

const api = axios.create({
  baseURL: API_BASE_URL,
  // Sets the base URL for all API requests
  timeout: 30000,
  // Sets 30-second timeout for requests
  headers: {
    'Content-Type': 'application/json',
    // Sets default content type for requests
  },
  withCredentials: true,
  // Enables sending cookies with requests for CORS
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    // Gets authentication token from browser storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Adds token to request headers if it exists
    }
    return config;
    // Returns modified request configuration
  },
  (error) => Promise.reject(error)
  // Handles request errors
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => response,
  // Returns successful responses unchanged
  (error) => {
    if (error.response?.status === 401) {
      // If server returns 401 (Unauthorized)
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Clears stored authentication data
      window.location.href = '/login';
      // Redirects to login page
    }

    // Enhanced error handling for network issues
    if (error.code === 'ERR_NETWORK' ||
        error.message.includes('CORS') ||
        error.code === 'ECONNABORTED') {
      console.error('Network Error: Backend connection issue');
      error.isCorsError = true;
      error.isNetworkError = true;
      // Marks error as network-related for better handling
    }

    return Promise.reject(error);
    // Passes error to the calling function
  }
);

export default api;
// Exports configured axios instance
```

### 2. authService.js
**Development Contribution**: 
- Abstracts authentication logic from UI components
- Provides consistent login/logout functionality
- Handles token storage and management
- Enables secure user session management
- Simplifies authentication state across the app
- Provides error handling for auth operations
```javascript
import api from './api.js';
// Imports configured API client

export const authService = {
  login: async (credentials) => {
    // Function to log in a user
    console.log('Frontend AuthService: Login attempt');
    // Logs login attempt for debugging

    try {
      const response = await api.post('/auth/login', credentials);
      // Sends POST request to login endpoint with user credentials

      if (response.data.success) {
        // If login was successful
        const { access_token, user } = response.data;
        // Extracts token and user data from response

        localStorage.setItem('jwt_token', access_token);
        localStorage.setItem('user_data', JSON.stringify(user));
        // Stores token and user data in browser storage

        return { token: access_token, user };
        // Returns token and user data to calling function
      } else {
        throw new Error(response.data.message || 'Login failed');
        // Throws error if login failed
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
        // Throws server error message if available
      }
      throw error;
      // Throws original error if no server message
    }
  },

  register: async (userData) => {
    // Function to register a new user
    try {
      const response = await api.post('/auth/register', userData);
      // Sends POST request to register endpoint

      if (response.data.success) {
        return {
          message: response.data.message || 'Registration successful!',
          success: true
        };
        // Returns success message
      } else {
        throw new Error(response.data.message || 'Registration failed');
        // Throws error if registration failed
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  logout: async () => {
    // Function to log out current user
    try {
      await api.post('/auth/logout');
      // Notifies server about logout
    } catch (error) {
      console.error('Logout API error:', error);
      // Logs error but continues with local cleanup
    }

    // Clear session data regardless of API response
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    // Removes stored authentication data
    return { success: true };
  }
};
```

### 3. eventsService.js
**Development Contribution**: 
- Centralizes all event-related API calls
- Provides fallback data when API is unavailable
- Handles CRUD operations for events
- Enables offline functionality with local data
- Simplifies event management across components
- Provides consistent error handling for event operations
```javascript
import api from './api.js';
import { events } from '../data/events.js';
// Imports API client and local events data for fallback

export const eventsService = {
  getUserTickets: async () => {
    // Function to get tickets for current user
    try {
      const response = await api.get('/tickets/user');
      // Sends GET request to fetch user tickets
      return response.data;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      return { success: true, tickets: [] };
      // Returns empty array if API fails
    }
  },

  createEvent: async (eventData) => {
    // Function to create a new event
    try {
      console.log('Creating event with data:', eventData);
      // Logs event data for debugging
      const response = await api.post('/events', eventData);
      // Sends POST request to create event
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
        // Throws server error message
      }
      throw new Error('Failed to create event. Please try again.');
      // Throws generic error message
    }
  },

  getEvents: async () => {
    // Function to get all events
    try {
      const response = await api.get('/events');
      // Sends GET request to fetch events
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      // If API fails, return local data as fallback
      return {
        success: true,
        events: events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.start_date || e.date,
          location: e.location || `${e.venue_name}, ${e.address}`,
          category: e.category,
          image: e.image || null,
          ticket_price: e.ticket_price,
          rating: e.rating,
          reviews_count: e.reviews_count
        }))
        // Maps local event data to expected format
      };
    }
  },

  getEvent: async (eventId) => {
    // Function to get single event by ID
    try {
      const response = await api.get(`/events/${eventId}`);
      // Sends GET request for specific event
      return response.data;
    } catch (error) {
      // If API fails, try to find event in local data
      const event = events.find(e => e.id.toString() === eventId);
      if (event) {
        return {
          event: {
            ...event,
            availableTickets: (event.max_attendees || 1000) - (event.tickets_sold || 0),
            status: event.status || 'active'
          }
        };
        // Returns local event data with calculated fields
      }
      throw new Error(`Event with ID ${eventId} not found.`);
    }
  }
};
```

---

## Components

### 1. EventCard.jsx
**Purpose**: Displays individual event information in a card format
**Development Contribution**: 
- Creates reusable event display component
- Handles image loading with graceful fallbacks
- Provides consistent event presentation
- Enables responsive design across devices
- Reduces code duplication for event displays
- Implements hover effects and interactions
```javascript
export function EventCard({ image, title, date, location }) {
  // Component receives props: image, title, date, location
  
  const handleImageError = (e) => {
    // Function called when image fails to load
    e.target.style.display = 'none';
    // Hides the broken image
    e.target.nextSibling.style.display = 'flex';
    // Shows the fallback element
  };

  return (
    <div className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors cursor-pointer">
      {/* Card container with semi-transparent background and hover effect */}
      
      <div className="h-48 relative bg-gradient-to-br from-purple-500/30 to-pink-500/30">
        {/* Image container with gradient background */}
        
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            {/* Event image with error handling */}
            
            <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center" style={{ display: 'none' }}>
              <span className="text-white font-semibold">No Image</span>
            </div>
            {/* Fallback content shown when image fails */}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white font-semibold">No Image</span>
          </div>
          /* Default content when no image is provided */
        )}
      </div>
      
      <div className="p-4">
        {/* Card content area with padding */}
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        {/* Event title */}
        <p className="text-white/60 text-sm mb-1">{date}</p>
        {/* Event date with reduced opacity */}
        <p className="text-white/60 text-sm">{location}</p>
        {/* Event location with reduced opacity */}
      </div>
    </div>
  );
}
```

### 2. Navbar.jsx
**Development Contribution**: 
- Provides site-wide navigation functionality
- Implements responsive mobile menu
- Shows different menus based on user authentication
- Enables role-based navigation options
- Provides consistent branding across pages
- Handles user logout functionality
```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Link: Creates navigation links without page refresh
// useNavigate: Hook for programmatic navigation

import { useAuth } from '../hooks/useAuth';
// Custom hook to access authentication state

import { Menu, X, User, LogOut } from 'lucide-react';
// Icons from Lucide React library

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to control mobile menu visibility

  const { isAuthenticated, user, logout } = useAuth();
  // Gets authentication state and logout function

  const navigate = useNavigate();
  // Hook for navigation

  const handleLogout = async () => {
    // Function to handle user logout
    await logout();
    // Calls logout function from auth context
    navigate('/');
    // Redirects to home page after logout
    setIsMenuOpen(false);
    // Closes mobile menu
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Toggles mobile menu open/closed
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-er-dark/95 backdrop-blur-sm border-b border-white/10">
      {/* Fixed navigation bar with dark background and blur effect */}
      
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Container with max width and padding */}
        
        <div className="flex items-center justify-between">
          {/* Flex container for navbar content */}
          
          <Link to="/" className="font-heading text-2xl font-bold gradient-text">
            EventRift
          </Link>
          {/* Logo/brand name with gradient text */}

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Desktop menu - hidden on mobile, flex on medium screens and up */}
            
            <Link to="/" className="text-er-text hover:text-er-primary transition-colors">
              Home
            </Link>
            {/* Home link with hover effect */}
            
            {isAuthenticated ? (
              // If user is logged in, show authenticated menu
              <>
                <Link to="/events" className="text-er-text hover:text-er-primary transition-colors">
                  Events
                </Link>
                {/* Events link */}
                
                <div className="relative group">
                  {/* Dropdown container */}
                  <button className="flex items-center text-er-text hover:text-er-primary transition-colors">
                    <User className="w-4 h-4 mr-2" />
                    {user?.username || 'User'}
                  </button>
                  {/* User button with icon and username */}
                  
                  <div className="absolute right-0 mt-2 w-48 bg-er-gray rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {/* Dropdown menu - appears on hover */}
                    
                    <Link to={`/${user?.role?.toLowerCase()}/dashboard`} className="block px-4 py-2 text-er-text hover:bg-er-primary/20 rounded-t-lg">
                      Dashboard
                    </Link>
                    {/* Dashboard link - route changes based on user role */}
                    
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-er-text hover:bg-er-primary/20 rounded-b-lg flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                    {/* Logout button */}
                  </div>
                </div>
              </>
            ) : (
              // If user is not logged in, show login/signup links
              <>
                <Link to="/login" className="text-er-text hover:text-er-primary transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-er-text">
            {/* Mobile menu toggle - only visible on small screens */}
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            {/* Shows X when menu is open, hamburger when closed */}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            {/* Mobile menu - only shown when isMenuOpen is true */}
            {/* Similar structure to desktop menu but in vertical layout */}
          </div>
        )}
      </div>
    </nav>
  );
};
```

### 3. Hero.jsx
**Development Contribution**: 
- Creates compelling landing page experience
- Implements animated visual elements
- Provides clear call-to-action buttons
- Displays key statistics and features
- Establishes brand identity and messaging
- Encourages user engagement and conversion
```javascript
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full-screen hero section with centered content */}
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-er-primary/20 via-er-dark to-er-secondary/20"></div>
      {/* Gradient background overlay */}
      
      <div className="absolute inset-0 bg-[url('/assets/images/hero-pattern.svg')] opacity-10"></div>
      {/* Pattern background with low opacity */}

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-er-primary/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-er-secondary/20 rounded-full blur-2xl animate-bounce"></div>
      {/* Decorative floating elements with animations */}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Content container with high z-index to appear above background */}
        
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in">
          Discover Amazing
          <br />
          <span className="gradient-text">Events</span>
        </h1>
        {/* Main heading with responsive text sizes and gradient text */}
        
        <p className="text-xl md:text-2xl text-er-text mb-8 max-w-3xl mx-auto animate-fade-in-delay">
          Connect with unforgettable experiences across Kenya. From music festivals to tech conferences, find your next adventure.
        </p>
        {/* Subtitle with animation delay */}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
          {/* Button container with responsive layout */}
          
          <Link to="/events" className="btn-primary text-lg px-8 py-4 flex items-center justify-center group">
            Explore Events
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          {/* Primary CTA button with hover animation */}
          
          <Link to="/signup" className="btn-secondary text-lg px-8 py-4">
            Join EventRift
          </Link>
          {/* Secondary CTA button */}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-delay-3">
          {/* Statistics grid with animation */}
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-8 h-8 text-er-primary mr-2" />
              <span className="text-3xl font-bold text-white">500+</span>
            </div>
            <p className="text-er-text">Events Listed</p>
          </div>
          {/* Events statistic */}
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-8 h-8 text-er-secondary mr-2" />
              <span className="text-3xl font-bold text-white">10K+</span>
            </div>
            <p className="text-er-text">Happy Attendees</p>
          </div>
          {/* Users statistic */}
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-8 h-8 text-er-accent mr-2" />
              <span className="text-3xl font-bold text-white">47</span>
            </div>
            <p className="text-er-text">Counties Covered</p>
          </div>
          {/* Locations statistic */}
        </div>
      </div>
    </section>
  );
}
```

---

## Data Layer

### events.js
**Development Contribution**: 
- Provides comprehensive event data structure
- Enables offline development without backend
- Serves as API fallback for reliability
- Defines data schema for events
- Supports development and testing phases
- Ensures app functionality even when API is down
```javascript
export const categories = ['All', 'Music', 'Technology', 'Art', 'Food', 'Business', 'Sports', 'Entertainment', 'Fashion', 'Education', 'Health', 'Cultural'];
// Array of event categories used for filtering

export const events = [
  // Array of event objects
  {
    id: 1,
    // Unique identifier for the event
    title: "Koroga Festival 2024",
    // Event name displayed to users
    date: "2024-12-15",
    // Event date in YYYY-MM-DD format
    start_time: "14:00",
    // Event start time in 24-hour format
    end_time: "23:00",
    // Event end time in 24-hour format
    location: "Nairobi Arboretum, Nairobi",
    // General location description
    venue_name: "Nairobi Arboretum",
    // Specific venue name
    address: "State House Avenue, Nairobi, Kenya",
    // Full address of the venue
    category: "Music",
    // Event category from categories array
    theme: "Festival",
    // Event theme/type
    ticket_price: 3500,
    // Regular ticket price in KES
    early_bird_price: 2800,
    // Discounted early bird price in KES
    max_attendees: 8000,
    // Maximum number of attendees allowed
    tickets_sold: 2400,
    // Number of tickets already sold
    image: "/assets/images/Koroga Festival.jpeg",
    // Path to event image
    description: "Kenya's premier music festival featuring local and international artists",
    // Event description
    rating: 4.7,
    // Event rating out of 5
    reviews_count: 156,
    // Number of reviews
    days_of_week: ["Sunday"]
    // Days when event occurs
  },
  // More event objects...
];
```

---

## Context & Hooks

### AuthContext.jsx
**Development Contribution**: 
- Manages global authentication state
- Eliminates prop drilling for auth data
- Provides centralized login/logout logic
- Enables role-based access control
- Simplifies authentication across components
- Handles token persistence and validation
```javascript
import React, { useState, useEffect, createContext } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);
// Creates React context for authentication

export const AuthProvider = ({ children }) => {
  // Provider component that wraps the app
  
  const [user, setUser] = useState(null);
  // State to store current user data
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to track if user is logged in
  
  const [loading, setLoading] = useState(true);
  // State to track if authentication is being checked

  useEffect(() => {
    // Effect runs when component mounts
    const initAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      const userData = localStorage.getItem('user_data');
      // Gets stored authentication data

      if (token && userData) {
        try {
          const profile = await authService.getProfile();
          // Verifies token with server
          setUser(profile.user || JSON.parse(userData));
          setIsAuthenticated(true);
          // Sets user as authenticated
        } catch (error) {
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('user_data');
          // Clears invalid authentication data
        }
      }
      setLoading(false);
      // Stops loading state
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    // Function to log in user
    try {
      const response = await authService.login(credentials);
      // Calls login service
      const { token, user } = response;
      
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      // Stores authentication data
      
      setUser(user);
      setIsAuthenticated(true);
      // Updates state
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    // Function to log out user
    try {
      await authService.logout();
      // Notifies server
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_data');
      // Clears stored data
      setUser(null);
      setIsAuthenticated(false);
      // Updates state
    }
  };

  const hasRole = (role) => isAuthenticated && user?.role?.toLowerCase() === role.toLowerCase();
  // Function to check if user has specific role

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      hasRole, 
      login, 
      logout, 
      register,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
    // Provides authentication state and functions to child components
  );
};
```

### useAuth.js
**Development Contribution**: 
- Provides clean interface to authentication state
- Ensures proper context usage with error handling
- Simplifies authentication logic in components
- Enables consistent auth patterns across app
- Reduces boilerplate code in components
- Improves code readability and maintainability
```javascript
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  // Custom hook function
  const context = useContext(AuthContext);
  // Gets authentication context
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
    // Throws error if used outside AuthProvider
  }
  
  return context;
  // Returns authentication state and functions
};
```

---

## Pages

### LoginPage.jsx
**Development Contribution**: 
- Provides secure user authentication interface
- Implements form validation and error handling
- Handles password visibility toggle for UX
- Manages loading states during authentication
- Redirects users after successful login
- Integrates with global authentication system
```javascript
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email_or_username: '',
    password: ''
  });
  // State to store form input values

  const [showPassword, setShowPassword] = useState(false);
  // State to toggle password visibility

  const [error, setError] = useState('');
  // State to store error messages

  const [loading, setLoading] = useState(false);
  // State to track form submission

  const { login, isAuthenticated } = useAuth();
  // Gets login function and authentication state

  const navigate = useNavigate();
  // Hook for navigation

  useEffect(() => {
    // Effect runs when authentication state changes
    if (isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/events';
      // Gets stored redirect path or defaults to events
      localStorage.removeItem('redirectAfterLogin');
      // Clears stored redirect path
      navigate(redirectPath);
      // Navigates to intended page
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    // Function to handle input changes
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Updates form data state
    setError('');
    // Clears any existing errors
  };

  const handleSubmit = async (e) => {
    // Function to handle form submission
    e.preventDefault();
    // Prevents default form submission
    
    if (!formData.email_or_username || !formData.password) {
      setError('Please fill in all fields');
      return;
      // Validates required fields
    }

    setLoading(true);
    setError('');
    // Sets loading state and clears errors

    try {
      const result = await login(formData);
      // Attempts to log in user
      
      if (!result.success) {
        setError(result.error);
        // Shows error if login failed
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      // Shows generic error message
    } finally {
      setLoading(false);
      // Stops loading state
    }
  };

  return (
    <div className="min-h-screen bg-er-dark flex items-center justify-center px-6 py-12">
      {/* Full-screen container with dark background */}
      
      <div className="max-w-md w-full">
        {/* Form container with max width */}
        
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-er-text">
            Sign in to your EventRift account
          </p>
        </div>
        {/* Header section */}

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Form with card styling */}
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {/* Error message display */}

          <div>
            <label className="block text-er-light text-sm font-semibold mb-2">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-er-text w-5 h-5" />
              <input
                type="text"
                name="email_or_username"
                value={formData.email_or_username}
                onChange={handleInputChange}
                className="input-field pl-10"
                placeholder="Enter your email or username"
                required
              />
            </div>
          </div>
          {/* Email/username input field with icon */}

          <div>
            <label className="block text-er-light text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-er-text w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-field pl-10 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-er-text hover:text-er-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {/* Password input field with visibility toggle */}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          {/* Submit button with loading state */}

          <div className="text-center">
            <p className="text-er-text">
              Don't have an account?{' '}
              <Link to="/signup" className="text-er-primary hover:text-pink-400 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
          {/* Link to signup page */}
        </form>
      </div>
    </div>
  );
};
```

---

## Configuration Files

### package.json
**Development Contribution**: 
- Defines all project dependencies and versions
- Provides development and build scripts
- Enables package management and updates
- Specifies project metadata and configuration
- Ensures consistent development environment
- Manages both runtime and development dependencies
```json
{
  "name": "eventrift-client",
  // Project name
  "private": true,
  // Prevents accidental publishing to npm
  "version": "0.0.0",
  // Project version
  "type": "module",
  // Uses ES modules instead of CommonJS
  "scripts": {
    "dev": "vite",
    // Starts development server
    "build": "vite build",
    // Builds project for production
    "lint": "eslint .",
    // Runs code linting
    "preview": "vite preview"
    // Previews production build
  },
  "dependencies": {
    // Runtime dependencies
    "react": "^19.1.1",
    // React library for UI
    "react-dom": "^19.1.1",
    // React DOM rendering
    "react-router-dom": "^6.28.0",
    // Client-side routing
    "axios": "^1.7.7",
    // HTTP client for API calls
    "lucide-react": "^0.460.0",
    // Icon library
    "react-hook-form": "^7.65.0"
    // Form handling library
  },
  "devDependencies": {
    // Development-only dependencies
    "vite": "npm:rolldown-vite@7.1.14",
    // Build tool
    "tailwindcss": "^3.4.15",
    // CSS framework
    "eslint": "^9.36.0"
    // Code linting tool
  }
}
```

### vite.config.js
**Development Contribution**: 
- Configures fast development server with HMR
- Optimizes build process for production
- Enables React support and JSX transformation
- Manages asset handling and optimization
- Provides development and production configurations
- Ensures efficient bundling and code splitting
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Enables React support
  base: '/',
  // Sets base URL for the app
  build: {
    assetsDir: 'assets',
    // Directory for built assets
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
        // Naming pattern for built assets
      }
    }
  }
})
```

---

## Key Features Explained

### 1. Authentication System
- **JWT Token Storage**: Tokens stored in localStorage for persistence
- **Role-Based Access**: Different dashboards for Goers, Organizers, and Vendors
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Automatic logout on token expiration

### 2. Event Management
- **CRUD Operations**: Create, Read, Update, Delete events
- **Image Handling**: Proper image loading with fallbacks
- **Category Filtering**: Filter events by category
- **Local Fallback**: Uses local data when API is unavailable

### 3. Payment Integration
- **M-Pesa Integration**: Mobile money payment processing
- **Demo Mode**: Simulated payments for development
- **Transaction Tracking**: Payment status monitoring

### 4. UI/UX Features
- **Responsive Design**: Works on all device sizes
- **Dark Theme**: Modern dark color scheme
- **Animations**: Smooth transitions and hover effects
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages

### 5. Technical Architecture
- **Component-Based**: Reusable React components
- **Service Layer**: Separated API logic
- **Context API**: Global state management
- **Custom Hooks**: Reusable logic
- **TypeScript Ready**: Prepared for type safety

## Complete File Contributions to Development

### Core Application Files

**main.jsx**
- **What it does**: Bootstraps the React application
- **Development value**: Provides the foundation for all React functionality
- **Adds to development**: Hot module replacement, development mode features, error boundaries

**App.jsx**
- **What it does**: Sets up routing, authentication, and main layout
- **Development value**: Creates the application's navigation backbone
- **Adds to development**: Protected routes, role-based access, consistent layout structure

**index.css**
- **What it does**: Defines global styles and Tailwind CSS imports
- **Development value**: Establishes design system and styling foundation
- **Adds to development**: Consistent theming, responsive design utilities, custom CSS variables

### Service Layer Files

**api.js**
- **What it does**: Configures HTTP client with interceptors
- **Development value**: Centralizes API communication logic
- **Adds to development**: Automatic token handling, error interception, request logging

**authService.js**
- **What it does**: Manages user authentication operations
- **Development value**: Abstracts auth complexity from components
- **Adds to development**: Secure token management, session persistence, error handling

**eventsService.js**
- **What it does**: Handles all event-related API operations
- **Development value**: Provides reliable event data management
- **Adds to development**: Offline fallbacks, CRUD operations, data transformation

**paymentsService.js**
- **What it does**: Manages payment processing with M-Pesa
- **Development value**: Handles complex payment workflows
- **Adds to development**: Demo mode for testing, transaction tracking, error recovery

**vendorService.js**
- **What it does**: Manages vendor-specific operations
- **Development value**: Separates vendor logic from other services
- **Adds to development**: Service management, vendor profiles, specialized workflows

### Component Files

**Navbar.jsx**
- **What it does**: Provides site navigation with auth awareness
- **Development value**: Creates consistent navigation experience
- **Adds to development**: Responsive menus, role-based navigation, user feedback

**Hero.jsx**
- **What it does**: Creates engaging landing page section
- **Development value**: Establishes first impression and branding
- **Adds to development**: Animations, call-to-actions, statistics display

**EventCard.jsx**
- **What it does**: Displays event information in card format
- **Development value**: Reusable component for event display
- **Adds to development**: Image fallbacks, hover effects, consistent styling

**Footer.jsx**
- **What it does**: Provides site footer with links and information
- **Development value**: Completes page layout and provides navigation
- **Adds to development**: Social links, legal information, site map

**HomePage.jsx**
- **What it does**: Combines components for landing page
- **Development value**: Creates cohesive user experience
- **Adds to development**: Component composition, page structure, user flow

### Page Components

**LoginPage.jsx**
- **What it does**: Provides user authentication interface
- **Development value**: Secure user access to application
- **Adds to development**: Form validation, error handling, redirect logic

**SignupPage.jsx**
- **What it does**: Handles new user registration
- **Development value**: User onboarding and account creation
- **Adds to development**: Multi-step forms, role selection, validation

**EventsPage.jsx**
- **What it does**: Lists and filters available events
- **Development value**: Main event discovery interface
- **Adds to development**: Search functionality, filtering, pagination

**EventDetailPage.jsx**
- **What it does**: Shows detailed event information
- **Development value**: Complete event presentation and booking
- **Adds to development**: Image galleries, booking integration, reviews

### Dashboard Components

**GoerDashboard.jsx**
- **What it does**: Event attendee dashboard and ticket management
- **Development value**: User-specific event management
- **Adds to development**: Ticket history, event recommendations, profile management

**OrganizerDashboard.jsx**
- **What it does**: Event organizer management interface
- **Development value**: Event creation and management tools
- **Adds to development**: Analytics, event editing, attendee management

**VendorDashboard.jsx**
- **What it does**: Vendor service management interface
- **Development value**: Business tools for service providers
- **Adds to development**: Service listings, booking management, revenue tracking

### Context and Hook Files

**AuthContext.jsx**
- **What it does**: Manages global authentication state
- **Development value**: Eliminates prop drilling for auth data
- **Adds to development**: Centralized state, automatic updates, role management

**useAuth.js**
- **What it does**: Provides hook interface to auth context
- **Development value**: Clean component integration with auth
- **Adds to development**: Type safety, error handling, consistent API

### Data Files

**events.js**
- **What it does**: Contains static event data and categories
- **Development value**: Enables offline development and testing
- **Adds to development**: Data structure definition, fallback content, development data

### Configuration Files

**package.json**
- **What it does**: Defines project dependencies and scripts
- **Development value**: Manages project setup and build process
- **Adds to development**: Dependency management, build scripts, project metadata

**vite.config.js**
- **What it does**: Configures Vite build tool and development server
- **Development value**: Optimizes development and build processes
- **Adds to development**: Hot reload, build optimization, plugin configuration

**tailwind.config.js**
- **What it does**: Configures Tailwind CSS framework
- **Development value**: Customizes styling system for project needs
- **Adds to development**: Custom colors, responsive breakpoints, design tokens

### Utility Files

**apiTest.js**
- **What it does**: Provides testing utilities for API services
- **Development value**: Enables service verification and debugging
- **Adds to development**: Automated testing, service monitoring, development tools

## Overall Development Impact

Each file contributes to creating a:
- **Scalable Architecture**: Modular components and services
- **Maintainable Codebase**: Clear separation of concerns
- **Robust User Experience**: Error handling and fallbacks
- **Developer-Friendly Environment**: Hot reload, testing tools, clear structure
- **Production-Ready Application**: Optimized builds, security features, performance

This comprehensive file structure enables efficient development, easy maintenance, and seamless user experience across the EventRift platform.