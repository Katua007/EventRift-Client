import api from './api';

export const paymentsService = {
  // Initiate M-Pesa payment
  async initiateMpesaPayment(paymentData) {
    try {
      const response = await api.post('/api/payments/mpesa/initiate', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment initiation failed' };
    }
  },

  // Check payment status
  async checkPaymentStatus(transactionId) {
    try {
      const response = await api.get(`/api/payments/status/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check payment status' };
    }
  },

  // Get user's payment history
  async getPaymentHistory() {
    try {
      const response = await api.get('/api/payments/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment history' };
    }
  },

  // Get event tickets
  async getTickets(eventId) {
    try {
      const response = await api.get(`/api/tickets/event/${eventId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tickets' };
    }
  }
};