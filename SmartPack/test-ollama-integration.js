// test-generate-endpoint.js
// Test script to verify the Ollama generate endpoint is working

import fetch from 'node-fetch';

const testData = {
  trip: {
    name: "Beach Vacation",
    startDate: "2025-08-01",
    endDate: "2025-08-05",
    destinations: ["Hawaii"],
    travelModes: ["plane"],
    tripDetails: "Relaxing beach vacation with swimming and sunbathing"
  },
  weather: [
    {
      location: "Hawaii",
      temperature: 28,
      conditions: "Sunny",
      precipitation: 0
    }
  ]
};

async function testGenerateEndpoint() {
  try {
    console.log('🧪 Testing /generate endpoint with Ollama AI...');

    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ Endpoint responded successfully!');
    console.log('📋 Generated checklist items:', result.checklist?.length || 0);
    console.log('💡 Suggested items:', result.suggestedItems?.length || 0);

    if (result.aiGenerated === false) {
      console.log('⚠️  Using fallback mode. Reason:', result.fallbackReason);
    } else {
      console.log('🤖 AI generation successful!');
    }

    // Show first few items as example
    if (result.checklist && result.checklist.length > 0) {
      console.log('\n📝 Sample checklist items:');
      result.checklist.slice(0, 5).forEach(item => {
        console.log(`  - ${item.text} (${item.category})`);
      });
    }

    if (result.suggestedItems && result.suggestedItems.length > 0) {
      console.log('\n💭 Sample suggestions:');
      result.suggestedItems.slice(0, 3).forEach(item => {
        console.log(`  - ${item}`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   npm run lambda:dev');
    }
  }
}

// Test custom suggestions endpoint too
async function testSuggestionsEndpoint() {
  try {
    console.log('\n🧪 Testing /suggestions endpoint...');

    const response = await fetch('http://localhost:3000/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customPrompt: "beach volleyball and water sports",
        trip: testData.trip,
        weather: testData.weather
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    console.log('✅ Suggestions endpoint responded successfully!');
    console.log('💡 Custom suggestions:', result.suggestedItems?.length || 0);

    if (result.suggestedItems && result.suggestedItems.length > 0) {
      console.log('\n🏐 Custom suggestions for beach volleyball/water sports:');
      result.suggestedItems.forEach(item => {
        console.log(`  - ${item}`);
      });
    }

  } catch (error) {
    console.error('❌ Suggestions test failed:', error.message);
  }
}

// Run tests
console.log('🚀 Starting Ollama integration tests...\n');

setTimeout(async () => {
  await testGenerateEndpoint();
  await testSuggestionsEndpoint();
}, 1000);
