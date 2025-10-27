import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Clock, Star, Share2, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { useAuth } from '../hooks/useAuth';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Mock event data for fallback
  const mockEvent = {
    id: eventId,
    title: "AfroBeats Festival 2024",
    description: "The biggest Afrobeats celebration in East Africa featuring top artists from across the continent.",
    category: "Music",
    theme: "Festival",
    date: "2024-12-15",
    start_time: "18:00",
    end_time: "23:00",
    venue_name: "Uhuru Gardens",
    address: "Uhuru Gardens, Nairobi, Kenya",
    ticket_price: 2500,
    early_bird_price: 2000,
    max_attendees: 5000,
    tickets_sold: 1200,
    rating: 4.5,
    reviews_count: 89,
    dress_code: "Casual/Festival Wear",
    what_to_expect: "Live performances from top Afrobeats artists, food vendors, art installations, and an unforgettable night of music and culture.",
    services_available: "Free parking, Food & beverages, Security, First aid, WiFi, Cloakroom services",
    terms_conditions: "No outside food or drinks. Age restriction: 18+. Tickets are non-refundable. Valid ID required for entry.",
    organizer: {
      name: "EventRift Organizers",
      rating: 4.8,
      events_count: 25
    },
    image: "🎵",
    status: "active"
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventsService.getEvent(eventId);
      setEvent(response.event || response);
    } catch (err) {
      console.error('Failed to fetch event:', err);
      setError('Failed to load event details');
      // Use mock data as fallback
      setEvent(mockEvent);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTicket = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/events/${eventId}/checkout`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: API call to save/remove favorite
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-er-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-er-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-er-light">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-er-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-er-light mb-2">Event Not Found</h2>
          <p className="text-er-text mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/events" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const ticketsRemaining = event.max_attendees - (event.tickets_sold || 0);
  const isEarlyBird = event.early_bird_price && new Date() < new Date(event.date);
  const currentPrice = isEarlyBird ? event.early_bird_price : event.ticket_price;

  return (
    <div className="min-h-screen bg-er-dark pt-20">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-er-primary/20 to-er-secondary/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-er-text hover:text-er-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Event Image */}
            <div className="lg:col-span-1">
              <div className="relative bg-gradient-to-br from-er-primary/30 to-er-secondary/30 rounded-xl h-80 flex items-center justify-center">
                <div className="text-8xl">{event.image || '🎉'}</div>
                <div className="absolute top-4 left-4 bg-er-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
                {event.theme && (
                  <div className="absolute top-4 right-4 bg-er-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.theme}
                  </div>
                )}
              </div>
            </div>

            {/* Event Info */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-er-light">
                  {event.title}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-lg transition-colors ${
                      isFavorited ? 'bg-red-600 text-white' : 'bg-er-gray text-er-text hover:text-red-400'
                    }`}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-er-gray text-er-text hover:text-er-primary rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-er-text text-lg mb-6 leading-relaxed">
                {event.description}
              </p>

              {/* Event Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-er-text">
                  <Calendar className="w-5 h-5 mr-3 text-er-primary" />
                  <div>
                    <p className="font-semibold text-er-light">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-er-text">
                  <Clock className="w-5 h-5 mr-3 text-er-primary" />
                  <div>
                    <p className="font-semibold text-er-light">
                      {event.start_time} {event.end_time && `- ${event.end_time}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-er-text">
                  <MapPin className="w-5 h-5 mr-3 text-er-primary" />
                  <div>
                    <p className="font-semibold text-er-light">{event.venue_name}</p>
                    <p className="text-sm">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-center text-er-text">
                  <Users className="w-5 h-5 mr-3 text-er-primary" />
                  <div>
                    <p className="font-semibold text-er-light">
                      {event.tickets_sold || 0} / {event.max_attendees || 'Unlimited'} attending
                    </p>
                    <p className="text-sm">{ticketsRemaining > 0 ? `${ticketsRemaining} tickets left` : 'Sold out'}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              {event.rating && (
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(event.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-er-light font-semibold">{event.rating}</span>
                  <span className="ml-1 text-er-text">({event.reviews_count || 0} reviews)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* What to Expect */}
            {event.what_to_expect && (
              <div className="card">
                <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">What to Expect</h2>
                <p className="text-er-text leading-relaxed">{event.what_to_expect}</p>
              </div>
            )}

            {/* Services Available */}
            {event.services_available && (
              <div className="card">
                <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">Services Available</h2>
                <div className="grid md:grid-cols-2 gap-2">
                  {event.services_available.split(',').map((service, index) => (
                    <div key={index} className="flex items-center text-er-text">
                      <div className="w-2 h-2 bg-er-primary rounded-full mr-3"></div>
                      {service.trim()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {event.dress_code && (
                <div className="card">
                  <h3 className="font-heading text-lg font-semibold text-er-light mb-2">Dress Code</h3>
                  <p className="text-er-text">{event.dress_code}</p>
                </div>
              )}

              {event.organizer && (
                <div className="card">
                  <h3 className="font-heading text-lg font-semibold text-er-light mb-2">Organizer</h3>
                  <p className="text-er-text font-semibold">{event.organizer.name}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-er-text text-sm">{event.organizer.rating} • {event.organizer.events_count} events</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            {event.terms_conditions && (
              <div className="card">
                <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">Terms and Conditions</h2>
                <p className="text-er-text leading-relaxed">{event.terms_conditions}</p>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-er-primary mr-2" />
                  <span className="text-3xl font-bold text-er-primary">
                    KES {currentPrice?.toLocaleString()}
                  </span>
                </div>
                {isEarlyBird && (
                  <div className="text-sm text-er-secondary">
                    Early Bird Price! Regular: KES {event.ticket_price?.toLocaleString()}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm text-center">
                  {error}
                </div>
              )}

              {ticketsRemaining > 0 ? (
                <button
                  onClick={handleBookTicket}
                  className="btn-primary w-full text-lg py-4 flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Book Ticket
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-600 text-gray-300 font-semibold py-4 rounded-lg cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}

              <div className="mt-4 text-center text-sm text-er-text">
                <p>Secure payment with M-Pesa</p>
                <p className="mt-1">Instant ticket confirmation</p>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-er-text text-sm">Tickets Sold</p>
                    <p className="text-er-primary font-bold text-lg">{event.tickets_sold || 0}</p>
                  </div>
                  <div>
                    <p className="text-er-text text-sm">Remaining</p>
                    <p className="text-er-secondary font-bold text-lg">{ticketsRemaining}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;