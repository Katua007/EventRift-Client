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