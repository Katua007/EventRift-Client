// Vendor service for managing vendor operations
export const vendorService = {
  // Register vendor
  registerVendor: async (vendorData) => {
    try {
      // Mock API call - replace with actual endpoint
      console.log('Registering vendor:', vendorData);
      return {
        success: true,
        vendor: {
          id: Date.now(),
          ...vendorData,
          status: 'pending_verification',
          badge: null,
          created_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error registering vendor:', error);
      throw error;
    }
  },

  // Update vendor services
  updateServices: async (vendorId, services) => {
    try {
      console.log('Updating vendor services:', { vendorId, services });
      return {
        success: true,
        services: services.map(service => ({
          id: Date.now() + Math.random(),
          vendor_id: vendorId,
          ...service,
          created_at: new Date().toISOString()
        }))
      };
    } catch (error) {
      console.error('Error updating services:', error);
      throw error;
    }
  },

  // Upload license
  uploadLicense: async (vendorId, licenseFile) => {
    try {
      console.log('Uploading license:', { vendorId, licenseFile });
      return {
        success: true,
        license: {
          id: Date.now(),
          vendor_id: vendorId,
          filename: licenseFile.name,
          status: 'pending_review',
          uploaded_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error uploading license:', error);
      throw error;
    }
  },

  // Book stall
  bookStall: async (vendorId, eventId, stallData) => {
    try {
      console.log('Booking stall:', { vendorId, eventId, stallData });
      return {
        success: true,
        booking: {
          id: Date.now(),
          vendor_id: vendorId,
          event_id: eventId,
          ...stallData,
          status: 'confirmed',
          booked_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error booking stall:', error);
      throw error;
    }
  },

  // Get vendor dashboard data
  getDashboardData: async (vendorId) => {
    try {
      return {
        vendor: {
          id: vendorId,
          name: 'Demo Vendor',
          email: 'vendor@example.com',
          status: 'verified',
          badge: 'certified',
          services: [
            {
              id: 1,
              name: 'Photography',
              category: 'Media',
              price: 50000,
              bookings: 12
            }
          ],
          bookings: [
            {
              id: 1,
              event_name: 'Tech Conference 2024',
              date: '2024-12-20',
              amount: 25000,
              status: 'confirmed'
            }
          ],
          stats: {
            totalServices: 3,
            totalBookings: 15,
            totalRevenue: 750000,
            averageRating: 4.7
          }
        }
      };
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      throw error;
    }
  }
};