// Test API integration
const testAPI = async () => {
  try {
    console.log('Testing API at http://localhost:3000/generate');
    
    const testData = {
      trip: {
        name: "Paris Adventure",
        startDate: "2025-08-10",
        endDate: "2025-08-15",
        destinations: ["Paris"],
        travelModes: ["Plane"],
        tripDetails: "Cultural exploration"
      },
      weather: [{
        location: "Paris",
        temperature: 22,
        conditions: "Partly cloudy",
        precipitation: 5
      }]
    };

    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
};

testAPI();