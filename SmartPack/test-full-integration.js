// Test the full integration flow
const testFullIntegration = async () => {
  console.log('=== FULL INTEGRATION TEST ===\n');
  
  // Test the weather API directly
  console.log('1. Testing Weather API...');
  try {
    const weatherResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&start_date=2025-08-10&end_date=2025-08-15&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto');
    const weatherData = await weatherResponse.json();
    console.log('✅ Weather API working:', {
      location: 'Paris',
      temps: weatherData.daily?.temperature_2m_max?.slice(0, 3)
    });
  } catch (error) {
    console.error('❌ Weather API failed:', error.message);
  }
  
  // Test backend health
  console.log('\n2. Testing Backend Health...');
  try {
    const healthResponse = await fetch('http://localhost:3000/health');
    const health = await healthResponse.json();
    console.log('✅ Backend health:', health);
  } catch (error) {
    console.error('❌ Backend not running:', error.message);
    console.log('Please run: npm run lambda:dev');
    return;
  }
  
  // Test Ollama
  console.log('\n3. Testing Ollama...');
  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/tags');
    const models = await ollamaResponse.json();
    console.log('✅ Ollama running with models:', models.models?.map(m => m.name));
  } catch (error) {
    console.error('❌ Ollama not running:', error.message);
    console.log('Please run: ollama serve');
    return;
  }
  
  // Test full generation flow
  console.log('\n4. Testing Full Generation Flow...');
  const testData = {
    trip: {
      name: "Paris Summer Vacation",
      startDate: "2025-08-10",
      endDate: "2025-08-15",
      destinations: ["Paris, France"],
      travelModes: ["Plane"],
      tripDetails: "Cultural exploration and sightseeing"
    },
    weather: [{
      location: "Paris",
      temperature: 25,
      conditions: "Partly cloudy",
      precipitation: 2
    }]
  };
  
  try {
    console.log('Sending request to /generate...');
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Generation successful!');
      console.log('- Checklist items:', data.checklist?.length);
      console.log('- Suggested items:', data.suggestedItems?.length);
      console.log('- AI Generated:', data.aiGenerated);
      console.log('\nSample items:', data.checklist?.slice(0, 3).map(item => `  - ${item.text} (${item.category})`).join('\n'));
    } else {
      console.error('❌ Generation failed:', data);
    }
  } catch (error) {
    console.error('❌ Request failed:', error);
  }
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('\nTo test the full app:');
  console.log('1. Make sure backend is running: npm run lambda:dev');
  console.log('2. Make sure frontend is running: npm run dev');
  console.log('3. Open http://localhost:5173 (or the port shown)');
  console.log('4. Fill in the form with:');
  console.log('   - Trip Name: Paris Summer Vacation');
  console.log('   - Dates: Aug 10-15, 2025');
  console.log('   - Destination: Paris, France');
  console.log('   - Travel Mode: Plane');
  console.log('5. Click Save');
  console.log('6. Click "Generate Smart Packing List"');
  console.log('\nThe weather should be fetched automatically when you save the form!');
};

testFullIntegration();