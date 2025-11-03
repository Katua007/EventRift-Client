// API Endpoints mapping for EventRift backend
// This file centralizes all API endpoint definitions to ensure consistency

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh'
  },

  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    TICKETS: '/user/tickets',
    EVENTS: '/user/events',
    SERVICES: '/user/services',
    BOOKINGS: '/user/bookings'
  },

  // Events endpoints
  EVENTS: {
    LIST: '/events',
    CREATE: '/events',
    GET: (id) => `/events/${id}`,
    UPDATE: (id) => `/events/${id}`,
    DELETE: (id) => `/events/${id}`,
    REVIEWS: (id) => `/events/${id}/reviews`
  },

  // Organizer endpoints
  ORGANIZER: {
    EVENTS: '/organizer/events',
    DASHBOARD: '/organizer/dashboard',
    ANALYTICS: '/organizer/analytics'
  },

  // Vendor endpoints
  VENDOR: {
    SERVICES: '/vendor/services',
    DASHBOARD: '/vendor/dashboard',
    BOOKINGS: '/vendor/bookings'
  },

  // Services endpoints
  SERVICES: {
    LIST: '/services',
    CREATE: '/services',
    GET: (id) => `/services/${id}`,
    UPDATE: (id) => `/services/${id}`,
    DELETE: (id) => `/services/${id}`
  },

  // Tickets endpoints
  TICKETS: {
    USER: '/tickets/user',
    CREATE: '/tickets',
    GET: (id) => `/tickets/${id}`,
    EVENT: (eventId) => `/tickets/event/${eventId}`
  },

  // Payments endpoints
  PAYMENTS: {
    MPESA_INITIATE: '/payments/mpesa/initiate',
    STATUS: (transactionId) => `/payments/status/${transactionId}`,
    HISTORY: '/payments/history'
  }
};

// Helper function to get the correct endpoint
export const getEndpoint = (category, action, id = null) => {
  const endpoints = API_ENDPOINTS[category.toUpperCase()];
  if (!endpoints) {
    throw new Error(`Unknown API category: ${category}`);
  }

  const endpoint = endpoints[action.toUpperCase()];
  if (!endpoint) {
    throw new Error(`Unknown API action: ${action} for category: ${category}`);
  }

  return typeof endpoint === 'function' ? endpoint(id) : endpoint;
};