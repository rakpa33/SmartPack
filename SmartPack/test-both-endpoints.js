// Quick test of both Ollama AI endpoints
import http from 'http';

// Test data for checklist generation
const checklistData = JSON.stringify({
  destination: 'Paris',
  duration: 3,
  activities: ['sightseeing', 'museums'],
  weather: 'mild'
});

// Test data for suggestions
const suggestionsData = JSON.stringify({
  customPrompt: 'What should I pack for photography and food tours?',
  trip: {
    name: 'Paris Adventure',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    destinations: ['Paris'],
    travelModes: ['walking', 'metro'],
    tripDetails: 'Photography and food focused trip'
  },
  weather: [{
    location: 'Paris',
    temperature: 15,
    conditions: 'partly cloudy',
    precipitation: 1
  }]
});

console.log('🧪 Testing Ollama Integration...\n');

// Test checklist generation
const checklistOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(checklistData)
  }
};

console.log('1️⃣ Testing checklist generation...');
const checklistReq = http.request(checklistOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('✅ Checklist generated:', result.checklist?.length || 0, 'items');
      console.log('Sample items:', result.checklist?.slice(0, 3)?.map(i => i.text) || []);

      // Now test suggestions
      console.log('\n2️⃣ Testing AI suggestions...');
      const suggestionsOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/suggestions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(suggestionsData)
        }
      };

      const suggestionsReq = http.request(suggestionsOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            console.log('✅ AI suggestions generated:', result.suggestedItems?.length || 0, 'items');
            console.log('Suggestions:', result.suggestedItems || []);
            console.log('\n🎉 Both AI endpoints are working with Ollama!');
          } catch (error) {
            console.log('❌ Suggestions parsing error:', error.message);
            console.log('Response:', data);
          }
        });
      });

      suggestionsReq.on('error', (error) => {
        console.log('❌ Suggestions request error:', error.message);
      });

      suggestionsReq.write(suggestionsData);
      suggestionsReq.end();

    } catch (error) {
      console.log('❌ Checklist parsing error:', error.message);
      console.log('Response:', data);
    }
  });
});

checklistReq.on('error', (error) => {
  console.log('❌ Checklist request error:', error.message);
});

checklistReq.write(checklistData);
checklistReq.end();
