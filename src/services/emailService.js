import api from './api';

export const emailService = {
  // Send ticket email to user
  async sendTicketEmail(ticketData) {
    try {
      const response = await api.post('/api/email/send-ticket', ticketData);
      return response.data;
    } catch (error) {
      if (error.isCorsError) {
        throw { message: 'Connection error: Please contact support.' };
      }
      throw error.response?.data || { message: 'Failed to send ticket email' };
    }
  },

  // Send event reminder email
  async sendEventReminder(reminderData) {
    try {
      const response = await api.post('/api/email/send-reminder', reminderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reminder email' };
    }
  },

  // Send event confirmation email
  async sendEventConfirmation(confirmationData) {
    try {
      const response = await api.post('/api/email/send-confirmation', confirmationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send confirmation email' };
    }
  }
};