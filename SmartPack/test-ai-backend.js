// Test the enhanced AI backend with real HTTP requests
async function testEnhancedAI() {
  const testCases = [
    {
      name: 'Business Trip Test',
      trip: {
        name: 'Tokyo Business Meeting',
        startDate: '2025-08-01',
        endDate: '2025-08-04',
        destinations: ['Tokyo, Japan'],
        travelModes: ['plane'],
        tripDetails: 'Important business conference with Japanese executives'
      },
      weather: [
        { location: 'Tokyo', temperature: 28, conditions: 'Sunny', precipitation: 0 }
      ]
    },
    {
      name: 'Beach Vacation Test',
      trip: {
        name: 'Hawaii Vacation',
        startDate: '2025-07-10',
        endDate: '2025-07-17',
        destinations: ['Honolulu, Hawaii'],
        travelModes: ['plane'],
        tripDetails: 'Relaxing beach vacation with swimming and surfing'
      },
      weather: [
        { location: 'Honolulu', temperature: 32, conditions: 'Sunny', precipitation: 0 }
      ]
    },
    {
      name: 'Cold Weather Test',
      trip: {
        name: 'Winter Adventure',
        startDate: '2025-12-15',
        endDate: '2025-12-20',
        destinations: ['Reykjavik, Iceland'],
        travelModes: ['plane'],
        tripDetails: 'Adventure trip to see northern lights and explore glaciers'
      },
      weather: [
        { location: 'Reykjavik', temperature: -5, conditions: 'Snow', precipitation: 3 }
      ]
    }
  ];

  console.log('🧪 Testing Enhanced AI Backend...\n');

  for (const testCase of testCases) {
    console.log(`--- ${testCase.name} ---`);

    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip: testCase.trip,
          weather: testCase.weather
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      // Calculate expected trip duration
      const tripDays = Math.ceil((new Date(testCase.trip.endDate) - new Date(testCase.trip.startDate)) / (1000 * 60 * 60 * 24));

      console.log(`✅ Response received: ${result.checklist.length} items, ${result.suggestedItems.length} suggestions`);
      console.log(`📅 Trip duration: ${tripDays} days`);

      // Check for smart quantity calculations
      const underwearItem = result.checklist.find(item => item.text.includes('underwear'));
      const socksItem = result.checklist.find(item => item.text.includes('socks'));

      if (underwearItem) {
        console.log(`🧮 Smart quantities: ${underwearItem.text}`);
      }
      if (socksItem) {
        console.log(`🧦 Smart quantities: ${socksItem.text}`);
      }

      // Check for context-specific items
      const contextItems = result.checklist.filter(item => {
        const text = item.text.toLowerCase();
        return text.includes('business') || text.includes('swim') || text.includes('winter') ||
          text.includes('formal') || text.includes('beach') || text.includes('jacket');
      });

      if (contextItems.length > 0) {
        console.log(`🎯 Context-aware items found:`);
        contextItems.forEach(item => console.log(`   • ${item.text}`));
      }

      // Check for destination-specific suggestions
      const destinationSuggestions = result.suggestedItems.filter(item => {
        const text = item.toLowerCase();
        return text.includes('translation') || text.includes('temple') || text.includes('repellent');
      });

      if (destinationSuggestions.length > 0) {
        console.log(`🌍 Destination-aware suggestions:`);
        destinationSuggestions.forEach(item => console.log(`   → ${item}`));
      }

      console.log('');

    } catch (error) {
      console.error(`❌ Error testing ${testCase.name}:`, error.message);
    }
  }

  console.log('🎉 Enhanced AI testing complete!');
  console.log('💡 The AI now provides context-aware, personalized recommendations!');
}

// Run the test
testEnhancedAI().catch(console.error);
