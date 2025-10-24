import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Play } from 'lucide-react';

const HomePage = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "AfroBeats Festival 2024",
      date: "Dec 15, 2024",
      location: "Nairobi, Kenya",
      price: "KES 2,500",
      category: "Music",
      attendees: 1200
    },
    {
      id: 2,
      title: "Tech Summit Kenya",
      date: "Jan 20, 2025",
      location: "Mombasa, Kenya", 
      price: "KES 5,000",
      category: "Technology",
      attendees: 800
    },
    {
      id: 3,
      title: "Art & Culture Expo",
      date: "Feb 10, 2025",
      location: "Kisumu, Kenya",
      price: "KES 1,500",
      category: "Art",
      attendees: 600
    }
  ];

  return (
    <div className="min-h-screen bg-er-dark">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-er-primary/20 via-er-dark to-er-secondary/20"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-er-light mb-6">
            Discover Amazing
            <span className="text-er-primary block">Events</span>
          </h1>
          <p className="text-xl md:text-2xl text-er-text mb-8 max-w-2xl mx-auto">
            Connect with unforgettable experiences across Kenya. From music festivals to tech conferences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/events" className="btn-primary text-lg px-8 py-4">
              Explore Events <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center">
              <Play className="mr-2 w-5 h-5" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8 text-center">
          <div className="bg-er-gray/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-er-primary">500+</div>
            <div className="text-sm text-er-text">Events</div>
          </div>
          <div className="bg-er-gray/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-er-secondary">10K+</div>
            <div className="text-sm text-er-text">Users</div>
          </div>
          <div className="bg-er-gray/80 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-er-accent">50+</div>
            <div className="text-sm text-er-text">Cities</div>
          </div>
        </div>
      </section>

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
                <div className="relative mb-4 overflow-hidden rounded-lg bg-er-dark h-48 flex items-center justify-center">
                  <div className="absolute top-4 left-4 bg-er-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                  <div className="text-er-text">Event Image</div>
                </div>
                
                <h3 className="font-heading text-xl font-semibold text-er-light mb-2">
                  {event.title}
                </h3>
                
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
            <div className="text-center">
              <div className="w-16 h-16 bg-er-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-4">Discover Events</h3>
              <p className="text-er-text">Browse through hundreds of events across Kenya and find what interests you.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-er-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-4">Book Tickets</h3>
              <p className="text-er-text">Secure your spot with our easy booking system and M-Pesa integration.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-er-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-er-dark">3</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-er-light mb-4">Enjoy Experience</h3>
              <p className="text-er-text">Show up and create unforgettable memories at amazing events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-er-text mb-8">
            Join thousands of event-goers and organizers on EventRift
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/events" className="btn-secondary text-lg px-8 py-4">
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;