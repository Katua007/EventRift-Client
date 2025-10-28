// Mock auth service with localStorage persistence
const USERS_KEY = 'eventrift_users';
const CURRENT_USER_KEY = 'eventrift_current_user';

// Initialize with demo users if not exists
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const demoUsers = {
      'goer@test.com': {
        id: 1,
        username: 'John Doe',
        email: 'goer@test.com',
        password: 'password',
        role: 'Goer',
        createdAt: new Date().toISOString()
      },
      'organizer@test.com': {
        id: 2,
        username: 'Jane Smith',
        email: 'organizer@test.com',
        password: 'password',
        role: 'Organizer',
        createdAt: new Date().toISOString()
      },
      'vendor@test.com': {
        id: 3,
        username: 'Mike Johnson',
        email: 'vendor@test.com',
        password: 'password',
        role: 'Vendor',
        createdAt: new Date().toISOString()
      }
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  }
};

// Initialize demo users on load
initializeDemoUsers();

export const authService = {
  login: async (credentials) => {
    const { email, password } = credentials;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user exists and password matches
    const user = users[email] || users[credentials.email_or_username];
    
    // Also check by username
    if (!user) {
      const userByUsername = Object.values(users).find(u => u.username === credentials.email_or_username);
      if (userByUsername && userByUsername.password === password) {
        const { password: _, ...userWithoutPassword } = userByUsername;
        const token = 'mock-jwt-token-' + Date.now();
        
        // Store current user session
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
        
        return { token, user: userWithoutPassword };
      }
    }
    
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      const token = 'mock-jwt-token-' + Date.now();
      
      // Store current user session
      localStorage.setItem('jwt_token', token);
      localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
      
      return { token, user: userWithoutPassword };
    }
    
    throw new Error('Invalid email/username or password');
  },

  register: async (userData) => {
    const { username, email, password, role } = userData;
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (users[email]) {
      throw new Error('User with this email already exists');
    }
    
    // Check if username is taken
    const existingUsername = Object.values(users).find(u => u.username === username);
    if (existingUsername) {
      throw new Error('Username is already taken');
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      username,
      email,
      password,
      role,
      createdAt: new Date().toISOString()
    };
    
    // Save user
    users[email] = newUser;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    return {
      message: 'Registration successful! You can now login with your credentials.',
      success: true
    };
  },

  logout: async () => {
    // Clear session
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    return { success: true };
  },

  getProfile: async () => {
    const token = localStorage.getItem('jwt_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      return { user: JSON.parse(userData) };
    }
    
    throw new Error('No valid session found');
  },

  // Helper method to get all users (for debugging)
  getAllUsers: () => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  },

  // Helper method to clear all data (for testing)
  clearAllData: () => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    initializeDemoUsers();
  }
};