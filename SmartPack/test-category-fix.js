// Quick test for category naming fix
import http from 'http';

const testData = JSON.stringify({
  trip: {
    name: "Business Conference",
    startDate: "2024-01-15",
    endDate: "2024-01-17",
    destinations: ["Chicago"],
    travelModes: ["plane"],
    tripDetails: "Corporate presentation and networking"
  },
  weather: [{
    location: "Chicago",
    temperature: 5,
    conditions: "clear",
    precipitation: 0
  }]
});

console.log('🧪 Testing Category Naming Fix...');
console.log('Expected: "Business", "Documents", "Electronics" (not "Business Items", etc.)');

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

const req = http.request(options, (res) => {
  let response = '';
  res.on('data', chunk => response += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(response);

      if (result.aiGenerated) {
        const categories = [...new Set(result.checklist.map(item => item.category))];
        console.log('\n✅ Categories Generated:');
        categories.forEach(cat => {
          const isGood = cat.length < 15 && !cat.includes(':') && !cat.includes('Gear') && !cat.includes('Items');
          console.log(`   ${isGood ? '✅' : '❌'} "${cat}"`);
        });

        console.log('\n📋 Sample Items:');
        result.checklist.slice(0, 5).forEach(item => {
          console.log(`   • ${item.text} (${item.category})`);
        });
      } else {
        console.log('⚠️ Using fallback:', result.fallbackReason);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Connection error:', error.message);
});

req.write(testData);
req.end();
