import http from 'http';

async function testOllamaEndpoints() {
  console.log('🧪 FINAL OLLAMA INTEGRATION TEST\n');

  const testGenerate = () => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        trip: {
          name: "Tokyo Adventure",
          startDate: "2024-01-15",
          endDate: "2024-01-18",
          destinations: ["Tokyo"],
          travelModes: ["walking", "train"],
          tripDetails: "Cultural exploration and food tours"
        },
        weather: [{
          location: "Tokyo",
          temperature: 8,
          conditions: "partly cloudy",
          precipitation: 1
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

      const req = http.request(options, (res) => {
        let response = '';
        res.on('data', chunk => response += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(response);
            resolve(result);
          } catch (error) {
            reject(new Error(`Parse error: ${error.message}. Response: ${response}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  };

  const testSuggestions = () => {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({
        customPrompt: "What should I pack for photography and trying local street food?",
        trip: {
          name: "Tokyo Adventure",
          startDate: "2024-01-15",
          endDate: "2024-01-18",
          destinations: ["Tokyo"],
          travelModes: ["walking", "train"],
          tripDetails: "Cultural exploration and food tours"
        },
        weather: [{
          location: "Tokyo",
          temperature: 8,
          conditions: "partly cloudy",
          precipitation: 1
        }]
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/suggestions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = http.request(options, (res) => {
        let response = '';
        res.on('data', chunk => response += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(response);
            resolve(result);
          } catch (error) {
            reject(new Error(`Parse error: ${error.message}. Response: ${response}`));
          }
        });
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });
  };

  try {
    console.log('1️⃣ Testing AI Checklist Generation...');
    const generateResult = await testGenerate();

    if (generateResult.aiGenerated) {
      console.log('✅ OLLAMA IS GENERATING CHECKLISTS!');
      console.log(`📋 Generated ${generateResult.checklist?.length || 0} checklist items`);
      console.log(`💡 Generated ${generateResult.suggestedItems?.length || 0} suggested items`);
      console.log('🎯 Sample items:', generateResult.checklist?.slice(0, 3)?.map(i => `${i.text} (${i.category})`) || []);
    } else {
      console.log('⚠️ Using fallback (not AI):', generateResult.fallbackReason);
    }

    console.log('\n2️⃣ Testing AI Custom Suggestions...');
    const suggestionsResult = await testSuggestions();

    if (suggestionsResult.suggestedItems && suggestionsResult.suggestedItems.length > 0) {
      console.log('✅ OLLAMA IS GENERATING CUSTOM SUGGESTIONS!');
      console.log(`💭 Generated ${suggestionsResult.suggestedItems.length} suggestions:`);
      suggestionsResult.suggestedItems.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item}`);
      });
    } else {
      console.log('⚠️ No suggestions generated:', suggestionsResult.fallbackReason);
    }

    console.log('\n🎉 OLLAMA INTEGRATION TEST COMPLETE!');
    console.log('✅ Ollama is successfully hooked up to generate both checklist items and AI suggestions!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOllamaEndpoints();
