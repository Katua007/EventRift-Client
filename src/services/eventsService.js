// Mock events service for demo purposes
import { events } from '../data/events.js';

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
    // Mock data for demo - in real app, this would fetch from backend
    return {
      events: [
        {
          id: 1,
          title: "Tech Conference 2024",
          date: "2024-12-20",
          tickets_sold: 150,
          max_attendees: 200,
          revenue: 750000,
          rating: 4.5,
          status: "active"
        }
      ]
    };
  },

  createEvent: async (eventData) => {
    // Mock event creation - in real app, this would send to backend
    console.log('Creating event:', eventData);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    return {
      success: true,
      event: {
        id: Date.now(),
        ...eventData,
        status: 'active',
        created_at: new Date().toISOString()
      }
    };
  },

  deleteEvent: async (eventId) => {
    // Mock delete
    console.log('Event deleted:', eventId);
    return { success: true };
  },

  // General event services
  getEvents: async () => {
    // Mock events data
    return {
      events: [
        {
          id: 1,
          title: "AfroBeats Festival 2024",
          date: "2024-12-15",
          location: "Nairobi, Kenya",
          category: "Music",
          image: "🎵"
        }
      ]
    };
  },

  getEvent: async (eventId) => {
    // Mock single event data
    const event = events.find(e => e.id.toString() === eventId);
    if (event) {
      return { event };
    }
    throw new Error('Event not found');
  }
};