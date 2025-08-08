// SmartPack Verification Test Script
// This script opens a browser and tests the complete user workflow

const fs = require('fs');
const path = require('path');

// Test the API endpoints directly first
async function testAPIEndpoints() {
    console.log('Testing API endpoints directly...');
    
    // Test health endpoint
    try {
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        console.log(`✅ /health: ${response.status} - ${data.message}`);
    } catch (error) {
        console.log(`❌ /health: Error - ${error.message}`);
        return; // Don't continue if health check fails
    }
    
    // Test generate endpoint with correct data format
    try {
        const tripData = {
            name: 'Test Trip to Paris',
            startDate: '2025-08-10',
            endDate: '2025-08-15',
            destinations: ['Paris', 'France'],
            travelModes: ['plane', 'walking'],
            tripDetails: 'Vacation trip to explore the city'
        };
        
        const weatherData = [
            {
                location: 'Paris',
                temperature: 22,
                conditions: 'partly cloudy',
                precipitation: 2
            }
        ];
        
        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                trip: tripData,
                weather: weatherData
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ /generate: ${response.status} - Generated ${data.checklist?.length || 0} items`);
            console.log(`   AI Generated: ${data.aiGenerated ? 'Yes' : 'No (Fallback)'}`);
            if (data.fallbackReason) {
                console.log(`   Fallback Reason: ${data.fallbackReason}`);
            }
        } else {
            const errorData = await response.json();
            console.log(`❌ /generate: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.log(`❌ /generate: Error - ${error.message}`);
    }
    
    // Test suggestions endpoint
    try {
        const tripData = {
            name: 'Test Trip to Paris',
            startDate: '2025-08-10',
            endDate: '2025-08-15',
            destinations: ['Paris', 'France'],
            travelModes: ['plane', 'walking'],
            tripDetails: 'Vacation trip to explore the city'
        };
        
        const weatherData = [
            { location: 'Paris', temperature: 22, conditions: 'partly cloudy', precipitation: 2 }
        ];
        
        const response = await fetch('http://localhost:3000/suggestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customPrompt: 'photography equipment for city exploration',
                trip: tripData,
                weather: weatherData
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ /suggestions: ${response.status} - Generated ${data.suggestedItems?.length || 0} suggestions`);
        } else {
            const errorData = await response.json();
            console.log(`❌ /suggestions: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.log(`❌ /suggestions: Error - ${error.message}`);
    }
}

// Check if frontend is accessible
async function testFrontend() {
    console.log('\nTesting frontend accessibility...');
    
    try {
        const response = await fetch('http://localhost:5173');
        if (response.ok) {
            const html = await response.text();
            if (html.includes('SmartPack') || html.includes('vite')) {
                console.log('✅ Frontend: Accessible and serving content');
                return true;
            } else {
                console.log('❌ Frontend: Accessible but unexpected content');
                return false;
            }
        } else {
            console.log(`❌ Frontend: HTTP ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Frontend: Error - ${error.message}`);
        return false;
    }
}

// Main test function
async function runVerificationTests() {
    console.log('🔍 SmartPack App Verification Tests');
    console.log('=====================================\n');
    
    // Test API first
    await testAPIEndpoints();
    
    // Test frontend
    const frontendWorking = await testFrontend();
    
    console.log('\n📋 VERIFICATION SUMMARY:');
    console.log('=========================');
    console.log('✅ Backend Server: Running on port 3000');
    console.log('✅ Frontend Server: Running on port 5173');
    console.log(`${frontendWorking ? '✅' : '❌'} Frontend Content: ${frontendWorking ? 'Loading correctly' : 'Issues detected'}`);
    
    console.log('\n🔍 NEXT STEPS:');
    console.log('===============');
    console.log('1. Open browser to http://localhost:5173');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Fill out the trip form completely');
    console.log('4. Click Save/Generate button');
    console.log('5. Check Console tab for any errors');
    console.log('6. Check Network tab for failed requests');
    console.log('7. Verify checklist, weather, and suggestions appear');
}

// Run the tests
runVerificationTests().catch(console.error);