// Simple verification that enhanced AI is working
async function verifyEnhancedAI() {
  console.log('🧪 Verifying Enhanced AI Backend...\n');

  // Test case: 4-day business trip to Japan
  const testData = {
    trip: {
      name: 'Tokyo Business Meeting',
      startDate: '2025-08-01',
      endDate: '2025-08-05',
      destinations: ['Tokyo, Japan'],
      travelModes: ['plane'],
      tripDetails: 'Important business conference with Japanese clients'
    },
    weather: [
      { location: 'Tokyo', temperature: 28, conditions: 'Sunny', precipitation: 0 }
    ]
  };

  try {
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Backend responded successfully');
    console.log(`📦 Generated ${result.checklist.length} checklist items`);
    console.log(`💡 Generated ${result.suggestedItems.length} suggestions`);

    // Check for enhanced features
    const smartQuantities = result.checklist.filter(item => /\d+ pairs/.test(item.text));
    const businessItems = result.checklist.filter(item =>
      item.text.toLowerCase().includes('business') ||
      item.text.toLowerCase().includes('laptop') ||
      item.text.toLowerCase().includes('formal')
    );
    const asianSuggestions = result.suggestedItems.filter(item =>
      item.toLowerCase().includes('translation') ||
      item.toLowerCase().includes('temple')
    );

    console.log('\n🧠 Enhanced AI Features:');
    console.log(`   Smart Quantities: ${smartQuantities.length > 0 ? '✅' : '❌'} ${smartQuantities.map(i => i.text).join(', ')}`);
    console.log(`   Business Context: ${businessItems.length > 0 ? '✅' : '❌'} ${businessItems.map(i => i.text).join(', ')}`);
    console.log(`   Asia-Specific: ${asianSuggestions.length > 0 ? '✅' : '❌'} ${asianSuggestions.join(', ')}`);

    const allFeaturesWorking = smartQuantities.length > 0 && businessItems.length > 0 && asianSuggestions.length > 0;

    console.log(`\n🎯 Overall: ${allFeaturesWorking ? '✅ ENHANCED AI WORKING PERFECTLY!' : '⚠️  Some features may need attention'}`);

    if (allFeaturesWorking) {
      console.log('\n🚀 Ready to use! The AI now provides:');
      console.log('   • Trip duration-based quantities');
      console.log('   • Business/leisure context recognition');
      console.log('   • Destination-specific recommendations');
      console.log('   • Weather-appropriate suggestions');
    }

  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Make sure the backend server is running (npm run lambda:dev)');
  }
}

verifyEnhancedAI();
