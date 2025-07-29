// Test enhanced Ollama AI with flexible categories
import http from 'http';

const testData = JSON.stringify({
  trip: {
    name: "Photography Workshop in Iceland",
    startDate: "2024-02-15",
    endDate: "2024-02-22",
    destinations: ["Reykjavik", "Blue Lagoon", "Golden Circle"],
    travelModes: ["plane", "rental car"],
    tripDetails: "Winter photography workshop focusing on Northern Lights, waterfalls, and ice caves"
  },
  weather: [{
    location: "Reykjavik",
    temperature: -2,
    conditions: "snow and wind",
    precipitation: 8
  }]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

console.log('🧪 Testing Enhanced Ollama AI with Flexible Categories...\n');
console.log('📸 Trip: Photography Workshop in Iceland (Winter)');
console.log('❄️ Weather: -2°C, snow and wind');
console.log('🎯 Expecting contextual categories like: Photography Gear, Cold Weather Gear, etc.\n');

const req = http.request(options, (res) => {
  let response = '';
  res.on('data', chunk => response += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(response);

      if (result.aiGenerated) {
        console.log('✅ Ollama AI Generated Response!\n');

        // Extract unique categories
        const categories = [...new Set(result.checklist.map(item => item.category))];
        console.log('📂 Smart Categories Created by AI:');
        categories.forEach(cat => {
          console.log(`   • ${cat}`);
        });

        console.log('\n📋 Sample Items by Category:');
        categories.slice(0, 3).forEach(category => {
          const items = result.checklist.filter(item => item.category === category);
          console.log(`\n   ${category.toUpperCase()}:`);
          items.slice(0, 3).forEach(item => {
            console.log(`     - ${item.text}`);
          });
        });

        console.log('\n💡 AI Suggestions:');
        result.suggestedItems.slice(0, 5).forEach(item => {
          console.log(`   • ${item}`);
        });

        console.log('\n🎉 Enhanced AI successfully created contextual categories!');
      } else {
        console.log('⚠️ Using fallback data:', result.fallbackReason);
      }
    } catch (error) {
      console.log('❌ Parse error:', error.message);
      console.log('Response snippet:', response.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(testData);
req.end();
