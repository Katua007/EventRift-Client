// This file contains utility functions to test our API services
// Use these functions to check if all our backend services are working correctly

import { authService } from '../services/authService.js';
import { eventsService } from '../services/eventsService.js';
import { paymentsService } from '../services/paymentsService.js';
import { vendorService } from '../services/vendorService.js';
import { mpesaService } from '../services/mpesaService.js';

// Main function that tests all our API services
// Returns a results object showing which services are working
export const runAPITests = async () => {
  console.log('Starting API Tests...');
  const results = {};

  // Check if we can get a list of events from the server
  try {
    console.log('Testing Events Service...');
    const events = await eventsService.getEvents();
    results.events = { success: true, count: events.events?.length || 0 };
    console.log('Events Service: Working');
  } catch (error) {
    results.events = { success: false, error: error.message };
    console.log('Events Service: Failed');
  }

  // Check if we can get details for a specific event
  try {
    const event = await eventsService.getEvent('1');
    results.singleEvent = { success: true, title: event.event?.title };
    console.log('Single Event: Working');
  } catch (error) {
    results.singleEvent = { success: false, error: error.message };
    console.log('Single Event: Failed');
  }

  // Check if M-Pesa payment service is available
  try {
    console.log('Testing M-Pesa Service...');
    const token = await mpesaService.getAccessToken();
    results.mpesa = { success: true, hasToken: !!token };
    console.log('M-Pesa Service: Working');
  } catch (error) {
    results.mpesa = { success: false, error: error.message };
    console.log('M-Pesa Service: Failed');
  }

  // Check if authentication service has the right methods (without actually logging in)
  try {
    console.log('Testing Auth Service structure...');
    const hasLoginMethod = typeof authService.login === 'function';
    const hasRegisterMethod = typeof authService.register === 'function';
    results.auth = {
      success: hasLoginMethod && hasRegisterMethod,
      methods: { login: hasLoginMethod, register: hasRegisterMethod }
    };
    console.log('Auth Service: Structure OK');
  } catch (error) {
    results.auth = { success: false, error: error.message };
    console.log('Auth Service: Failed');
  }

  console.log('API Test Results:', results);
  return results;
};

// Simple function to check if our server is reachable
// This tests basic connectivity to our backend
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