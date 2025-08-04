// Debug script to test Nominatim geocoding API directly for Osaka
console.log('🔍 Testing Nominatim geocoding API for Osaka...');

async function testNominatimOsaka() {
  const city = 'Osaka';
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
  
  console.log('📡 Making request to:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'SmartPack/1.0',
      },
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    
    if (!response.ok) {
      console.log('❌ Response not ok');
      return;
    }

    const data = await response.json();
    console.log('📄 Raw API response:', JSON.stringify(data, null, 2));
    
    if (!data || data.length === 0) {
      console.log('❌ No data returned');
      return;
    }

    const result = data[0];
    console.log('🏙️  First result analysis:');
    console.log('  - lat:', result.lat);
    console.log('  - lon:', result.lon);
    console.log('  - display_name:', result.display_name);
    console.log('  - Expected display_name contains Japan?', result.display_name.includes('Japan'));
    
    // What our geocode function would return
    const geocodeResult = {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      display_name: result.display_name,
    };
    
    console.log('🔧 Our geocode function would return:', JSON.stringify(geocodeResult, null, 2));
    
    // Check if display_name is different from input (which triggers the update)
    console.log('📊 Comparison:');
    console.log('  - Input city:', city);
    console.log('  - API display_name:', result.display_name);
    console.log('  - Are they different?', result.display_name !== city);
    console.log('  - Would trigger update?', result.display_name !== city);
    
    if (result.display_name === city) {
      console.log('❌ PROBLEM IDENTIFIED: API display_name matches input exactly');
      console.log('❌ This means the condition `geo.display_name !== city` is false');
      console.log('❌ Therefore, no destination update occurs');
    } else {
      console.log('✅ API display_name differs from input - update should occur');
    }
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
  }
}

// Also test other cities for comparison
async function testMultipleCities() {
  const cities = ['Osaka', 'Tokyo', 'Paris', 'London', 'Berlin'];
  
  console.log('\n🌍 Testing multiple cities for comparison...');
  
  for (const city of cities) {
    console.log(`\n🏙️  Testing ${city}:`);
    
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'SmartPack/1.0',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          console.log(`  Input: "${city}"`);
          console.log(`  API result: "${result.display_name}"`);
          console.log(`  Different?: ${result.display_name !== city}`);
        } else {
          console.log(`  ❌ No results for ${city}`);
        }
      } else {
        console.log(`  ❌ Request failed for ${city}`);
      }
    } catch (error) {
      console.log(`  ❌ Error for ${city}:`, error.message);
    }
    
    // Small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Run the tests
testNominatimOsaka()
  .then(() => testMultipleCities())
  .then(() => console.log('\n✅ Geocoding API testing complete'))
  .catch(console.error);