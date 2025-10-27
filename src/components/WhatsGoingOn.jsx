import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';

export const WhatsGoingOn = ({ onEventClick }) => {
  const events = [
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
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-4">
            What's Going On
          </h2>
          <p className="text-xl text-er-text max-w-2xl mx-auto">
            Discover amazing events happening around you
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="card group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => onEventClick(event.id)}
            >
              <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-er-primary/20 to-er-secondary/20 h-48 flex items-center justify-center group-hover:from-er-primary/30 group-hover:to-er-secondary/30 transition-all duration-300">
                <div className="absolute top-4 left-4 bg-er-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {event.category}
                </div>
                <div className="text-6xl">{event.image}</div>
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-er-light mb-2 group-hover:text-er-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-er-text text-sm mb-3">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-er-text">
                  <Calendar className="w-4 h-4 mr-2 text-er-primary" />
                  {event.date}
                </div>
                <div className="flex items-center text-er-text">
                  <MapPin className="w-4 h-4 mr-2 text-er-primary" />
                  {event.location}
                </div>
                <div className="flex items-center text-er-text">
                  <Users className="w-4 h-4 mr-2 text-er-primary" />
                  {event.attendees} attending
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-er-primary">{event.price}</span>
                <button className="bg-er-primary hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
import { EventCard } from './EventCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { events as allEvents, categories } from '../data/events';

export function WhatsGoingOn({ onEventClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white mb-8 uppercase tracking-wide">
          What's<br />Going On
        </h2>
        <p className="text-white/60 mb-8">Upcoming Events</p>
        
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-transparent border-white/20 text-white hover:bg-white/10'
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div key={event.id} onClick={() => onEventClick?.(event.id)}>
              <EventCard 
                image={event.image}
                title={event.title}
                date={event.date}
                location={event.location}
              />
            </div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
