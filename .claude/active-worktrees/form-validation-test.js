// Form Validation UX Testing Script
// Purpose: Validate the form-validation-fix worktree implementation
// Agent: smartpack-ux-flow-optimizer

console.log('🔍 Starting Form Validation UX Testing...');

// Test environment URLs
const FRONTEND_URL = 'http://localhost:5174';
const BACKEND_URL = 'http://localhost:3000';

// Test the backend health first
async function testBackendHealth() {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend Health:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend Health Failed:', error.message);
    return false;
  }
}

// Test form validation logic from the application
async function testFormValidation() {
  console.log('\n📝 Testing Form Validation Logic...');
  
  // Test data scenarios
  const testCases = [
    {
      name: 'Empty Form',
      data: {
        tripName: '',
        destinations: [''],
        travelModes: [],
        startDate: '',
        endDate: ''
      },
      expectedValid: false,
      description: 'Should be invalid when all fields are empty'
    },
    {
      name: 'Complete Valid Form',
      data: {
        tripName: 'Summer Vacation',
        destinations: ['Paris'],
        travelModes: ['Plane'],
        startDate: '2025-08-15',
        endDate: '2025-08-25'
      },
      expectedValid: true,
      description: 'Should be valid when all required fields are filled'
    },
    {
      name: 'Missing Travel Modes',
      data: {
        tripName: 'Business Trip',
        destinations: ['London'],
        travelModes: [], // Empty travel modes - suspected main issue
        startDate: '2025-08-20',
        endDate: '2025-08-22'
      },
      expectedValid: false,
      description: 'Should be invalid when no travel modes selected'
    },
    {
      name: 'Multiple Destinations and Travel Modes',
      data: {
        tripName: 'European Tour',
        destinations: ['Paris', 'Rome', 'Berlin'],
        travelModes: ['Plane', 'Train'],
        startDate: '2025-09-01',
        endDate: '2025-09-15'
      },
      expectedValid: true,
      description: 'Should be valid with multiple destinations and travel modes'
    }
  ];

  // Import the validation function to test it directly
  try {
    // This is a simplified test of the validation logic
    // In a real browser environment, we would interact with the actual form
    console.log('📋 Test Cases to Validate:');
    testCases.forEach((testCase, index) => {
      console.log(`${index + 1}. ${testCase.name}: ${testCase.description}`);
      console.log(`   Expected Valid: ${testCase.expectedValid}`);
      console.log(`   Travel Modes: [${testCase.data.travelModes.join(', ')}]`);
      console.log('');
    });
    
    return testCases;
  } catch (error) {
    console.error('❌ Form validation test failed:', error.message);
    return [];
  }
}

// Test form submission flow
async function testFormSubmission() {
  console.log('\n🚀 Testing Form Submission Flow...');
  
  const sampleTripData = {
    tripName: 'UX Test Trip',
    destinations: ['Paris, France'],
    travelModes: ['Plane'],
    startDate: '2025-08-15',
    endDate: '2025-08-20',
    preferences: ['Business travel, need professional attire']
  };

  try {
    // Test the backend generate endpoint directly
    console.log('📤 Testing backend /generate endpoint...');
    const response = await fetch(`${BACKEND_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleTripData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Backend generate endpoint working');
      console.log('📦 Response includes:', Object.keys(result));
      return true;
    } else {
      console.error('❌ Backend generate endpoint failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Form submission test failed:', error.message);
    return false;
  }
}

// Main test execution
async function runUXValidation() {
  console.log('🎯 Form Validation Fix - UX Flow Validation');
  console.log('==============================================\n');

  const results = {
    backendHealth: false,
    formValidation: [],
    formSubmission: false,
    overallAssessment: 'TESTING'
  };

  // Test 1: Backend Health
  console.log('PHASE 1: Backend Integration Test');
  results.backendHealth = await testBackendHealth();

  // Test 2: Form Validation Logic
  console.log('\nPHASE 2: Form Validation Logic Test');
  results.formValidation = await testFormValidation();

  // Test 3: Form Submission Flow
  console.log('\nPHASE 3: Form Submission Flow Test');
  if (results.backendHealth) {
    results.formSubmission = await testFormSubmission();
  } else {
    console.log('⏭️  Skipping submission test - backend not available');
  }

  // Overall Assessment
  console.log('\n📊 UX VALIDATION SUMMARY');
  console.log('========================');
  console.log(`Backend Health: ${results.backendHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Form Validation Tests: ${results.formValidation.length > 0 ? '✅ PREPARED' : '❌ FAIL'}`);
  console.log(`Form Submission: ${results.formSubmission ? '✅ PASS' : '❌ FAIL'}`);

  // Determine overall assessment
  if (results.backendHealth && results.formSubmission && results.formValidation.length > 0) {
    results.overallAssessment = 'BACKEND_FUNCTIONAL_NEED_FRONTEND_TEST';
    console.log('\n🎯 ASSESSMENT: Backend functional, need manual frontend validation');
    console.log('📋 NEXT STEPS:');
    console.log('   1. Open browser to http://localhost:5174');
    console.log('   2. Navigate to trip creation form');
    console.log('   3. Test each validation scenario manually');
    console.log('   4. Verify submit button behavior');
    console.log('   5. Confirm form submission leads to AI generation');
  } else {
    results.overallAssessment = 'SHIP_BLOCKER_DETECTED';
    console.log('\n❌ ASSESSMENT: Ship-blocking issues detected');
  }

  return results;
}

// Run the validation if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runUXValidation, testBackendHealth, testFormValidation, testFormSubmission };
} else {
  // Run in browser environment
  runUXValidation().then(results => {
    console.log('\n✅ UX Validation Complete');
    console.log('Results:', results);
  });
}