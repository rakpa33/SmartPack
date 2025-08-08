// Test connection to backend
const testConnection = async () => {
  console.log('Testing connection to backend...\n');
  
  // Test from browser-like environment
  console.log('1. Testing from browser context (with CORS headers)...');
  try {
    const response = await fetch('http://localhost:3000/health', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5176',
        'Referer': 'http://localhost:5176/',
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const data = await response.json();
    console.log('✅ Health check passed:', data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
  
  console.log('\n2. Testing POST to /generate endpoint...');
  const testData = {
    trip: {
      name: "Test Trip",
      startDate: "2025-08-10",
      endDate: "2025-08-15",
      destinations: ["Paris"],
      travelModes: ["Plane"],
      tripDetails: "Test trip"
    },
    weather: [{
      location: "Paris",
      temperature: 22,
      conditions: "Clear",
      precipitation: 0
    }]
  };
  
  try {
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5176',
        'Referer': 'http://localhost:5176/',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Generate endpoint working!');
      console.log('Items generated:', data.checklist?.length);
    } else {
      const error = await response.text();
      console.error('❌ Generate failed:', error);
    }
  } catch (error) {
    console.error('❌ Generate request failed:', error.message);
    console.error('Full error:', error);
  }
  
  console.log('\n3. Testing Ollama directly...');
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    const data = await response.json();
    console.log('✅ Ollama is running with models:', data.models?.map(m => m.name));
  } catch (error) {
    console.error('❌ Ollama not accessible:', error.message);
  }
};

testConnection();