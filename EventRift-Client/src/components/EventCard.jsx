import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    // Placeholder image URL, should come from event.image_url (Cloudinary)
    const imageUrl = event.image_url || 'https://via.placeholder.com/400x600?text=Event+Poster';
    
    // Format date for display
    const formattedDate = new Date(event.date_start).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });

    return (
        <div className="bg-black rounded-lg overflow-hidden shadow-xl hover:shadow-er-primary/50 transition duration-300 transform hover:-translate-y-1">
            {/* Event Poster Area - Inspired by the Rock Festival/Afro Jams posters */}
            <div className="h-64 overflow-hidden">
                <img 
                    src={imageUrl} 
                    alt={event.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
            </div>
            
            {/* Event Details */}
            <div className="p-4">
                <p className="text-sm text-er-primary font-semibold mb-1 uppercase">{event.category || 'Music'}</p>
                <h3 className="text-xl font-bold text-er-light truncate mb-2">{event.name}</h3>
                <p className="text-gray-400 text-sm mb-3">
                    <span className="font-semibold text-white mr-2">📅</span> {formattedDate}
                </p>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-white">
                        Ksh {event.ticket_price}
                    </span>
                    <Link 
                        to={`/events/${event.id}`} 
                        className="bg-er-primary text-white text-sm px-4 py-1.5 rounded-full hover:bg-pink-700 transition"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;