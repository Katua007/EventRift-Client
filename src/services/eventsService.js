// Mock events service for demo purposes
export const eventsService = {
  // Goer services
  getUserTickets: async () => {
    // Mock data for demo
    return {
      tickets: [
        {
          id: 1,
          event: {
            id: 1,
            title: "AfroBeats Festival 2024",
            date: "2024-12-15",
            venue_name: "Uhuru Gardens",
            image: "🎵"
          },
          quantity: 2,
          total_amount: 5000,
          status: "confirmed",
          purchase_date: "2024-11-01"
        }
      ]
    };
  },

  submitReview: async (eventId, reviewData) => {
    // Mock review submission
    console.log('Review submitted:', { eventId, reviewData });
    return { success: true };
  },

  // Organizer services
  getOrganizerEvents: async () => {
    // Mock data for demo
    return {
      events: [
        {
          id: 1,
          title: "Tech Conference 2024",
          date: "2024-12-20",
          tickets_sold: 150,
          max_attendees: 200,
          revenue: 750000,
          rating: 4.5,
          status: "active"
        }
      ]
    };
  },

  deleteEvent: async (eventId) => {
    // Mock delete
    console.log('Event deleted:', eventId);
    return { success: true };
  },

  // General event services
  getEvents: async () => {
    // Mock events data
    return {
      events: [
        {
          id: 1,
          title: "AfroBeats Festival 2024",
          date: "2024-12-15",
          location: "Nairobi, Kenya",
          category: "Music",
          image: "🎵"
        }
      ]
    };
  }
};