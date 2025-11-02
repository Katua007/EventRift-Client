import api from './api.js';

export const vendorService = {
  // Get all services for a vendor
  getVendorServices: async (vendorId) => {
    try {
      const response = await api.get('/api/vendors/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor services:', error);
      throw error;
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      const response = await api.post('/api/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await api.put(`/api/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Get single service
  getService: async (serviceId) => {
    try {
      const response = await api.get(`/api/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Delete service
  deleteService: async (serviceId) => {
    try {
      const response = await api.delete(`/api/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }
};