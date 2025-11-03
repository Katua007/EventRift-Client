// This file handles all event-related operations like fetching events, creating events, and managing tickets
// It communicates with the backend server and falls back to local data when needed

// Import our API configuration and local event data
import api from './api.js';
import { events } from '../data/events.js';

// Object containing all event-related functions
export const eventsService = {
  // Functions for event attendees (goers)
  getUserTickets: async () => {
    try {
      // Get the current user's purchased tickets from the server
      console.log('🔄 EventsService: Fetching user tickets...');
      const response = await api.get('/api/tickets/user');
      console.log('✅ EventsService: User tickets fetched:', response.data);
      return response.data;
    } catch (error) {
      // If server request fails, log error and return empty array
      console.error('❌ EventsService: Error fetching user tickets:', error);
      // Return empty tickets array as fallback so app doesn't break
      return { success: true, tickets: [] };
    }
  },

  // Submit a review for an event
  submitReview: async (eventId, reviewData) => {
    try {
      // Send the review to the server
      const response = await api.post(`/api/events/${eventId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      // Handle errors when submitting review
      console.error('Error submitting review:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Provide a user-friendly error message
      throw new Error('Failed to submit review. Please try again.');
    }
  },

  // Functions for event organizers
  getOrganizerEvents: async (organizerId) => {
    try {
      // Get all events created by the current organizer
      console.log('🔄 EventsService: Fetching organizer events...');
      const response = await api.get('/api/organizers/events');
      console.log('✅ EventsService: Organizer events fetched:', response.data);
      return response.data;
    } catch (error) {
      // If request fails, log error and return empty array
      console.error('❌ EventsService: Error fetching organizer events:', error);
      // Return empty events array as fallback so app doesn't break
      return { success: true, events: [] };
    }
  },

  // Create a new event
  createEvent: async (eventData) => {
    try {
      // Log what event data we're sending
      console.log('Creating event with data:', eventData);
      // Send the event data to the server to create the event
      const response = await api.post('/api/events', eventData);
      // Log the successful response
      console.log('Event creation response:', response.data);
      return response.data;
    } catch (error) {
      // Handle errors when creating event
      console.error('Error creating event:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      // Provide user-friendly error message
      throw new Error('Failed to create event. Please try again.');
    }
  },

  // Update an existing event
  updateEvent: async (eventId, eventData) => {
    try {
      // Send updated event data to the server
      const response = await api.put(`/api/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      // Log and re-throw any errors
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    try {
      // Tell the server to delete the event
      const response = await api.delete(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      // Log and re-throw any errors
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // General functions that work for all users
  getEvents: async () => {
    try {
      // Get all events from the server
      const response = await api.get('/api/events');
      return response.data;
    } catch (error) {
      // If server request fails, use local event data as backup
      console.error('Error fetching events:', error);
      // Fallback to local data if API fails
      return {
        success: true,
        events: events.map(e => ({
          id: e.id,
          title: e.title,
          date: e.start_date || e.date, // Use start_date or fallback to date
          location: e.location || `${e.venue_name}, ${e.address}`, // Combine venue and address
          category: e.category,
          image: e.image || null,
          ticket_price: e.ticket_price,
          rating: e.rating,
          reviews_count: e.reviews_count
        }))
      };
    }
  },

  // Get detailed information about a specific event
  getEvent: async (eventId) => {
    try {
      // Log which event we're fetching
      console.log(`Fetching event details for ID: ${eventId}`);
      // Request the specific event from the server
      const response = await api.get(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      // Handle various types of errors
      console.error('Error fetching event:', error);

      // Check for network-related errors
      if (error.code === 'ECONNABORTED' || // Request timed out
          error.isNetworkError || // General network error
          error.isCorsError || // CORS policy blocked request
          error.message?.includes('timeout') ||
          error.message?.includes('Network Error')) {
        console.log('Network error detected, falling back to local data');
      }

      // Handle 404 errors (event not found)
      if (error.response?.status === 404) {
        console.log(`Event ${eventId} not found, using fallback data`);
        // Look for the event in our local data
        const event = events.find(e => e.id.toString() === eventId);
        if (event) {
          return {
            event: {
              ...event, // Include all event data
              availableTickets: (event.max_attendees || 1000) - (event.tickets_sold || 0), // Calculate available tickets
              status: event.status || 'active' // Default status
            }
          };
        }
      }

      // For other errors, try to use local data as fallback
      const event = events.find(e => e.id.toString() === eventId);
      if (event) {
        console.log('Using local event data as fallback');
        // Add calculated fields that the API would normally provide
        return {
          event: {
            ...event,
            availableTickets: (event.max_attendees || 1000) - (event.tickets_sold || 0),
            status: event.status || 'active'
          }
        };
      }

      // If we can't find the event anywhere, show a user-friendly error
      throw new Error(`Event with ID ${eventId} not found. Please try again later.`);
    }
  }
};