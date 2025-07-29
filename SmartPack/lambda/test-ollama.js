// lambda/test-ollama.js
// Quick test script to verify Ollama integration

import { Ollama } from 'ollama';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testOllama() {
  try {
    console.log('🔄 Testing Ollama connection...');

    const ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });

    // Test connection
    const models = await ollama.list();
    console.log('✅ Connected to Ollama');
    console.log('📋 Available models:', models.models.map(m => m.name));

    // Test generation
    console.log('\n🤖 Testing AI generation...');
    const response = await ollama.generate({
      model: 'llama3.1:8b',
      prompt: 'Generate a JSON packing list for a 2-day beach trip. Format: {"items": ["item1", "item2"]}',
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 256
      }
    });

    console.log('📝 AI Response:', response.response);

    // Try to parse JSON
    try {
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON parsed successfully:', parsed);
      } else {
        console.log('⚠️  No JSON found in response');
      }
    } catch (parseError) {
      console.log('❌ JSON parsing failed:', parseError.message);
    }

  } catch (error) {
    console.error('❌ Ollama test failed:', error.message);

    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure Ollama is running: ollama serve');
      console.log('2. Install a model: ollama pull llama3.1:8b');
      console.log('3. Check if port 11434 is accessible');
    }
  }
}

// Run the test
testOllama();
