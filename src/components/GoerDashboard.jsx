import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Star, Ticket, History, MessageSquare, TrendingUp } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { useAuth } from '../hooks/useAuth';

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
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchGoerData();
  }, []);

  const fetchGoerData = async () => {
    try {
      setLoading(true);
      // Fetch user's tickets and events
      const response = await eventsService.getUserTickets(user.id);
      setTickets(response.tickets || []);
      
      // Calculate stats
      const totalTickets = response.tickets?.length || 0;
      const now = new Date();
      const upcomingEvents = response.tickets?.filter(ticket => new Date(ticket.event.date) > now).length || 0;
      const attendedEvents = response.tickets?.filter(ticket => new Date(ticket.event.date) < now).length || 0;
      const totalSpent = response.tickets?.reduce((sum, ticket) => sum + (ticket.total_amount || 0), 0) || 0;
      
      setStats({ totalTickets, upcomingEvents, attendedEvents, totalSpent });
    } catch (error) {
      console.error('Failed to fetch goer data:', error);
      // Use mock data for demo
      const mockTickets = [
        {
          id: 1,
          event: {
            id: 1,
            title: "AfroBeats Festival 2024",
            date: "2024-12-15",
            venue_name: "Uhuru Gardens",
            image: "🎵"
          },
          quantity: 2,
          total_amount: 5000,
          status: "confirmed",
          purchase_date: "2024-11-01"
        }
      ];
      setTickets(mockTickets);
      setStats({ totalTickets: 1, upcomingEvents: 1, attendedEvents: 0, totalSpent: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (eventId) => {
    try {
      await eventsService.submitReview(eventId, {
        user_id: user.id,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      setReviewModal(null);
      setReviewData({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = "text-er-primary" }) => (
    <div className="card hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-er-text text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const TicketCard = ({ ticket }) => {
    const isUpcoming = new Date(ticket.event.date) > new Date();
    const isPast = new Date(ticket.event.date) < new Date();
    
    return (
      <div className="card hover:transform hover:scale-105 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="text-4xl mr-4">{ticket.event.image || '🎉'}</div>
            <div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-1">
                {ticket.event.title}
              </h3>
              <p className="text-er-text flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(ticket.event.date).toLocaleDateString()}
              </p>
              <p className="text-er-text flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                {ticket.event.venue_name}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            ticket.status === 'confirmed' ? 'bg-green-900/30 text-green-300' :
            ticket.status === 'pending' ? 'bg-yellow-900/30 text-yellow-300' :
            'bg-red-900/30 text-red-300'
          }`}>
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-er-text text-sm">Tickets</p>
            <p className="text-er-primary font-bold">{ticket.quantity}</p>
          </div>
          <div>
            <p className="text-er-text text-sm">Total Paid</p>
            <p className="text-er-secondary font-bold">KES {ticket.total_amount?.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Link
            to={`/events/${ticket.event.id}`}
            className="text-er-primary hover:text-pink-400 font-semibold"
          >
            View Event
          </Link>
          
          {isPast && !ticket.reviewed && (
            <button
              onClick={() => setReviewModal(ticket.event)}
              className="bg-er-primary text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm"
            >
              Write Review
            </button>
          )}
          
          {isUpcoming && (
            <div className="flex space-x-2">
              <button className="bg-er-secondary text-white px-3 py-1 rounded text-sm hover:bg-teal-600 transition-colors">
                Add to Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const upcomingTickets = tickets.filter(ticket => new Date(ticket.event.date) > new Date());
  const pastTickets = tickets.filter(ticket => new Date(ticket.event.date) < new Date());

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
              Welcome back, {user?.username}! 🎉
            </h1>
            <p className="text-er-text">Track your events and create amazing memories</p>
          </div>
          <Link to="/events" className="btn-primary flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Browse Events
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Ticket}
            title="Total Tickets"
            value={stats.totalTickets}
            color="text-er-primary"
          />
          <StatCard
            icon={Calendar}
            title="Upcoming Events"
            value={stats.upcomingEvents}
            color="text-er-secondary"
          />
          <StatCard
            icon={History}
            title="Events Attended"
            value={stats.attendedEvents}
            color="text-er-accent"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Spent"
            value={`KES ${stats.totalSpent.toLocaleString()}`}
            color="text-green-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-er-gray rounded-lg p-1">
          {[
            { id: 'upcoming', label: 'Upcoming Events', icon: Calendar },
            { id: 'history', label: 'Event History', icon: History },
            { id: 'reviews', label: 'My Reviews', icon: MessageSquare }
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
        {activeTab === 'upcoming' && (
          <div>
            {upcomingTickets.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-er-text mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-er-light mb-2">No upcoming events</h3>
                <p className="text-er-text mb-6">Discover amazing events happening near you</p>
                <Link to="/events" className="btn-primary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {pastTickets.length === 0 ? (
              <div className="text-center py-16">
                <History className="w-16 h-16 text-er-text mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-er-light mb-2">No past events</h3>
                <p className="text-er-text">Your event history will appear here</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">My Reviews</h2>
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 text-er-text mx-auto mb-4" />
              <h3 className="text-xl font-bold text-er-light mb-2">Reviews Coming Soon</h3>
              <p className="text-er-text">Your event reviews will be displayed here</p>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-er-gray rounded-xl p-8 max-w-md w-full">
            <h3 className="font-heading text-2xl font-bold text-er-light mb-4">
              Review: {reviewModal.title}
            </h3>
            
            <div className="mb-6">
              <label className="block text-er-light font-semibold mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewData({...reviewData, rating: star})}
                    className={`text-2xl ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-er-light font-semibold mb-2">Comment</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                rows={4}
                className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg text-er-light"
                placeholder="Share your experience..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleReviewSubmit(reviewModal.id)}
                className="btn-primary flex-1"
              >
                Submit Review
              </button>
              <button
                onClick={() => setReviewModal(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoerDashboard;