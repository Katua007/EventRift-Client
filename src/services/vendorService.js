import api from './api.js';

export const vendorService = {
  // Get all services for a vendor
  getVendorServices: async (vendorId) => {
    try {
      console.log('🔄 VendorService: Fetching services for vendor:', vendorId);
      const response = await api.get('/vendors/services');
      console.log('✅ VendorService: Services fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error fetching vendor services:', error);
      // Return mock data as fallback for development
      const { mockVendorData } = await import('../data/mockDashboardData.js');
      return { success: true, services: mockVendorData.services };
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      console.log('🔄 VendorService: Creating service:', serviceData);
      const response = await api.post('/services', serviceData);
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
      const response = await api.put(`/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Get single service
  getService: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}`);
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
      const response = await api.delete(`/services/${serviceId}`);
      console.log('✅ VendorService: Service deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error deleting service:', error);
      throw error;
    }
  }
};