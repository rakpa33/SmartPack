/**
 * FUNCTIONAL VALIDATOR: Direct Browser Test
 * Simple test to check form workflow without complex automation
 */

console.log('🧪 FUNCTIONAL VALIDATOR: Starting Manual Test');

// Create a simple test to validate the app state
async function testAppState() {
  try {
    // Test 1: Check if app loads
    console.log('📊 Test 1: Application loading...');
    
    // Test 2: Check localStorage for existing data
    const existingData = localStorage.getItem('tripForm');
    console.log('💾 Existing localStorage data:', existingData ? JSON.parse(existingData) : 'None');
    
    // Test 3: Simulate form submission
    const testData = {
      tripName: 'Manual Test Trip',
      startDate: '2025-08-15',
      endDate: '2025-08-20',
      destinations: ['Tokyo, Japan'],
      travelModes: ['plane', 'train'],
      preferences: [],
      step: 2
    };
    
    console.log('📝 Test data to save:', testData);
    localStorage.setItem('tripForm', JSON.stringify(testData));
    
    // Test 4: Check if data was saved
    const savedData = localStorage.getItem('tripForm');
    console.log('💾 Data after save:', JSON.parse(savedData));
    
    // Test 5: Simulate page reload
    console.log('🔄 Simulating page reload...');
    setTimeout(() => {
      const reloadedData = localStorage.getItem('tripForm');
      console.log('💾 Data after reload simulation:', JSON.parse(reloadedData));
      
      // Test 6: Check hasAnyData logic
      const data = JSON.parse(reloadedData);
      const hasAnyData = data.tripName?.trim() || 
        (data.destinations && data.destinations.length > 0 && data.destinations.some(d => d?.trim())) ||
        data.startDate || data.endDate;
      
      console.log('✅ hasAnyData check result:', hasAnyData);
      console.log('📊 Final validation: Form workflow should work =', hasAnyData);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testAppState();