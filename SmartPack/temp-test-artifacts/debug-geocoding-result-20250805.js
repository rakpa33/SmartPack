// Direct test of geocoding API to understand the issue
// Created: 2025-08-05 21:45

const { geocodeCity } = require('../src/utils/geocode.ts');

async function testGeocoding() {
  console.log('🔍 Testing geocoding function directly...');
  
  try {
    const result = await geocodeCity('Osaka');
    console.log('📍 Geocoding result for Osaka:', result);
    
    if (result) {
      console.log('✅ API returned result:');
      console.log('  - lat:', result.lat);
      console.log('  - lon:', result.lon);
      console.log('  - display_name:', result.display_name);
      console.log('  - display_name !== "Osaka":', result.display_name !== 'Osaka');
    } else {
      console.log('❌ API returned null');
    }
  } catch (error) {
    console.error('❌ Error testing geocoding:', error);
  }
}

// Also test the API directly
async function testDirectAPI() {
  console.log('\n🌐 Testing direct API call...');
  
  try {
    const response = await fetch(
      'https://nominatim.openstreetmap.org/search?q=Osaka&format=json&limit=1',
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SmartPack/1.0',
        },
      }
    );
    
    const data = await response.json();
    console.log('📊 Direct API response:', data);
    
    if (data && data.length > 0) {
      console.log('✅ API returned data:');
      console.log('  - display_name:', data[0].display_name);
      console.log('  - lat:', data[0].lat);
      console.log('  - lon:', data[0].lon);
    }
  } catch (error) {
    console.error('❌ Direct API error:', error);
  }
}

// Run tests
testGeocoding();
testDirectAPI();