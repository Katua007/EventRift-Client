import React from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Clock, Tag } from 'lucide-react';

export const EventDetail = ({ eventId, onBack }) => {
  // Mock event data - in real app, fetch based on eventId
  const event = {
    id: eventId,
    title: "AfroBeats Festival 2024",
    date: "Dec 15, 2024",
    time: "6:00 PM - 11:00 PM",
    location: "Nairobi, Kenya",
    venue: "Uhuru Gardens",
    price: "KES 2,500",
    category: "Music",
    attendees: 1200,
    image: "🎵",
    description: "The biggest Afrobeats celebration in East Africa featuring top artists from across the continent. Join us for an unforgettable night of music, dance, and culture.",
    longDescription: "Experience the vibrant sounds of Afrobeats at Kenya's premier music festival. This year's lineup features internationally acclaimed artists alongside rising local talent. The festival celebrates the rich musical heritage of Africa while showcasing contemporary sounds that are taking the world by storm.",
    highlights: [
      "Live performances by top Afrobeats artists",
      "Food trucks with African cuisine",
      "Art installations and cultural displays",
      "VIP packages available",
      "Free parking"
    ]
  };

  return (
    <div className="min-h-screen bg-er-dark py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-er-text hover:text-er-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-er-gray rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-6xl">{event.image}</div>
            <div className="bg-er-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
              {event.category}
            </div>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-4">
            {event.title}
          </h1>
          
          <p className="text-xl text-er-text mb-6">
            {event.description}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-er-text">
                <Calendar className="w-5 h-5 mr-3 text-er-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-er-text">
                <Clock className="w-5 h-5 mr-3 text-er-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-er-text">
                <MapPin className="w-5 h-5 mr-3 text-er-primary" />
                <span>{event.venue}, {event.location}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-er-text">
                <Users className="w-5 h-5 mr-3 text-er-primary" />
                <span>{event.attendees} people attending</span>
              </div>
              <div className="flex items-center text-er-text">
                <Tag className="w-5 h-5 mr-3 text-er-primary" />
                <span className="text-2xl font-bold text-er-primary">{event.price}</span>
              </div>
            </div>
          </div>

          <button className="bg-er-primary hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
            Get Tickets
          </button>
        </div>

        {/* Event Details */}
        <div className="bg-er-gray rounded-xl p-8 mb-8">
          <h2 className="font-heading text-2xl font-bold text-er-light mb-4">
            About This Event
          </h2>
          <p className="text-er-text mb-6 leading-relaxed">
            {event.longDescription}
          </p>

          <h3 className="font-heading text-xl font-semibold text-er-light mb-4">
            Event Highlights
          </h3>
          <ul className="space-y-2">
            {event.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center text-er-text">
                <div className="w-2 h-2 bg-er-primary rounded-full mr-3"></div>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Location Map Placeholder */}
        <div className="bg-er-gray rounded-xl p-8">
          <h2 className="font-heading text-2xl font-bold text-er-light mb-4">
            Event Location
          </h2>
          <div className="bg-er-dark rounded-lg h-64 flex items-center justify-center">
            <div className="text-center text-er-text">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-er-primary" />
              <p className="font-semibold">{event.venue}</p>
              <p>{event.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};