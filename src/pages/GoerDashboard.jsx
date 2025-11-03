import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';

// Placeholder API endpoints (data retrieval from BE-402/G-5/G-6)
const HISTORY_API = '/users/history'; 
const REVIEWS_API = '/reviews';

const mockHistory = {
    // Events the user attended that are in the past
    past: [
        { id: 101, name: "AfroTime Jams", date: '2025-09-15', ticket_id: 'T123', reviewed: true },
        { id: 102, name: "The Tech Summit", date: '2025-10-10', ticket_id: 'T124', reviewed: false },
    ],
    // Events the user has tickets for that are in the future
    upcoming: [
        { id: 201, name: "Rock Festival 2026", date: '2026-03-15', ticket_id: 'T201', location: 'Nairobi' },
        { id: 202, name: "Gourmet Food Expo", date: '2026-01-25', ticket_id: 'T202', location: 'Mombasa' },
    ]
};

const GoerDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [history, setHistory] = useState(mockHistory);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        setLoading(true);
        // In a real app, fetch data using the user's token
        // fetch(`${HISTORY_API}/${user.id}`)
        // .then(res => res.json())
        // .then(data => setHistory(data))
        // .catch(err => console.error("Error fetching history:", err))
        // .finally(() => setLoading(false));
        
        // Simulating data load time
        setTimeout(() => setLoading(false), 500);
    }, [isAuthenticated, user?.id]);

    const handleReviewSubmit = (reviewData) => {
        // Implement API call to G-6 endpoint (e.g., POST /reviews)
        console.log(`Submitting review for Event ${selectedEventId}:`, reviewData);
        
        // Simulate API success and update local state
        setHistory(prev => ({
            ...prev,
            past: prev.past.map(e => 
                e.id === selectedEventId ? { ...e, reviewed: true } : e
            )
        }));
        setSelectedEventId(null);
    };

    if (loading) return <div className="p-10 text-xl text-gray-400">Loading your profile and history...</div>;

    return (
        <div className="container mx-auto p-8 pt-24 min-h-screen">
            <h1 className="text-4xl font-extrabold text-er-primary mb-8">
                Welcome, {user?.username || 'Goer'}
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* UPCOMING EVENTS (Tickets/G-5) */}
                <div className="lg:col-span-2 bg-black p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-er-light mb-4 border-b border-gray-700 pb-2">Your Upcoming Tickets</h2>
                    <div className="space-y-4">
                        {history.upcoming.length > 0 ? history.upcoming.map(event => (
                            <div key={event.id} className="bg-er-dark p-4 rounded-lg flex justify-between items-center border border-gray-700 hover:border-er-primary transition">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {new Date(event.date).toLocaleDateString()} @ {event.location}
                                    </p>
                                </div>
                                <span className="bg-er-primary/20 text-er-primary text-xs font-bold px-3 py-1 rounded-full">
                                    Ticket #{event.ticket_id}
                                </span>
                            </div>
                        )) : (
                            <p className="text-gray-500">You have no upcoming events. Browse events now!</p>
                        )}
                    </div>
                </div>

                {/* PARENT CONTAINER FOR HISTORY AND REVIEW */}
                <div className="bg-black p-6 rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-er-light mb-4 border-b border-gray-700 pb-2">Past Events & Reviews</h2>
                    
                    {/* PAST EVENTS (G-5) */}
                    <div className="space-y-4 mb-6">
                        {history.past.length > 0 ? history.past.map(event => (
                            <div key={event.id} className="bg-er-dark p-3 rounded-lg flex justify-between items-center text-sm">
                                <span className="text-white truncate">{event.name}</span>
                                {event.reviewed ? (
                                    <span className="text-green-500">Reviewed</span>
                                ) : (
                                    <button 
                                        onClick={() => setSelectedEventId(event.id)}
                                        className="text-er-primary hover:text-pink-400 transition"
                                    >
                                        Leave Review (G-6)
                                    </button>
                                )}
                            </div>
                        )) : (
                            <p className="text-gray-500">No attendance history yet.</p>
                        )}
                    </div>

                    {/* REVIEW FORM (G-6) */}
                    {selectedEventId && (
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <h3 className="text-xl font-bold text-er-primary mb-4">
                                Review Event {history.past.find(e => e.id === selectedEventId)?.name}
                            </h3>
                            <ReviewForm 
                                eventId={selectedEventId} 
                                onSubmit={handleReviewSubmit}
                                onCancel={() => setSelectedEventId(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GoerDashboard;