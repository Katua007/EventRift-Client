// Helper to get stored services from localStorage
const getStoredServices = () => {
  const stored = localStorage.getItem('vendorServices');
  return stored ? JSON.parse(stored) : [];
};

// Helper to save services to localStorage
const saveStoredServices = (services) => {
  localStorage.setItem('vendorServices', JSON.stringify(services));
};

export const vendorService = {
  // Get all services for a vendor
  getVendorServices: async (vendorId) => {
    const storedServices = getStoredServices();
    const vendorServices = storedServices.filter(s => s.vendor_id === vendorId);
    return {
      services: vendorServices.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        price: s.price,
        bookings: s.bookings || 0,
        rating: s.rating || 0,
        status: s.status
      }))
    };
  },

  // Create new service
  createService: async (serviceData) => {
    console.log('Creating service:', serviceData);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const newService = {
      id: Date.now(),
      ...serviceData,
      bookings: 0,
      rating: 0,
      reviews_count: 0,
      created_at: new Date().toISOString()
    };

    const storedServices = getStoredServices();
    storedServices.push(newService);
    saveStoredServices(storedServices);

    return {
      success: true,
      service: newService
    };
  },

  // Update service
  updateService: async (serviceId, serviceData) => {
    console.log('Updating service:', serviceId, serviceData);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const storedServices = getStoredServices();
    const index = storedServices.findIndex(s => s.id === parseInt(serviceId));
    if (index !== -1) {
      storedServices[index] = { ...storedServices[index], ...serviceData };
      saveStoredServices(storedServices);
      return { success: true, service: storedServices[index] };
    }
    throw new Error('Service not found');
  },

  // Get single service
  getService: async (serviceId) => {
    const storedServices = getStoredServices();
    const service = storedServices.find(s => s.id.toString() === serviceId);
    if (service) {
      return { service };
    }
    throw new Error('Service not found');
  },

  // Delete service
  deleteService: async (serviceId) => {
    console.log('Deleting service:', serviceId);
    const storedServices = getStoredServices();
    const filtered = storedServices.filter(s => s.id !== parseInt(serviceId));
    saveStoredServices(filtered);
    return { success: true };
  }
};