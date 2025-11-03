import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, DollarSign, Star, Eye, Edit, Trash2, TrendingUp } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { useAuth } from '../hooks/useAuth';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchOrganizerData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        console.log('🔄 OrganizerDashboard: Fetching organizer events...');
        const eventsResponse = await eventsService.getOrganizerEvents(user.id);
        console.log('✅ OrganizerDashboard: Events response:', eventsResponse);
        const organizerEvents = eventsResponse.events || [];
        setEvents(organizerEvents);

        const totalEvents = organizerEvents.length;
        const totalTicketsSold = organizerEvents.reduce((sum, event) => sum + (event.tickets_sold || 0), 0);
        const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event.revenue || 0), 0);
        const averageRating = totalEvents > 0 ?
          organizerEvents.reduce((sum, event) => sum + (event.rating || 0), 0) / totalEvents : 0;

        setStats({
          totalEvents,
          totalTicketsSold,
          totalRevenue,
          averageRating: averageRating.toFixed(1)
        });
        console.log('✅ OrganizerDashboard: Data loaded successfully');
      } catch (err) {
        console.error('❌ OrganizerDashboard: Failed to fetch organizer data:', err);
        setEvents([]);
        setStats({
          totalEvents: 0,
          totalTicketsSold: 0,
          totalRevenue: 0,
          averageRating: 0
        });
      } finally {
        setLoading(false);
      }
    };

    const handleEventCreated = (event) => {
      console.log('🔄 OrganizerDashboard: Event created/updated, refreshing data...');
      // Refresh dashboard data when an event is created
      fetchOrganizerData();
    };

    fetchOrganizerData();

    // Listen for event creation/update events
    window.addEventListener('eventCreated', handleEventCreated);
    window.addEventListener('eventUpdated', handleEventCreated);

    return () => {
      window.removeEventListener('eventCreated', handleEventCreated);
      window.removeEventListener('eventUpdated', handleEventCreated);
    };
  }, [user?.id]);



  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsService.deleteEvent(eventId);
        setEvents(events.filter(event => event.id !== eventId));
        // Show notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg bg-green-900/90 border border-green-700 text-green-300';
        notification.innerHTML = '<div class="flex items-center"><div class="mr-3">✅</div><div class="font-medium">Event deleted successfully!</div></div>';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const StatCard = ({ icon, title, value, color = "text-er-primary" }) => {
    const IconComponent = icon;
    return (
      <div className="card hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-er-text text-sm">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <IconComponent className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    );
  };

  const EventCard = ({ event }) => (
    <div className="card hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-heading text-xl font-semibold text-er-light mb-2">{event.title}</h3>
          <p className="text-er-text flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          event.status === 'active' ? 'bg-green-900/30 text-green-300' :
          event.status === 'completed' ? 'bg-blue-900/30 text-blue-300' :
          'bg-gray-900/30 text-gray-300'
        }`}>
          {event.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-er-text text-sm">Tickets Sold</p>
          <p className="text-er-primary font-bold">{event.tickets_sold || 0}/{event.max_attendees || 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-er-text text-sm">Revenue</p>
          <p className="text-er-secondary font-bold">KES {(event.revenue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-er-text">{event.rating || 'N/A'}</span>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/events/${event.id}`}
            className="p-2 bg-er-primary/20 text-er-primary rounded-lg hover:bg-er-primary/30 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            to={`/organizer/edit-event/${event.id}`}
            className="p-2 bg-er-secondary/20 text-er-secondary rounded-lg hover:bg-er-secondary/30 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button
            onClick={() => handleDeleteEvent(event.id)}
            className="p-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-er-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-er-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-er-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-er-light mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-er-text">Manage your events and track your success</p>
          </div>
          <Link
            to="/organizer/create-event"
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Events"
            value={stats.totalEvents}
            color="text-er-primary"
          />
          <StatCard
            icon={Users}
            title="Tickets Sold"
            value={stats.totalTicketsSold.toLocaleString()}
            color="text-er-secondary"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`KES ${stats.totalRevenue.toLocaleString()}`}
            color="text-er-accent"
          />
          <StatCard
            icon={Star}
            title="Average Rating"
            value={stats.averageRating}
            color="text-yellow-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-er-gray rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'events', label: 'My Events', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-er-primary text-white'
                  : 'text-er-text hover:text-er-primary'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-er-dark rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <div>
                    <p className="text-er-light">New ticket purchase for "Tech Conference 2024"</p>
                    <p className="text-er-text text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-er-dark rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-4"></div>
                  <div>
                    <p className="text-er-light">Event "Music Festival" received a 5-star review</p>
                    <p className="text-er-text text-sm">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            {events.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-er-text mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-er-light mb-2">No events yet</h3>
                <p className="text-er-text mb-6">Create your first event to get started</p>
                <Link to="/organizer/create-event" className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Event
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">Analytics Dashboard</h2>
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-er-text mx-auto mb-4" />
              <h3 className="text-xl font-bold text-er-light mb-2">Analytics Coming Soon</h3>
              <p className="text-er-text">Detailed analytics and insights will be available here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;