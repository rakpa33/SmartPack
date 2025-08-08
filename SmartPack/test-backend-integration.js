#!/usr/bin/env node
/**
 * Backend Integration Test Script
 * Tests the complete flow of the SmartPack backend integration
 * 
 * Usage: node test-backend-integration.js
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const API_URL = 'http://localhost:3000';
const FRONTEND_URL = 'http://localhost:5173';
const OLLAMA_URL = 'http://localhost:11434';

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(60));
}

async function checkBackendHealth() {
  logSection('1. CHECKING BACKEND HEALTH');
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      log('✅ Backend server is running', colors.green);
      log(`   Message: ${data.message}`, colors.green);
      return true;
    } else {
      log('❌ Backend health check failed', colors.red);
      return false;
    }
  } catch (error) {
    log('❌ Backend server not responding on port 3000', colors.red);
    log('   Please start the backend: npm run lambda:dev', colors.yellow);
    log('   Or run both servers: npm run dev:all', colors.yellow);
    return false;
  }
}

async function checkOllamaService() {
  logSection('2. CHECKING OLLAMA SERVICE');
  
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      log('✅ Ollama service is running', colors.green);
      log(`   Available models:`, colors.green);
      data.models.forEach(model => {
        const sizeGB = (model.size / 1e9).toFixed(2);
        log(`   - ${model.name} (${sizeGB} GB)`, colors.blue);
      });
      
      const hasRequiredModel = data.models.some(m => 
        m.name.includes('llama3.1:8b') || m.name.includes('llama3.1')
      );
      
      if (hasRequiredModel) {
        log('✅ Required model llama3.1:8b is available', colors.green);
      } else {
        log('⚠️  llama3.1:8b model not found', colors.yellow);
        log('   Install with: ollama pull llama3.1:8b', colors.yellow);
        log('   App will use fallback mock data', colors.yellow);
      }
      return true;
    } else {
      log('⚠️  Ollama has no models installed', colors.yellow);
      log('   App will use fallback mock data', colors.yellow);
      return false;
    }
  } catch (error) {
    log('⚠️  Ollama service not running on port 11434', colors.yellow);
    log('   App will use fallback mock data instead of AI', colors.yellow);
    log('   To enable AI: ollama serve', colors.yellow);
    return false;
  }
}

async function testGenerateEndpoint() {
  logSection('3. TESTING /generate ENDPOINT');
  
  const testData = {
    trip: {
      name: 'Test Trip to Tokyo',
      tripName: 'Test Trip to Tokyo',
      startDate: '2025-08-15',
      endDate: '2025-08-20',
      destinations: ['Tokyo', 'Kyoto'],
      travelModes: ['plane', 'train'],
      tripDetails: 'Business conference with some sightseeing'
    },
    weather: [
      {
        location: 'Tokyo',
        temperature: 25,
        conditions: 'partly cloudy',
        precipitation: 2
      },
      {
        location: 'Kyoto',
        temperature: 23,
        conditions: 'sunny',
        precipitation: 0
      }
    ]
  };
  
  try {
    log('📡 Sending POST request to /generate...', colors.blue);
    const startTime = Date.now();
    
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const data = await response.json();
    
    if (response.ok && data.checklist) {
      log(`✅ Generate endpoint working (${responseTime}s)`, colors.green);
      log(`   Generated ${data.checklist.length} checklist items`, colors.green);
      log(`   AI-generated: ${data.aiGenerated ? 'Yes (Ollama)' : 'No (using fallback)'}`, 
        data.aiGenerated ? colors.green : colors.yellow);
      
      if (data.suggestedItems && data.suggestedItems.length > 0) {
        log(`   Suggestions: ${data.suggestedItems.length} items`, colors.green);
      }
      
      // Show sample items
      log('\n   Sample checklist items:', colors.cyan);
      data.checklist.slice(0, 3).forEach(item => {
        log(`   - [${item.category}] ${item.text}`, colors.blue);
      });
      
      return true;
    } else {
      log('❌ Generate endpoint failed', colors.red);
      if (data.error) log(`   Error: ${data.error}`, colors.red);
      return false;
    }
  } catch (error) {
    log('❌ Failed to call generate endpoint', colors.red);
    log(`   Error: ${error.message}`, colors.red);
    return false;
  }
}

async function testSuggestionsEndpoint() {
  logSection('4. TESTING /suggestions ENDPOINT');
  
  const testData = {
    customPrompt: 'I need photography equipment for the trip',
    trip: {
      name: 'Photography Tour',
      startDate: '2025-08-15',
      endDate: '2025-08-20',
      destinations: ['Tokyo'],
      travelModes: ['plane'],
      tripDetails: 'Photography focused trip'
    },
    weather: [{
      location: 'Tokyo',
      temperature: 25,
      conditions: 'sunny',
      precipitation: 0
    }]
  };
  
  try {
    log('📡 Sending POST request to /suggestions...', colors.blue);
    const startTime = Date.now();
    
    const response = await fetch(`${API_URL}/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
    const data = await response.json();
    
    if (response.ok && data.suggestedItems) {
      log(`✅ Suggestions endpoint working (${responseTime}s)`, colors.green);
      log(`   Generated ${data.suggestedItems.length} suggestions`, colors.green);
      
      log('\n   Suggestions:', colors.cyan);
      data.suggestedItems.forEach(item => {
        log(`   - ${item}`, colors.blue);
      });
      
      return true;
    } else {
      log('❌ Suggestions endpoint failed', colors.red);
      if (data.error) log(`   Error: ${data.error}`, colors.red);
      return false;
    }
  } catch (error) {
    log('❌ Failed to call suggestions endpoint', colors.red);
    log(`   Error: ${error.message}`, colors.red);
    return false;
  }
}

async function checkFrontendIntegration() {
  logSection('5. CHECKING FRONTEND INTEGRATION');
  
  try {
    const response = await fetch(FRONTEND_URL);
    if (response.ok) {
      log('✅ Frontend is running on port 5173', colors.green);
      log('\n📋 MANUAL VERIFICATION STEPS:', colors.cyan);
      log('1. Open browser to http://localhost:5173', colors.blue);
      log('2. Open Browser DevTools (F12) → Console tab', colors.blue);
      log('3. Fill in the trip form completely:', colors.blue);
      log('   - Trip name: Any name', colors.blue);
      log('   - Destinations: Add at least one', colors.blue);
      log('   - Travel modes: Select at least one', colors.blue);
      log('   - Dates: Set start and end dates', colors.blue);
      log('4. Click "Save Trip Details"', colors.blue);
      log('5. Look for "Generate Smart Packing List" button', colors.blue);
      log('\n🔍 DEBUG LOGS TO WATCH FOR:', colors.cyan);
      log('   - 🔍 Generate Button Debug (shows why button may be hidden)', colors.blue);
      log('   - 🚀 Generate button clicked!', colors.blue);
      log('   - 🌐 API Call Debug', colors.blue);
      log('   - 📨 API Response', colors.blue);
      return true;
    } else {
      log('⚠️  Frontend not responding on port 5173', colors.yellow);
      log('   Please start the frontend: npm run dev', colors.yellow);
      return false;
    }
  } catch (error) {
    log('⚠️  Frontend not running on port 5173', colors.yellow);
    log('   Please start the frontend: npm run dev', colors.yellow);
    log('   Or run both servers: npm run dev:all', colors.yellow);
    return false;
  }
}

async function runAllTests() {
  console.clear();
  log('\n🔧 SMARTPACK BACKEND INTEGRATION TEST', colors.bright + colors.cyan);
  log('Testing complete backend integration flow\n', colors.cyan);
  
  const results = {
    backend: await checkBackendHealth(),
    ollama: await checkOllamaService(),
    generate: false,
    suggestions: false,
    frontend: false
  };
  
  // Only test endpoints if backend is running
  if (results.backend) {
    results.generate = await testGenerateEndpoint();
    results.suggestions = await testSuggestionsEndpoint();
  }
  
  results.frontend = await checkFrontendIntegration();
  
  // Summary
  logSection('TEST SUMMARY');
  
  const allPassed = Object.values(results).every(v => v);
  const backendWorking = results.backend && results.generate;
  
  log(`Backend Health: ${results.backend ? '✅ PASSED' : '❌ FAILED'}`, 
    results.backend ? colors.green : colors.red);
  log(`Ollama Service: ${results.ollama ? '✅ PASSED' : '⚠️  OPTIONAL'}`, 
    results.ollama ? colors.green : colors.yellow);
  log(`Generate Endpoint: ${results.generate ? '✅ PASSED' : '❌ FAILED'}`, 
    results.generate ? colors.green : colors.red);
  log(`Suggestions Endpoint: ${results.suggestions ? '✅ PASSED' : '❌ FAILED'}`, 
    results.suggestions ? colors.green : colors.red);
  log(`Frontend Running: ${results.frontend ? '✅ YES' : '⚠️  NO'}`, 
    results.frontend ? colors.green : colors.yellow);
  
  console.log('\n' + '='.repeat(60));
  
  if (allPassed) {
    log('✅ ALL TESTS PASSED - Backend integration is working!', colors.bright + colors.green);
    log('\nNext: Open browser and test the full user flow', colors.green);
  } else if (backendWorking) {
    log('✅ BACKEND FUNCTIONAL - Core integration is working!', colors.bright + colors.green);
    if (!results.ollama) {
      log('\nOllama is optional - app uses fallback data when unavailable', colors.yellow);
    }
    if (!results.frontend) {
      log('\nStart frontend with: npm run dev', colors.yellow);
    }
  } else if (!results.backend) {
    log('❌ BACKEND NOT RUNNING - Please start the backend server', colors.bright + colors.red);
    log('\nQuick start:', colors.yellow);
    log('  npm run dev:all    (starts both frontend and backend)', colors.yellow);
    log('\nOr run separately:', colors.yellow);
    log('  npm run lambda:dev (backend only)', colors.yellow);
    log('  npm run dev        (frontend only)', colors.yellow);
  } else {
    log('⚠️  PARTIAL SUCCESS - Some components need attention', colors.bright + colors.yellow);
  }
  
  console.log('='.repeat(60) + '\n');
}

// Run the tests
runAllTests().catch(error => {
  log('❌ Test script error: ' + error.message, colors.red);
  process.exit(1);
});