import api from './api';
import { API_ENDPOINTS } from '../utils/apiEndpoints.js';

export const paymentsService = {
  // Initiate M-Pesa payment
  async initiateMpesaPayment(paymentData) {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENTS.MPESA_INITIATE, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Payment initiation failed' };
    }
  },

  // Check payment status
  async checkPaymentStatus(transactionId) {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.STATUS(transactionId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check payment status' };
    }
  },

  // Get user's payment history
  async getPaymentHistory() {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENTS.HISTORY);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment history' };
    }
  },

  // Get event tickets
  async getTickets(eventId) {
    try {
      const response = await api.get(API_ENDPOINTS.TICKETS.EVENT(eventId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch tickets' };
    }
  },

  // Book tickets for an event
  async bookTickets(eventId, quantity) {
    try {
      const response = await api.post('/tickets/book', {
        event_id: eventId,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to book tickets' };
    }
  }
};