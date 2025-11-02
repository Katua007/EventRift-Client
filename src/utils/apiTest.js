// API Test Utility - Run this to verify all services are working
import { authService } from '../services/authService.js';
import { eventsService } from '../services/eventsService.js';
import { paymentsService } from '../services/paymentsService.js';
import { vendorService } from '../services/vendorService.js';
import { mpesaService } from '../services/mpesaService.js';

export const runAPITests = async () => {
  console.log('🧪 Starting API Tests...');
  const results = {};

  // Test Events Service
  try {
    console.log('📅 Testing Events Service...');
    const events = await eventsService.getEvents();
    results.events = { success: true, count: events.events?.length || 0 };
    console.log('✅ Events Service: Working');
  } catch (error) {
    results.events = { success: false, error: error.message };
    console.log('❌ Events Service: Failed');
  }

  // Test Single Event
  try {
    const event = await eventsService.getEvent('1');
    results.singleEvent = { success: true, title: event.event?.title };
    console.log('✅ Single Event: Working');
  } catch (error) {
    results.singleEvent = { success: false, error: error.message };
    console.log('❌ Single Event: Failed');
  }

  // Test M-Pesa Service
  try {
    console.log('💳 Testing M-Pesa Service...');
    const token = await mpesaService.getAccessToken();
    results.mpesa = { success: true, hasToken: !!token };
    console.log('✅ M-Pesa Service: Working');
  } catch (error) {
    results.mpesa = { success: false, error: error.message };
    console.log('❌ M-Pesa Service: Failed');
  }

  // Test Auth Service (without actual login)
  try {
    console.log('🔐 Testing Auth Service structure...');
    const hasLoginMethod = typeof authService.login === 'function';
    const hasRegisterMethod = typeof authService.register === 'function';
    results.auth = { 
      success: hasLoginMethod && hasRegisterMethod,
      methods: { login: hasLoginMethod, register: hasRegisterMethod }
    };
    console.log('✅ Auth Service: Structure OK');
  } catch (error) {
    results.auth = { success: false, error: error.message };
    console.log('❌ Auth Service: Failed');
  }

  console.log('🧪 API Test Results:', results);
  return results;
};

// Helper function to test API connectivity
export const testAPIConnectivity = async () => {
  try {
    const response = await fetch('https://eventrift-server.onrender.com/api/health', {
      method: 'GET',
      timeout: 5000
    });
    return { connected: response.ok, status: response.status };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};