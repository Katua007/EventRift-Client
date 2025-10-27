import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { eventsService } from '../services/eventsService';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackEvents = [
    {
      id: 1,
      title: "AfroBeats Festival 2024",
      date: "Dec 15, 2024",
      location: "Nairobi, Kenya",
      price: "KES 2,500",
      category: "Music",
      attendees: 1200,
      image: "🎵",
      description: "The biggest Afrobeats celebration in East Africa"
    },
    {
      id: 2,
      title: "Tech Summit Kenya",
      date: "Jan 20, 2025",
      location: "Mombasa, Kenya", 
      price: "KES 5,000",
      category: "Technology",
      attendees: 800,
      image: "💻",
      description: "Innovation and technology conference"
    }
  ];

  const categories = ['All', 'Music', 'Technology', 'Art', 'Food', 'Business', 'Sports'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsService.getAllEvents();
        setEvents(response.events || response || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-er-dark pt-20">
      <section className="py-16 px-6 bg-gradient-to-r from-er-primary/10 to-er-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-er-light mb-6">
            Discover Events
          </h1>
          <p className="text-xl text-er-text max-w-2xl mx-auto mb-8">
            Find amazing events happening across Kenya
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-er-text w-5 h-5" />
            <input
              type="text"
              placeholder="Search events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-er-gray border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light placeholder-gray-400 text-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-8 px-6 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="text-er-primary w-5 h-5" />
            <span className="text-er-light font-semibold">Categories:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-er-primary text-white'
                    : 'bg-er-gray text-er-text hover:bg-er-primary/20 hover:text-er-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
              {error} - Showing demo events
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-er-light">
              {loading ? 'Loading...' : `${filteredEvents.length} Events Found`}
            </h2>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-er-dark h-40 rounded-lg mb-4"></div>
                  <div className="bg-er-dark h-4 rounded mb-2"></div>
                  <div className="bg-er-dark h-3 rounded mb-4"></div>
                  <div className="bg-er-dark h-8 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event, index) => (
                <div 
                  key={event.id} 
                  className="card group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-er-primary/20 to-er-secondary/20 h-40 flex items-center justify-center">
                    <div className="absolute top-3 left-3 bg-er-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {event.category}
                    </div>
                    <div className="text-4xl">{event.image || '🎉'}</div>
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-er-light mb-2">
                    {event.title}
                  </h3>
                  <p className="text-er-text text-sm mb-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-er-text text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-er-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-er-text text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-er-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-er-text text-sm">
                      <Users className="w-4 h-4 mr-2 text-er-primary" />
                      {event.attendees} attending
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-er-primary">{event.price}</span>
                    <Link 
                      to={`/events/${event.id}`}
                      className="bg-er-primary hover:bg-pink-600 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredEvents.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-er-light mb-2">No events found</h3>
              <p className="text-er-text">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default EventsPage;