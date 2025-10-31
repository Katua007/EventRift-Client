import api from './api.js';
import { events } from '../data/events.js';

export const eventsService = {
  // Goer services
  getUserTickets: async () => {
    try {
      const response = await api.get('/tickets/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  },

  submitReview: async (eventId, reviewData) => {
    try {
      const response = await api.post(`/events/${eventId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  },

  // Organizer services
  getOrganizerEvents: async (organizerId) => {
    try {
      const response = await api.get('/organizers/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching organizer events:', error);
      throw error;
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  updateEvent: async (eventId, eventData) => {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // General event services
  getEvents: async () => {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      // Fallback to local data if API fails
      return {
        events: events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.start_date || e.date,
          location: e.location || `${e.venue_name}, ${e.address}`,
          category: e.category,
          image: e.image || "🎉"
        }))
      };
    }
  },

  getEvent: async (eventId) => {
    try {
      console.log(`Fetching event details for ID: ${eventId}`);
      const response = await api.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event:', error);
      
      // Enhanced error handling for network errors and timeouts
      if (error.code === 'ECONNABORTED' || 
          error.isNetworkError || 
          error.isCorsError || 
          error.message?.includes('timeout') || 
          error.message?.includes('Network Error')) {
        console.log('Network error detected, falling back to local data');
      }
      
      // Fallback to local data if API fails
      const event = events.find(e => e.id.toString() === eventId);
      if (event) {
        console.log('Using local event data as fallback');
        // Add any missing fields that might be expected from the API
        return { 
          event: {
            ...event,
            availableTickets: (event.max_attendees || 1000) - (event.tickets_sold || 0),
            status: event.status || 'active'
          } 
        };
      }
      
      // If no local data found, throw a more descriptive error
      throw new Error(`Event with ID ${eventId} not found. Please try again later.`);
    }
  }
};