// Mock auth service for demo purposes
export const authService = {
  login: async (credentials) => {
    // Mock login - simulate different user roles
    const { email, password } = credentials;
    
    // Mock users for demo
    const mockUsers = {
      'goer@test.com': { id: 1, username: 'John Doe', email: 'goer@test.com', role: 'Goer' },
      'organizer@test.com': { id: 2, username: 'Jane Smith', email: 'organizer@test.com', role: 'Organizer' },
      'vendor@test.com': { id: 3, username: 'Mike Johnson', email: 'vendor@test.com', role: 'Vendor' }
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers[email];
    if (user && password === 'password') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user
      };
    }
    
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    // Mock registration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      message: 'Registration successful! Please login with your credentials.'
    };
  },

  logout: async () => {
    // Mock logout
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    return { success: true };
  },

  getProfile: async () => {
    // Mock profile fetch
    const userData = localStorage.getItem('user_data');
    if (userData) {
      return { user: JSON.parse(userData) };
    }
    throw new Error('No user data found');
  }
};