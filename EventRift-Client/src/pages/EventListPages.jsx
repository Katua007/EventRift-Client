import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';

// Placeholder data (will be replaced by API call to BE-205)
const mockEvents = [
    { id: 1, name: "Rock Festival 2026", ticket_price: 2500, date_start: '2026-03-15T19:00:00Z', category: 'Music', image_url: 'https://images.unsplash.com/photo-1540960533519-c00346c483a9' },
    { id: 2, name: "AfroTime Jams", ticket_price: 1500, date_start: '2025-11-20T17:00:00Z', category: 'Music', image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d191d57e' },
    { id: 3, name: "The Tech Summit Nairobi", ticket_price: 500, date_start: '2025-10-30T09:00:00Z', category: 'Tech', image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40' },
    { id: 4, name: "All Black Party", ticket_price: 3000, date_start: '2025-12-31T22:00:00Z', category: 'Party', image_url: 'https://images.unsplash.com/photo-1506144884391-f9f30b9101f3' },
    { id: 5, name: "Gourmet Food Expo", ticket_price: 1000, date_start: '2026-01-25T11:00:00Z', category: 'Food', image_url: 'https://images.unsplash.com/photo-1550993092-2771d1822409' },
];

const categories = ['Music', 'Tech', 'Food', 'Party', 'Art', 'Sports'];

const EventListPage = () => {
    const [events, setEvents] = useState(mockEvents);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        price_range: 'all',
    });

    // Placeholder for fetching events (BE-205)
    useEffect(() => {
        // fetch('/events')
        // .then(res => res.json())
        // .then(data => setEvents(data.events));
    }, []); 

    // Simple Client-Side Filtering Logic
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category === '' || event.category === filters.category;
        
        // Simple price filter logic
        let matchesPrice = true;
        if (filters.price_range === 'free') {
            matchesPrice = event.ticket_price === 0;
        } else if (filters.price_range === 'paid') {
            matchesPrice = event.ticket_price > 0;
        }

        return matchesSearch && matchesCategory && matchesPrice;
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="container mx-auto p-8 pt-24 min-h-screen">
            <h1 className="text-5xl font-extrabold text-er-light mb-10 text-center">Find Your Next Experience</h1>

            {/* Search Bar - Wide and prominent */}
            <div className="max-w-4xl mx-auto mb-10">
                <input
                    type="text"
                    placeholder="Search events by name or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 bg-black border border-gray-700 text-er-light rounded-lg text-lg focus:border-er-primary focus:ring-er-primary"
                />
            </div>

            {/* Main Content: Filters (Sidebar) and Event Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* 1. Filter Sidebar */}
                <aside className="lg:w-1/4 bg-black p-6 rounded-lg shadow-xl h-fit sticky top-24">
                    <h2 className="text-2xl font-bold text-er-primary mb-6 border-b border-gray-700 pb-2">Filters</h2>

                    {/* Category Filter */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-er-light mb-3">Category</h3>
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id={cat}
                                    name="category"
                                    checked={filters.category === cat}
                                    onChange={() => handleFilterChange('category', cat)}
                                    className="h-4 w-4 text-er-primary border-gray-500 bg-gray-900 focus:ring-er-primary"
                                />
                                <label htmlFor={cat} className="ml-3 text-sm text-gray-300 hover:text-er-light">{cat}</label>
                            </div>
                        ))}
                        <button 
                            onClick={() => handleFilterChange('category', '')}
                            className="text-sm text-gray-500 hover:text-er-primary mt-2"
                        >
                            Clear Filter
                        </button>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-6 pt-4 border-t border-gray-800">
                        <h3 className="font-semibold text-er-light mb-3">Price Range</h3>
                        {['all', 'free', 'paid'].map(range => (
                             <div key={range} className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id={range}
                                    name="price_range"
                                    checked={filters.price_range === range}
                                    onChange={() => handleFilterChange('price_range', range)}
                                    className="h-4 w-4 text-er-primary border-gray-500 bg-gray-900 focus:ring-er-primary"
                                />
                                <label htmlFor={range} className="ml-3 text-sm text-gray-300 hover:text-er-light capitalize">{range}</label>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* 2. Event Grid */}
                <main className="lg:w-3/4">
                    <p className="text-gray-400 mb-6">{filteredEvents.length} events found</p>
                    
                    {filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-black rounded-lg">
                            <p className="text-xl text-gray-400">No events match your criteria. Try adjusting your filters.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default EventListPage;