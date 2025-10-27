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
  }
};