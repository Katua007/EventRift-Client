import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { events as staticEvents } from '../data/events.js';

// Log events count for debugging
console.log('Static events imported:', staticEvents?.length || 0, 'events');

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedDays, setSelectedDays] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const categories = ['All', 'Music', 'Technology', 'Art', 'Food', 'Business', 'Sports', 'Entertainment', 'Fashion', 'Education', 'Health', 'Cultural'];
  const themes = ['All', 'Corporate', 'Casual', 'Formal', 'Festival', 'Conference', 'Workshop', 'Networking', 'Cultural'];
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' }
  ];
  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'offers', label: 'Special Offers' },
    { value: 'flash_sales', label: 'Flash Sales' },
    { value: 'free', label: 'Free Events' }
  ];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Always use static events data for reliable display
        if (staticEvents && staticEvents.length > 0) {
          setEvents(staticEvents);
          setError(null);
          console.log('Loaded', staticEvents.length, 'events from static data');
        } else {
          console.error('No static events found');
          setError('No events available');
          setEvents([]);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Error loading events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredAndSortedEvents = events
    .filter(event => {
      // Search by name
      const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      
      // Filter by theme
      const matchesTheme = selectedTheme === 'All' || event.theme === selectedTheme;
      
      // Filter by type (upcoming, offers, flash sales, etc.)
      let matchesFilter = true;
      if (filterBy === 'upcoming') {
        matchesFilter = new Date(event.date) > new Date();
      } else if (filterBy === 'offers') {
        matchesFilter = event.early_bird_price && event.early_bird_price < event.ticket_price;
      } else if (filterBy === 'flash_sales') {
        matchesFilter = event.flash_sale || (event.discount_percentage && event.discount_percentage > 20);
      } else if (filterBy === 'free') {
        matchesFilter = event.ticket_price === 0;
      }
      
      // Filter by days of week
      const matchesDays = selectedDays.length === 0 || 
        selectedDays.some(day => event.days_of_week?.includes(day));
      
      return matchesSearch && matchesCategory && matchesTheme && matchesFilter && matchesDays;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.tickets_sold || 0) - (a.tickets_sold || 0);
        case 'price_low':
          return (a.ticket_price || 0) - (b.ticket_price || 0);
        case 'price_high':
          return (b.ticket_price || 0) - (a.ticket_price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'date':
        default:
          return new Date(a.date) - new Date(b.date);
      }
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
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-4">
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
          
          {/* Advanced Filters */}
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-er-light font-semibold mb-2">Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full p-2 bg-er-dark border border-gray-700 rounded-lg text-er-light"
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-er-light font-semibold mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 bg-er-dark border border-gray-700 rounded-lg text-er-light"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-er-light font-semibold mb-2">Filter</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full p-2 bg-er-dark border border-gray-700 rounded-lg text-er-light"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-er-light font-semibold mb-2">Days</label>
              <select
                multiple
                value={selectedDays}
                onChange={(e) => setSelectedDays(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full p-2 bg-er-dark border border-gray-700 rounded-lg text-er-light"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
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
              {loading ? 'Loading...' : `${filteredAndSortedEvents.length} Events Found`}
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
              {filteredAndSortedEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="card group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-er-primary/20 to-er-secondary/20 h-40 flex items-center justify-center">
                    <div className="absolute top-3 left-3 bg-er-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {event.category}
                    </div>
                    {event.theme && (
                      <div className="absolute top-3 right-3 bg-er-secondary text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {event.theme}
                      </div>
                    )}
                    <div className="text-4xl">{event.image || '🎉'}</div>
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-er-light mb-2">
                    {event.title}
                  </h3>
                  <p className="text-er-text text-sm mb-3">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-er-text text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-er-primary" />
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-er-text text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-er-primary" />
                      {event.location || event.venue_name}
                    </div>
                    <div className="flex items-center text-er-text text-sm">
                      <Users className="w-4 h-4 mr-2 text-er-primary" />
                      {event.tickets_sold || event.attendees || 0} attending
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      {event.ticket_price === 0 ? (
                        <span className="text-xl font-bold text-er-secondary">FREE</span>
                      ) : (
                        <>
                          <span className="text-xl font-bold text-er-primary">
                            KES {(event.early_bird_price || event.ticket_price)?.toLocaleString()}
                          </span>
                          {event.early_bird_price && event.early_bird_price < event.ticket_price && (
                            <span className="text-xs text-er-text line-through">
                              KES {event.ticket_price?.toLocaleString()}
                            </span>
                          )}
                        </>
                      )}
                    </div>
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
          
          {filteredAndSortedEvents.length === 0 && !loading && (
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