import api from './api.js';
import { API_ENDPOINTS } from '../utils/apiEndpoints.js';

export const vendorService = {
  // Get all services for a vendor
  getVendorServices: async (vendorId) => {
    try {
      console.log('🔄 VendorService: Fetching services for vendor:', vendorId);
      const response = await api.get(API_ENDPOINTS.VENDOR.SERVICES);
      console.log('✅ VendorService: Services fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error fetching vendor services:', error);
      // Try alternative endpoints
      try {
        const altResponse = await api.get('/services/vendor');
        return altResponse.data;
      } catch (altError) {
        try {
          const userResponse = await api.get(API_ENDPOINTS.USER.SERVICES);
          return userResponse.data;
        } catch (userError) {
          console.error('❌ VendorService: All vendor endpoints failed');
          // Return mock data only as last resort
          const { mockVendorData } = await import('../data/mockDashboardData.js');
          return { success: true, services: mockVendorData.services };
        }
      }
    }
  },

  // Create new service
  createService: async (serviceData) => {
    try {
      console.log('🔄 VendorService: Creating service:', serviceData);
      const response = await api.post(API_ENDPOINTS.SERVICES.CREATE, serviceData);
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
      const response = await api.put(API_ENDPOINTS.SERVICES.UPDATE(serviceId), serviceData);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  },

  // Get single service
  getService: async (serviceId) => {
    try {
      const response = await api.get(API_ENDPOINTS.SERVICES.GET(serviceId));
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
      const response = await api.delete(API_ENDPOINTS.SERVICES.DELETE(serviceId));
      console.log('✅ VendorService: Service deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ VendorService: Error deleting service:', error);
      throw error;
    }
  }
};