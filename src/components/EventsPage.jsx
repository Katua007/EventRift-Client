import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const allEvents = [
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
    },
    {
      id: 3,
      title: "Art & Culture Expo",
      date: "Feb 10, 2025",
      location: "Kisumu, Kenya",
      price: "KES 1,500",
      category: "Art",
      attendees: 600,
      image: "🎨",
      description: "Celebrating local artists and cultural heritage"
    },
    {
      id: 4,
      title: "Food & Wine Festival",
      date: "Mar 5, 2025",
      location: "Nakuru, Kenya",
      price: "KES 3,000",
      category: "Food",
      attendees: 950,
      image: "🍷",
      description: "Culinary delights from across Kenya"
    },
    {
      id: 5,
      title: "Startup Pitch Night",
      date: "Mar 18, 2025",
      location: "Nairobi, Kenya",
      price: "KES 1,000",
      category: "Business",
      attendees: 400,
      image: "🚀",
      description: "Where innovation meets investment"
    },
    {
      id: 6,
      title: "Marathon Challenge",
      date: "Apr 2, 2025",
      location: "Eldoret, Kenya",
      price: "KES 2,000",
      category: "Sports",
      attendees: 2500,
      image: "🏃",
      description: "Run with champions in the home of marathoners"
    },
    {
      id: 7,
      title: "Comedy Night Live",
      date: "Apr 15, 2025",
      location: "Nairobi, Kenya",
      price: "KES 1,800",
      category: "Entertainment",
      attendees: 300,
      image: "😂",
      description: "Laugh out loud with Kenya's funniest comedians"
    },
    {
      id: 8,
      title: "Fashion Week Nairobi",
      date: "May 1, 2025",
      location: "Nairobi, Kenya",
      price: "KES 4,000",
      category: "Fashion",
      attendees: 1500,
      image: "👗",
      description: "Showcasing the best of African fashion"
    }
  ];

  const categories = ['All', 'Music', 'Technology', 'Art', 'Food', 'Business', 'Sports', 'Entertainment', 'Fashion'];

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-er-dark pt-20">
      {/* Header */}
      <section className="py-16 px-6 bg-gradient-to-r from-er-primary/10 to-er-secondary/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-er-light mb-6 animate-fade-in">
            Discover Events
          </h1>
          <p className="text-xl text-er-text max-w-2xl mx-auto mb-8">
            Find amazing events happening across Kenya
          </p>
          
          {/* Search Bar */}
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

      {/* Filters */}
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
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
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

      {/* Events Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-er-light">
              {filteredEvents.length} Events Found
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="card group hover:transform hover:scale-105 transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-er-primary/20 to-er-secondary/20 h-40 flex items-center justify-center group-hover:from-er-primary/30 group-hover:to-er-secondary/30 transition-all duration-300">
                  <div className="absolute top-3 left-3 bg-er-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {event.category}
                  </div>
                  <div className="text-4xl animate-bounce">{event.image}</div>
                </div>
                
                <h3 className="font-heading text-lg font-semibold text-er-light mb-2 group-hover:text-er-primary transition-colors">
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
                    className="bg-er-primary hover:bg-pink-600 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
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