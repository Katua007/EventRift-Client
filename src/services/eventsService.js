// Mock events service for demo purposes
import { events } from '../data/events.js';

// Helper to get stored events from localStorage
const getStoredEvents = () => {
  const stored = localStorage.getItem('createdEvents');
  return stored ? JSON.parse(stored) : [];
};

// Helper to save events to localStorage
const saveStoredEvents = (events) => {
  localStorage.setItem('createdEvents', JSON.stringify(events));
};

export const eventsService = {
  // Goer services
  getUserTickets: async () => {
    // Mock data for demo
    return {
      tickets: [
        {
          id: 1,
          event: {
            id: 1,
            title: "AfroBeats Festival 2024",
            date: "2024-12-15",
            venue_name: "Uhuru Gardens",
            image: "🎵"
          },
          quantity: 2,
          total_amount: 5000,
          status: "confirmed",
          purchase_date: "2024-11-01"
        }
      ]
    };
  },

  submitReview: async (eventId, reviewData) => {
    // Mock review submission
    console.log('Review submitted:', { eventId, reviewData });
    return { success: true };
  },

  // Organizer services
  getOrganizerEvents: async (organizerId) => {
    const storedEvents = getStoredEvents();
    const organizerEvents = storedEvents.filter(e => e.organizer_id === organizerId);
    return {
      events: organizerEvents.map(e => ({
        id: e.id,
        title: e.title,
        date: e.start_date,
        tickets_sold: e.tickets_sold || 0,
        max_attendees: e.max_attendees || 0,
        revenue: (e.tickets_sold || 0) * (e.ticket_price || 0),
        rating: e.rating || 0,
        status: e.status
      }))
    };
  },

  createEvent: async (eventData) => {
    // Mock event creation - in real app, this would send to backend
    console.log('Creating event:', eventData);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newEvent = {
      id: Date.now(),
      ...eventData,
      status: 'active',
      created_at: new Date().toISOString(),
      tickets_sold: 0,
      rating: 0,
      reviews_count: 0
    };

    const storedEvents = getStoredEvents();
    storedEvents.push(newEvent);
    saveStoredEvents(storedEvents);

    // Mock successful response
    return {
      success: true,
      event: newEvent
    };
  },

  updateEvent: async (eventId, eventData) => {
    console.log('Updating event:', eventId, eventData);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const storedEvents = getStoredEvents();
    const index = storedEvents.findIndex(e => e.id === parseInt(eventId));
    if (index !== -1) {
      storedEvents[index] = { ...storedEvents[index], ...eventData };
      saveStoredEvents(storedEvents);
      return { success: true, event: storedEvents[index] };
    }
    throw new Error('Event not found');
  },

  deleteEvent: async (eventId) => {
    // Mock delete
    console.log('Event deleted:', eventId);
    const storedEvents = getStoredEvents();
    const filtered = storedEvents.filter(e => e.id !== parseInt(eventId));
    saveStoredEvents(filtered);
    return { success: true };
  },

  // General event services
  getEvents: async () => {
    const storedEvents = getStoredEvents();
    const allEvents = [...events, ...storedEvents];
    return {
      events: allEvents.map(e => ({
        id: e.id,
        title: e.title,
        date: e.start_date || e.date,
        location: e.location || `${e.venue_name}, ${e.address}`,
        category: e.category,
        image: e.image || "🎉"
      }))
    };
  },

  getEvent: async (eventId) => {
    // Check stored events first
    const storedEvents = getStoredEvents();
    let event = storedEvents.find(e => e.id.toString() === eventId);
    if (!event) {
      event = events.find(e => e.id.toString() === eventId);
    }
    if (event) {
      return { event };
    }
    throw new Error('Event not found');
  }
};