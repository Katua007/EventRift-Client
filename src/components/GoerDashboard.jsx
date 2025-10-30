import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, Ticket, History, MessageSquare, TrendingUp, Search, Filter, Heart, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { TicketDetails } from './TicketDetails';

const GoerDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalTickets: 0,
    upcomingEvents: 0,
    attendedEvents: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchGoerData = async () => {
      try {
        setLoading(true);
        // Mock data for demo
        const mockTickets = [
          {
            id: 1,
            event: {
              id: 1,
              title: "AfroBeats Festival 2024",
              date: "2024-12-15",
              start_time: "18:00",
              end_time: "23:00",
              venue_name: "Uhuru Gardens",
              address: "Langata Road, Nairobi, Kenya",
              image: "🎵",
              category: "Music",
              dress_code: "Casual/Festival Wear"
            },
            quantity: 2,
            total_amount: 5000,
            totalPaid: 5000,
            transactionId: "TXN-1699123456789",
            status: "confirmed",
            purchase_date: "2024-11-01"
          },
          {
            id: 2,
            event: {
              id: 2,
              title: "Tech Conference Kenya",
              date: "2025-01-20",
              start_time: "08:00",
              end_time: "18:00",
              venue_name: "KICC",
              address: "Harambee Avenue, Nairobi, Kenya",
              image: "💻",
              category: "Technology",
              dress_code: "Business Casual"
            },
            quantity: 1,
            total_amount: 8000,
            totalPaid: 8000,
            transactionId: "TXN-1700234567890",
            status: "confirmed",
            purchase_date: "2024-11-15"
          }
        ];
        
        setTickets(mockTickets);
        setStats({
          totalTickets: 3,
          upcomingEvents: 2,
          attendedEvents: 1,
          totalSpent: 13000
        });
      } catch (err) {
        console.error('Failed to fetch goer data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchGoerData();
    }
  }, [user?.id]);

  const StatCard = ({ icon: Icon, title, value, color = "text-er-primary", bgColor = "bg-er-primary/10" }) => (
    <div className="card hover-lift animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-er-text text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
    </div>
  );

  const TicketCard = ({ ticket }) => {
    const isUpcoming = new Date(ticket.event.date) > new Date();

    return (
      <div className="card hover-lift animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-er-primary/30 to-er-secondary/30 rounded-2xl flex items-center justify-center text-3xl">
              {ticket.event.image || '🎉'}
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-er-light mb-2">
                {ticket.event.title}
              </h3>
              <div className="flex items-center text-er-text mb-1">
                <Calendar className="w-4 h-4 mr-2 text-er-primary" />
                {new Date(ticket.event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center text-er-text">
                <MapPin className="w-4 h-4 mr-2 text-er-secondary" />
                {ticket.event.venue_name}
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            ticket.status === 'confirmed' ? 'bg-er-success/20 text-er-success' :
            ticket.status === 'pending' ? 'bg-er-warning/20 text-er-warning' :
            'bg-er-error/20 text-er-error'
          }`}>
            {ticket.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center p-4 bg-er-dark/50 rounded-xl">
            <p className="text-er-text text-sm mb-1">Tickets</p>
            <p className="text-2xl font-bold text-er-primary">{ticket.quantity}</p>
          </div>
          <div className="text-center p-4 bg-er-dark/50 rounded-xl">
            <p className="text-er-text text-sm mb-1">Total Paid</p>
            <p className="text-2xl font-bold text-er-secondary">KES {ticket.total_amount?.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={`/events/${ticket.event.id}`}
            className="text-er-primary hover:text-er-primary/80 font-semibold transition-colors"
          >
            View Event Details
          </Link>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedTicket(ticket)}
              className="btn-primary text-sm px-4 py-2 flex items-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Ticket
            </button>
            {isUpcoming && (
              <button
                onClick={() => alert('Add to favorites coming soon!')}
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

  const upcomingTickets = tickets.filter(ticket => new Date(ticket.event.date) > new Date());
  const pastTickets = tickets.filter(ticket => new Date(ticket.event.date) < new Date());
  const filteredUpcoming = upcomingTickets.filter(ticket => 
    ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPast = pastTickets.filter(ticket => 
    ticket.event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-er-dark pt-20 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-r from-er-primary to-er-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
          <p className="text-er-light text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 animate-fade-in">
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-er-light mb-3">
              Welcome back, <span className="gradient-text">{user?.username}</span>! 🎉
            </h1>
            <p className="text-xl text-er-text">Track your events and create amazing memories</p>
          </div>
          <Link to="/events" className="btn-primary flex items-center mt-6 lg:mt-0 hover-lift">
            <Search className="w-5 h-5 mr-2" />
            Discover Events
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={Ticket}
            title="Total Tickets"
            value={stats.totalTickets}
            color="text-er-primary"
            bgColor="bg-er-primary/10"
          />
          <StatCard
            icon={Calendar}
            title="Upcoming Events"
            value={stats.upcomingEvents}
            color="text-er-secondary"
            bgColor="bg-er-secondary/10"
          />
          <StatCard
            icon={History}
            title="Events Attended"
            value={stats.attendedEvents}
            color="text-er-accent"
            bgColor="bg-er-accent/10"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Spent"
            value={`KES ${stats.totalSpent.toLocaleString()}`}
            color="text-er-success"
            bgColor="bg-er-success/10"
          />
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-er-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search your events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 pr-4"
            />
          </div>
          <button
            onClick={() => alert('Filter functionality coming soon!')}
            className="btn-outline flex items-center px-6"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-er-gray rounded-2xl p-1 animate-fade-in">
          {[
            { id: 'upcoming', label: 'Upcoming Events', icon: Calendar, count: upcomingTickets.length },
            { id: 'history', label: 'Event History', icon: History, count: pastTickets.length },
            { id: 'favorites', label: 'Favorites', icon: Heart, count: 0 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-er-primary to-er-secondary text-white shadow-glow'
                  : 'text-er-text hover:text-er-primary hover:bg-er-primary/5'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-er-primary/20 text-er-primary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'upcoming' && (
          <div>
            {filteredUpcoming.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-r from-er-primary/20 to-er-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-er-primary" />
                </div>
                <h3 className="text-3xl font-bold text-er-light mb-4">No upcoming events</h3>
                <p className="text-er-text text-lg mb-8 max-w-md mx-auto">
                  Discover amazing events happening near you and start creating memories
                </p>
                <Link to="/events" className="btn-primary hover-lift">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredUpcoming.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {filteredPast.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-r from-er-accent/20 to-er-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="w-12 h-12 text-er-accent" />
                </div>
                <h3 className="text-3xl font-bold text-er-light mb-4">No past events</h3>
                <p className="text-er-text text-lg">Your event history will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPast.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-r from-er-primary/20 to-er-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-er-primary" />
            </div>
            <h3 className="text-3xl font-bold text-er-light mb-4">No favorites yet</h3>
            <p className="text-er-text text-lg mb-8 max-w-md mx-auto">
              Save events you love to easily find them later
            </p>
            <Link to="/events" className="btn-primary hover-lift">
              <Search className="w-5 h-5 mr-2" />
              Find Events to Love
            </Link>
          </div>
        )}
      </div>
      
      {/* Ticket Details Modal */}
      {selectedTicket && (
        <TicketDetails 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );
};

export default GoerDashboard;