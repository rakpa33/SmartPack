// Simple verification that Ollama is connected and working
import http from 'http';

const data = JSON.stringify({
  trip: {
    name: "Test Trip",
    startDate: "2024-01-15",
    endDate: "2024-01-16",
    destinations: ["Tokyo"],
    travelModes: ["walking"],
    tripDetails: "Quick test"
  },
  weather: [{
    location: "Tokyo",
    temperature: 15,
    conditions: "sunny",
    precipitation: 0
  }]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

console.log('🔍 Quick Ollama verification...');

const req = http.request(options, (res) => {
  let response = '';
  res.on('data', chunk => response += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(response);
      if (result.aiGenerated) {
        console.log('✅ SUCCESS: Ollama is generating AI content!');
        console.log(`📊 Generated ${result.checklist?.length || 0} items`);
        console.log(`🎯 Sample: ${result.checklist?.[0]?.text || 'No items'}`);
      } else {
        console.log('⚠️ Using fallback:', result.fallbackReason);
      }
    } catch (error) {
      console.log('❌ Parse error:', error.message);
      console.log('Response:', response.substring(0, 200));
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(data);
req.end();
