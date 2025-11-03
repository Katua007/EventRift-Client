#!/usr/bin/env node
/**
 * Integration test to verify frontend-backend connectivity
 */

import axios from 'axios';

const BASE_URL = 'https://eventrift-server.onrender.com';
const FRONTEND_ORIGIN = 'https://event-rift-client.vercel.app';

async function testIntegration() {
    console.log('🔗 Testing Frontend-Backend Integration');
    console.log('='.repeat(50));

    try {
        // Test 1: Login
        console.log('1. Testing Login...');
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
            email: 'test@example.com',
            password: 'password'
        }, {
            headers: { 'Origin': FRONTEND_ORIGIN }
        });

        if (loginResponse.data.success) {
            const token = loginResponse.data.access_token;
            console.log('✅ Login successful');

            // Test 2: Profile
            console.log('2. Testing Profile...');
            const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Origin': FRONTEND_ORIGIN 
                }
            });

            if (profileResponse.data.success) {
                console.log('✅ Profile retrieval successful');

                // Test 3: Events
                console.log('3. Testing Events...');
                const eventsResponse = await axios.get(`${BASE_URL}/api/events`, {
                    headers: { 'Origin': FRONTEND_ORIGIN }
                });

                if (eventsResponse.data.success) {
                    console.log(`✅ Events retrieval successful (${eventsResponse.data.events.length} events)`);

                    console.log('\n🎉 All integration tests passed!');
                    console.log('Frontend should now connect successfully to backend.');
                }
            }
        }
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testIntegration();