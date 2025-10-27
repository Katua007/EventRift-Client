import api from './api';

export const eventsService = {
  // Get all events
  async getAllEvents(params = {}) {
    try {
      const response = await api.get('/api/events', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch events' };
    }
  },

  // Get single event
  async getEvent(eventId) {
    try {
      const response = await api.get(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch event' };
    }
  },

  // Create event (organizers only)
  async createEvent(eventData) {
    try {
      const response = await api.post('/api/events', eventData);
      return response.data;
    } catch (error) {
      if (error.isCorsError) {
        throw { message: 'Connection error: Please contact support. The backend needs CORS configuration.' };
      }
      throw error.response?.data || { message: 'Failed to create event' };
    }
  },

  // Update event
  async updateEvent(eventId, eventData) {
    try {
      const response = await api.put(`/api/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update event' };
    }
  },

  // Delete event
  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/api/events/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete event' };
    }
  },

  // Search events
  async searchEvents(query) {
    try {
      const response = await api.get('/api/events/search', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Search failed' };
    }
  },

  // Get organizer's events
  async getOrganizerEvents(organizerId) {
    try {
      const response = await api.get(`/api/organizer/${organizerId}/events`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch organizer events' };
    }
  },

  // Get event analytics
  async getEventAnalytics(eventId) {
    try {
      const response = await api.get(`/api/events/${eventId}/analytics`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  },

  // Get event reviews
  async getEventReviews(eventId) {
    try {
      const response = await api.get(`/api/events/${eventId}/reviews`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  }
};