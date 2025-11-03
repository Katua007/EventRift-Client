// Mock data for dashboard testing and development
export const mockGoerData = {
  tickets: [
    {
      id: 1,
      event: {
        id: 1,
        title: "Koroga Festival 2024",
        date: "2024-12-15",
        venue_name: "Nairobi Arboretum",
        image: "/assets/images/Koroga Festival.jpeg"
      },
      quantity: 2,
      total_amount: 7000,
      status: "confirmed",
      purchase_date: "2024-11-15"
    },
    {
      id: 2,
      event: {
        id: 2,
        title: "Tech Summit Kenya",
        date: "2025-01-25",
        venue_name: "KICC",
        image: "/assets/images/TechCrunch .jpeg"
      },
      quantity: 1,
      total_amount: 8500,
      status: "confirmed",
      purchase_date: "2024-11-20"
    }
  ]
};

export const mockOrganizerData = {
  events: [
    {
      id: 1,
      title: "Tech Conference 2024",
      date: "2024-12-20",
      status: "active",
      tickets_sold: 150,
      max_attendees: 500,
      revenue: 750000,
      rating: 4.5
    },
    {
      id: 2,
      title: "Music Festival",
      date: "2025-01-15",
      status: "active",
      tickets_sold: 300,
      max_attendees: 1000,
      revenue: 1500000,
      rating: 4.8
    }
  ]
};

export const mockVendorData = {
  services: [
    {
      id: 1,
      name: "Photography Package",
      category: "Photography",
      price: 50000,
      status: "active",
      bookings: 5,
      rating: 4.7
    },
    {
      id: 2,
      name: "Catering Service",
      category: "Food & Beverage",
      price: 25000,
      status: "active",
      bookings: 8,
      rating: 4.9
    }
  ]
};