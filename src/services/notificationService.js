import api from './api';

export const notificationService = {
  // Get user notifications
  async getNotifications() {
    try {
      const response = await api.get('/api/notifications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch notifications' };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark notification as read' };
    }
  },

  // Get organizer notifications (ticket purchases, reviews, etc.)
  async getOrganizerNotifications(organizerId) {
    try {
      const response = await api.get(`/api/organizer/${organizerId}/notifications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch organizer notifications' };
    }
  },

  // Send notification (for ticket purchases)
  async sendTicketPurchaseNotification(eventId, purchaseData) {
    try {
      const response = await api.post(`/api/events/${eventId}/notifications/purchase`, purchaseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send notification' };
    }
  }
};