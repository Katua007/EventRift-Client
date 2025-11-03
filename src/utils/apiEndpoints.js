// API Endpoints mapping for EventRift backend
// This file centralizes all API endpoint definitions to ensure consistency

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh'
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
    LIST: '/api/events',
    CREATE: '/api/events',
    GET: (id) => `/api/events/${id}`,
    UPDATE: (id) => `/api/events/${id}`,
    DELETE: (id) => `/api/events/${id}`,
    REVIEWS: (id) => `/api/events/${id}/reviews`
  },

  // Organizer endpoints
  ORGANIZER: {
    EVENTS: '/api/organizer/events',
    DASHBOARD: '/api/dashboard/organizer',
    ANALYTICS: '/api/organizer/analytics'
  },

  // Vendor endpoints
  VENDOR: {
    SERVICES: '/api/vendor/services',
    DASHBOARD: '/api/dashboard/vendor',
    BOOKINGS: '/api/vendor/bookings'
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
    USER: '/api/tickets/user',
    CREATE: '/api/tickets/book',
    GET: (id) => `/api/tickets/${id}`,
    EVENT: (eventId) => `/api/tickets/event/${eventId}`
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