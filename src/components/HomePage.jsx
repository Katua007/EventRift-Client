import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Play, X } from 'lucide-react';
import { AboutUs } from './AboutUs';
import { Hero } from './Hero';

const HomePage = () => {
  const [showDemo, setShowDemo] = useState(false);
  const featuredEvents = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-er-dark">
      {/* Hero Section */}
      <Hero />

      {/* Featured Events */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-er-text max-w-2xl mx-auto">
              Handpicked events that you shouldn't miss
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <div key={event.id} className="card group hover:transform hover:scale-105 transition-all duration-300">
                <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-er-primary/20 to-er-secondary/20 h-48 flex items-center justify-center group-hover:from-er-primary/30 group-hover:to-er-secondary/30 transition-all duration-300">
                  <div className="absolute top-4 left-4 bg-er-primary text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                    {event.category}
                  </div>
                  <div className="text-6xl animate-bounce">{event.image}</div>
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

      {/* How It Works */}
      <section className="py-20 px-6 bg-er-gray">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-4">
              How EventRift Works
            </h2>
            <p className="text-xl text-er-text max-w-2xl mx-auto">
              Simple steps to discover and attend amazing events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-er-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-bounce">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-4 group-hover:text-er-primary transition-colors">Discover Events</h3>
              <p className="text-er-text">Browse through hundreds of events across Kenya and find what interests you.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-er-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-bounce" style={{animationDelay: '0.2s'}}>
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-4 group-hover:text-er-secondary transition-colors">Book Tickets</h3>
              <p className="text-er-text">Secure your spot with our easy booking system and M-Pesa integration.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-er-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-bounce" style={{animationDelay: '0.4s'}}>
                <span className="text-2xl font-bold text-er-dark">3</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-4 group-hover:text-er-accent transition-colors">Enjoy Experience</h3>
              <p className="text-er-text">Show up and create unforgettable memories at amazing events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutUs />

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-6 animate-pulse">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-er-text mb-8">
            Join thousands of event-goers and organizers on EventRift
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300">
              Get Started Free
            </Link>
            <Link to="/events" className="btn-secondary text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300">
              Browse Events
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-er-gray rounded-xl p-8 max-w-2xl w-full relative animate-fade-in">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-4 right-4 text-er-text hover:text-er-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="text-6xl mb-6 animate-bounce">🎬</div>
              <h3 className="font-heading text-2xl font-bold text-er-light mb-4">
                EventRift Demo
              </h3>
              <p className="text-er-text mb-6">
                See how easy it is to discover, book, and attend amazing events across Kenya.
              </p>
              
              <div className="bg-er-dark rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center space-x-4 text-er-text">
                  <div className="animate-pulse">🔍 Discover</div>
                  <ArrowRight className="w-4 h-4 text-er-primary" />
                  <div className="animate-pulse" style={{animationDelay: '0.5s'}}>🎫 Book</div>
                  <ArrowRight className="w-4 h-4 text-er-primary" />
                  <div className="animate-pulse" style={{animationDelay: '1s'}}>🎉 Enjoy</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/events" 
                  onClick={() => setShowDemo(false)}
                  className="btn-primary"
                >
                  Try It Now
                </Link>
                <button 
                  onClick={() => setShowDemo(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;