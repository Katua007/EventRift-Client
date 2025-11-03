// This file creates the dashboard page for event attendees (people who buy tickets)
// It shows their tickets, upcoming events, past events, and account statistics

// Import React and other libraries we need
import React, { useState, useEffect } from 'react'; // React hooks for managing component state and lifecycle
import { Link } from 'react-router-dom'; // For navigating between pages
// Import icons from lucide-react library
import { Calendar, Clock, MapPin, Star, Ticket, History, MessageSquare, TrendingUp, Search, Filter, Heart, Eye } from 'lucide-react';
// Import our custom hooks and services
import { useAuth } from '../hooks/useAuth'; // Hook to get current user information
import { TicketDetails } from './TicketDetails'; // Component to show detailed ticket information
import { eventsService } from '../services/eventsService'; // Service to communicate with backend about events
import api from '../services/api'; // API service for direct calls

// Main component for the goer (attendee) dashboard
const GoerDashboard = () => {
  // Get current user information from authentication
  const { user } = useAuth();
  // Store the user's tickets
  const [tickets, setTickets] = useState([]);
  // Store statistics about the user's activity
  const [stats, setStats] = useState({
    totalTickets: 0, // Total number of tickets purchased
    upcomingEvents: 0, // Number of future events
    attendedEvents: 0, // Number of past events attended
    totalSpent: 0 // Total money spent on tickets
  });
  // Show loading spinner while fetching data
  const [loading, setLoading] = useState(true);
  // Track which tab is currently active (upcoming, history, favorites)
  const [activeTab, setActiveTab] = useState('upcoming');
  // Store search term for filtering events
  const [searchTerm, setSearchTerm] = useState('');
  // Store which ticket is selected for detailed view
  const [selectedTicket, setSelectedTicket] = useState(null);

  // This runs when the component loads to get the user's ticket data
  useEffect(() => {
    // Function to fetch user's ticket and event data from the server
    const fetchGoerData = async () => {
      try {
        // Show loading spinner while we fetch data
        setLoading(true);
        // Call the backend to get user's tickets
        const response = await eventsService.getUserTickets();
        console.log('Goer dashboard data:', response);

        // Transform the backend data to match our component structure
        const ticketsData = response.tickets || [];

        // Store the tickets in our component state
        setTickets(ticketsData);
        // Calculate and store statistics about the user's tickets
        const upcoming = ticketsData.filter(t => new Date(t.event?.date) > new Date()).length;
        const past = ticketsData.filter(t => new Date(t.event?.date) < new Date()).length;
        const totalSpent = ticketsData.reduce((sum, t) => sum + (t.total_amount || 0), 0);
        
        setStats({
          totalTickets: ticketsData.length,
          upcomingEvents: upcoming,
          attendedEvents: past,
          totalSpent: totalSpent
        });
      } catch (err) {
        // If something goes wrong, log the error
        console.error('Failed to fetch goer data:', err);
        // Set empty data as fallback
        setTickets([]);
        setStats({
          totalTickets: 0,
          upcomingEvents: 0,
          attendedEvents: 0,
          totalSpent: 0
        });
      } finally {
        // Always hide the loading spinner when done
        setLoading(false);
      }
    };

    // Only fetch data if we have a logged-in user
    if (user?.id) {
      fetchGoerData();
    }
  }, [user?.id]); // Re-run this effect if the user ID changes

  // This is a reusable component for displaying statistics cards
  const StatCard = ({ icon: Icon, title, value, color = "text-er-primary", bgColor = "bg-er-primary/10" }) => (
    <div className="card hover-lift animate-fade-in">
      <div className="flex items-center justify-between">
        {/* Left side - title and value */}
        <div>
          <p className="text-er-text text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        {/* Right side - icon in colored background */}
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
    </div>
  );

  // This component displays a single ticket in a card format
  const TicketCard = ({ ticket }) => {
    // Check if this event is in the future
    const isUpcoming = new Date(ticket.event.date) > new Date();

    return (
      <div className="card hover-lift animate-fade-in">
        {/* Top section with event info and status */}
        <div className="flex justify-between items-start mb-6">
          {/* Left side - event image and details */}
          <div className="flex items-center space-x-4">
            {/* Event image placeholder */}
            <div className="w-16 h-16 bg-gradient-to-br from-er-primary/30 to-er-secondary/30 rounded-2xl flex items-center justify-center text-3xl">
              {ticket.event.image || ''} {/* Show event emoji or empty */}
            </div>
            {/* Event title and details */}
            <div>
              <h3 className="font-heading text-xl font-bold text-er-light mb-2">
                {ticket.event.title} {/* Event name */}
              </h3>
              {/* Event date with calendar icon */}
              <div className="flex items-center text-er-text mb-1">
                <Calendar className="w-4 h-4 mr-2 text-er-primary" />
                {new Date(ticket.event.date).toLocaleDateString('en-US', {
                  weekday: 'short', // Show day name like "Mon"
                  year: 'numeric', // Show full year
                  month: 'short', // Show month name like "Jan"
                  day: 'numeric' // Show day number
                })}
              </div>
              {/* Event location with map pin icon */}
              <div className="flex items-center text-er-text">
                <MapPin className="w-4 h-4 mr-2 text-er-secondary" />
                {ticket.event.venue_name} {/* Venue name */}
              </div>
            </div>
          </div>
          {/* Right side - ticket status badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            ticket.status === 'confirmed' ? 'bg-er-success/20 text-er-success' : // Green for confirmed
            ticket.status === 'pending' ? 'bg-er-warning/20 text-er-warning' : // Yellow for pending
            'bg-er-error/20 text-er-error' // Red for other statuses
          }`}>
            {ticket.status.toUpperCase()} {/* Show status in uppercase */}
          </span>
        </div>

        {/* Middle section - ticket quantity and total cost */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Number of tickets purchased */}
          <div className="text-center p-4 bg-er-dark/50 rounded-xl">
            <p className="text-er-text text-sm mb-1">Tickets</p>
            <p className="text-2xl font-bold text-er-primary">{ticket.quantity}</p>
          </div>
          {/* Total amount paid for tickets */}
          <div className="text-center p-4 bg-er-dark/50 rounded-xl">
            <p className="text-er-text text-sm mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-er-secondary">KES {ticket.total_amount?.toLocaleString()}</p>
          </div>
        </div>

        {/* Bottom section - action buttons */}
        <div className="flex justify-between items-center">
          {/* Link to view full event details */}
          <Link
            to={`/events/${ticket.event.id}`}
            className="text-er-primary hover:text-er-primary/80 font-semibold transition-colors"
          >
            View Event Details
          </Link>

          {/* Action buttons on the right */}
          <div className="flex space-x-2">
            {/* Button to view detailed ticket information */}
            <button
              onClick={() => setSelectedTicket(ticket)} // Open ticket details modal
              className="btn-primary text-sm px-4 py-2 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Ticket
            </button>
            {/* Only show favorites button for upcoming events */}
            {isUpcoming && (
              <button
                onClick={() => alert('Add to favorites coming soon!')} // Placeholder for future feature
                className="btn-outline text-sm px-4 py-2"
              >
                <Heart className="w-4 h-4 mr-2" />
                Add to Favorites
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Filter tickets into upcoming and past events
  const upcomingTickets = tickets.filter(ticket => new Date(ticket.event.date) > new Date()); // Future events
  const pastTickets = tickets.filter(ticket => new Date(ticket.event.date) < new Date()); // Past events

  // Apply search filter to upcoming tickets
  const filteredUpcoming = upcomingTickets.filter(ticket =>
    ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase()) // Match search term in event title
  );

  // Apply search filter to past tickets
  const filteredPast = pastTickets.filter(ticket =>
    ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase()) // Match search term in event title
  );

  // Show loading screen while fetching data from the server
  if (loading) {
    return (
      <div className="min-h-screen bg-er-dark pt-20 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          {/* Animated loading spinner */}
          <div className="w-16 h-16 bg-gradient-to-r from-er-primary to-er-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          {/* Loading message */}
          <p className="text-er-light text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Main dashboard content - only shown after loading is complete
  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header section with welcome message and discover button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 animate-fade-in">
          {/* Left side - welcome message */}
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-er-light mb-3">
              Welcome back, <span className="gradient-text">{user?.name || user?.username}</span>!
            </h1>
            <p className="text-xl text-er-text">Track your events and create amazing memories</p>
          </div>
          {/* Right side - button to discover more events */}
          <Link to="/events" className="btn-primary flex items-center mt-6 lg:mt-0 hover-lift">
            <Search className="w-5 h-5 mr-2" />
            Discover Events
          </Link>
        </div>

        {/* Statistics cards showing user's activity summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total number of tickets purchased */}
          <StatCard
            icon={Ticket}
            title="Total Tickets"
            value={stats.totalTickets}
            color="text-er-primary"
            bgColor="bg-er-primary/10"
          />
          {/* Number of upcoming events */}
          <StatCard
            icon={Calendar}
            title="Upcoming Events"
            value={stats.upcomingEvents}
            color="text-er-secondary"
            bgColor="bg-er-secondary/10"
          />
          {/* Number of past events attended */}
          <StatCard
            icon={History}
            title="Events Attended"
            value={stats.attendedEvents}
            color="text-er-accent"
            bgColor="bg-er-accent/10"
          />
          {/* Total money spent on tickets */}
          <StatCard
            icon={TrendingUp}
            title="Total Spent"
            value={`KES ${stats.totalSpent.toLocaleString()}`}
            color="text-er-success"
            bgColor="bg-er-success/10"
          />
        </div>

        {/* Search bar and filter button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
          {/* Search input field */}
          <div className="relative flex-1">
            {/* Search icon inside the input */}
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-er-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search your events..." // Placeholder text
              value={searchTerm} // Current search value
              onChange={(e) => setSearchTerm(e.target.value)} // Update search when user types
              className="input-field pl-12 pr-4" // Left padding for icon
            />
          </div>
          {/* Filter button (placeholder for future feature) */}
          <button
            onClick={() => alert('Filter functionality coming soon!')}
            className="btn-outline flex items-center px-6"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex space-x-1 mb-8 bg-er-gray rounded-2xl p-1 animate-fade-in">
          {/* Map through tab definitions to create buttons */}
          {[
            { id: 'upcoming', label: 'Upcoming Events', icon: Calendar, count: upcomingTickets.length },
            { id: 'history', label: 'Event History', icon: History, count: pastTickets.length },
            { id: 'favorites', label: 'Favorites', icon: Heart, count: 0 }
          ].map(tab => (
            <button
              key={tab.id} // Unique key for React
              onClick={() => setActiveTab(tab.id)} // Change active tab when clicked
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id // Different styles for active vs inactive tabs
                  ? 'bg-gradient-to-r from-er-primary to-er-secondary text-white shadow-glow' // Active tab style
                  : 'text-er-text hover:text-er-primary hover:bg-er-primary/5' // Inactive tab style
              }`}
            >
              {/* Tab icon */}
              <tab.icon className="w-5 h-5 mr-2" />
              {/* Tab label */}
              {tab.label}
              {/* Show count badge if count > 0 */}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-er-primary/20 text-er-primary'
                }`}>
                  {tab.count} {/* Number to display */}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content that changes based on which tab is selected */}
        {/* Show upcoming events tab */}
        {activeTab === 'upcoming' && (
          <div>
            {/* If no upcoming events, show empty state */}
            {filteredUpcoming.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                {/* Empty state icon */}
                <div className="w-24 h-24 bg-gradient-to-r from-er-primary/20 to-er-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-er-primary" />
                </div>
                {/* Empty state message */}
                <h3 className="text-3xl font-bold text-er-light mb-4">No upcoming events</h3>
                <p className="text-er-text text-lg mb-8 max-w-md mx-auto">
                  Discover amazing events happening near you and start creating memories
                </p>
                {/* Button to browse events */}
                <Link to="/events" className="btn-primary hover-lift">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Events
                </Link>
              </div>
            ) : (
              /* If there are upcoming events, show them in a grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredUpcoming.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show event history tab */}
        {activeTab === 'history' && (
          <div>
            {/* If no past events, show empty state */}
            {filteredPast.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                {/* Empty state icon */}
                <div className="w-24 h-24 bg-gradient-to-r from-er-accent/20 to-er-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="w-12 h-12 text-er-accent" />
                </div>
                {/* Empty state message */}
                <h3 className="text-3xl font-bold text-er-light mb-4">No past events</h3>
                <p className="text-er-text text-lg">Your event history will appear here</p>
              </div>
            ) : (
              /* If there are past events, show them in a grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPast.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show favorites tab */}
        {activeTab === 'favorites' && (
          <div className="text-center py-20 animate-fade-in">
            {/* Empty state icon */}
            <div className="w-24 h-24 bg-gradient-to-r from-er-primary/20 to-er-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-er-primary" />
            </div>
            {/* Empty state message */}
            <h3 className="text-3xl font-bold text-er-light mb-4">No favorites yet</h3>
            <p className="text-er-text text-lg mb-8 max-w-md mx-auto">
              Save events you love to easily find them later
            </p>
            {/* Button to find events to favorite */}
            <Link to="/events" className="btn-primary hover-lift">
              <Search className="w-5 h-5 mr-2" />
              Find Events to Love
            </Link>
          </div>
        )}
      </div>

      {/* Modal popup to show detailed ticket information */}
      {selectedTicket && (
        <TicketDetails
          ticket={selectedTicket} // Pass the selected ticket data
          onClose={() => setSelectedTicket(null)} // Function to close the modal
        />
      )}
    </div>
  );
};

// Export the component so it can be used in other files
export default GoerDashboard;