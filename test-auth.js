// Simple test script to verify authentication
console.log('Testing EventRift Authentication...');

// Test the auth service
import { authService } from './src/services/authService.js';

async function testAuth() {
  try {
    console.log('1. Testing registration...');
    const registerResult = await authService.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'Goer'
    });
    console.log('Registration result:', registerResult);

    console.log('2. Testing login with demo credentials...');
    const loginResult = await authService.login({
      email_or_username: 'goer@test.com',
      password: 'password'
    });
    console.log('Login result:', loginResult);

    console.log('3. Testing profile fetch...');
    const profileResult = await authService.getProfile();
    console.log('Profile result:', profileResult);

    console.log('4. Testing logout...');
    const logoutResult = await authService.logout();
    console.log('Logout result:', logoutResult);

    console.log('✅ All authentication tests passed!');
  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}

// Run tests if this is executed directly
if (typeof window === 'undefined') {
  testAuth();
}