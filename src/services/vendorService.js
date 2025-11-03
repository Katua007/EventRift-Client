import api from './api.js';

export const vendorService = {
  // Get all services for a vendor
  getVendorServices: async (vendorId) => {
    try {
      console.log('🔄 VendorService: Fetching services for vendor:', vendorId);
      const response = await api.get('/api/vendors/services');
      console.log('✅ VendorService: Services fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error fetching vendor services:', error);
      // Return empty services array as fallback instead of throwing
      return { success: true, services: [] };
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      console.log('🔄 VendorService: Creating service:', serviceData);
      const response = await api.post('/api/services', serviceData);
      console.log('✅ VendorService: Service created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error creating service:', error);
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
      console.log('🔄 VendorService: Deleting service:', serviceId);
      const response = await api.delete(`/api/services/${serviceId}`);
      console.log('✅ VendorService: Service deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error deleting service:', error);
      throw error;
    }
  }
};