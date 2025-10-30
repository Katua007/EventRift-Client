import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import EP1 from '../assets/images/EP1.jpeg';
import EP2 from '../assets/images/EP2.jpeg';
import EP3 from '../assets/images/EP3.jpeg';

export function WhatsGoingOn() {
  // Featured events data - updated to 2025
  const featuredEvents = [
    {
      id: 1,
      title: "AfroBeats Festival 2025",
      date: "Dec 15, 2025",
      location: "Nairobi, Kenya",
      price: "KES 2,500",
      category: "Music",
      attendees: 1200,
<<<<<<< Updated upstream
      image: "/assets/images/EP1.jpeg",
=======
      image: EP1,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      image: "/assets/images/EP2.jpeg",
=======
      image: EP2,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      image: "/assets/images/EP3.jpeg",
=======
      image: EP3,
>>>>>>> Stashed changes
      description: "Celebrating local artists and cultural heritage"
    }
  ];

  return (
    <section id="events" className="py-20 px-6 bg-er-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header - Exact Figma Text with White Color */}
        <div className="mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            What's<br />
            <span className="gradient-text">Going On</span>
          </h2>
          <p className="text-xl text-white">Upcoming Events</p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <div key={event.id} className="card group hover:transform hover:scale-105 transition-all duration-300 animate-fade-in">
              <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-er-primary/20 to-er-secondary/20 h-48 flex items-center justify-center group-hover:from-er-primary/30 group-hover:to-er-secondary/30 transition-all duration-300">
                <div className="absolute top-4 left-4 bg-er-primary text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  {event.category}
                </div>
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl">🎉</div>';
                  }}
                />
              </div>
              
              <h3 className="font-heading text-xl font-semibold text-white mb-2 group-hover:text-er-primary transition-colors">
                {event.title}
              </h3>
              <p className="text-white text-sm mb-3">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-white">
                  <Calendar className="w-4 h-4 mr-2 text-er-primary" />
                  {event.date}
                </div>
                <div className="flex items-center text-white">
                  <MapPin className="w-4 h-4 mr-2 text-er-primary" />
                  {event.location}
                </div>
                <div className="flex items-center text-white">
                  <Users className="w-4 h-4 mr-2 text-er-primary" />
                  {event.attendees} attending
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-er-primary">{event.price}</span>
                <Link
                  to={`/events/${event.id}`}
                  className="bg-er-primary hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}