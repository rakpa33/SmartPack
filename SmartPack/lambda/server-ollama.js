// Simple server to run the lambda locally with Ollama integration
import express from 'express';
import cors from 'cors';
import { Ollama } from 'ollama';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Ollama client
const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });

// Create Express app
const app = express();

// Configure middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SmartPack API is running' });
});

// AI-powered packing list generator using Ollama
async function generateAIPackingList(trip, weather) {
  // Calculate trip duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  // Prepare weather summary
  const weatherSummary = weather.map(w =>
    `${w.location}: ${w.temperature}°C, ${w.conditions}, ${w.precipitation}mm precipitation`
  ).join('; ');

  // Create comprehensive prompt for AI
  const prompt = `You are a smart travel packing assistant. Generate a comprehensive packing checklist for this trip:

**Trip Details:**
- Name: ${trip.name}
- Duration: ${tripDays} days (${trip.startDate} to ${trip.endDate})
- Destinations: ${trip.destinations.join(', ')}
- Travel modes: ${trip.travelModes.join(', ')}
- Additional details: ${trip.tripDetails}

**Weather Forecast:**
${weatherSummary}

**Requirements:**
1. Return ONLY a valid JSON object with this exact structure:
{
  "checklist": [
    {"id": "1", "text": "item description", "category": "category_name", "checked": false, "aiGenerated": true}
  ],
  "suggestedItems": ["suggestion1", "suggestion2"]
}

2. Categories to use: Documents, Clothing, Footwear, Electronics, Toiletries, Health, Accessories, Equipment, Comfort, Food

3. Consider:
   - Weather conditions for appropriate clothing
   - Trip duration for quantity of items
   - Travel mode for specific needs (flight/car/train)
   - Destination-specific requirements
   - Activities implied by trip name/details

4. Include 15-25 essential checklist items and 5-10 additional suggestions
5. Be specific with quantities for items like underwear, socks based on trip length
6. No explanations, just the JSON response

Generate the packing list:`;

  // Call Ollama API
  const response = await ollama.generate({
    model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.3,
      num_predict: 2048
    }
  });

  // Parse AI response
  const jsonMatch = response.response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in AI response');
  }

  const aiResponse = JSON.parse(jsonMatch[0]);

  if (!aiResponse.checklist || !Array.isArray(aiResponse.checklist)) {
    throw new Error('AI response missing valid checklist array');
  }

  // Validate and format response
  const validatedChecklist = aiResponse.checklist.map((item, index) => ({
    id: item.id?.toString() || (index + 1).toString(),
    text: item.text?.toString() || 'Unknown item',
    category: item.category?.toString() || 'Miscellaneous',
    checked: false,
    aiGenerated: true
  }));

  const validatedSuggestions = Array.isArray(aiResponse.suggestedItems)
    ? aiResponse.suggestedItems.filter(item => typeof item === 'string')
    : [];

  return {
    checklist: validatedChecklist,
    suggestedItems: validatedSuggestions
  };
}

// Fallback function for when AI fails
function generateMockChecklist(trip, weather) {
  const checklist = [];
  const suggestedItems = [];
  let itemId = 1;

  // Calculate trip duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  // Basic essentials
  checklist.push(
    { id: (itemId++).toString(), text: 'Passport/ID', category: 'Documents', checked: false, aiGenerated: false },
    { id: (itemId++).toString(), text: 'Phone charger', category: 'Electronics', checked: false, aiGenerated: false },
    { id: (itemId++).toString(), text: `${tripDays + 1} pairs underwear`, category: 'Clothing', checked: false, aiGenerated: false },
    { id: (itemId++).toString(), text: `${tripDays + 1} pairs socks`, category: 'Clothing', checked: false, aiGenerated: false },
    { id: (itemId++).toString(), text: 'Toothbrush & toothpaste', category: 'Toiletries', checked: false, aiGenerated: false }
  );

  // Weather-based items
  if (weather.some(w => w.temperature > 25)) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Sunscreen', category: 'Health', checked: false, aiGenerated: false },
      { id: (itemId++).toString(), text: 'Sunglasses', category: 'Accessories', checked: false, aiGenerated: false }
    );
  }

  if (weather.some(w => w.temperature < 15)) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Warm jacket', category: 'Clothing', checked: false, aiGenerated: false },
      { id: (itemId++).toString(), text: 'Warm hat', category: 'Accessories', checked: false, aiGenerated: false }
    );
  }

  suggestedItems.push('Travel journal', 'Portable charger', 'First aid kit');

  return { checklist, suggestedItems };
}

// Main generate endpoint with Ollama AI integration
app.post('/generate', async (req, res) => {
  try {
    const { trip, weather } = req.body;

    if (!trip || !weather) {
      return res.status(400).json({ error: 'Missing trip or weather data' });
    }

    console.log('🔄 Generating packing list for:', trip.name);

    try {
      // Try AI generation first
      console.log('🤖 Attempting AI generation with Ollama...');
      const aiResult = await generateAIPackingList(trip, weather);
      console.log('✅ AI generation successful!');
      res.status(200).json({ ...aiResult, aiGenerated: true });
    } catch (aiError) {
      console.log('⚠️ AI generation failed:', aiError.message);
      console.log('📋 Using fallback mock data...');
      // Fall back to mock data
      const fallbackResult = generateMockChecklist(trip, weather);
      res.status(200).json({
        ...fallbackResult,
        aiGenerated: false,
        fallbackReason: aiError.message
      });
    }
  } catch (error) {
    console.error('❌ Error in generate endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI suggestions endpoint for custom prompts
app.post('/suggestions', async (req, res) => {
  try {
    const { customPrompt, trip, weather } = req.body;

    if (!customPrompt || !trip || !weather) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    console.log('🎯 Generating custom suggestions for:', customPrompt);

    try {
      // Calculate trip duration
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

      // Prepare weather summary
      const weatherSummary = weather.map(w =>
        `${w.location}: ${w.temperature}°C, ${w.conditions}, ${w.precipitation}mm precipitation`
      ).join('; ');

      const prompt = `You are a smart travel packing assistant. Based on this specific request and trip context, suggest relevant packing items.

**Trip Context:**
- Name: ${trip.name}
- Duration: ${tripDays} days (${trip.startDate} to ${trip.endDate})
- Destinations: ${trip.destinations.join(', ')}
- Travel modes: ${trip.travelModes.join(', ')}
- Trip details: ${trip.tripDetails}
- Weather: ${weatherSummary}

**User's Custom Request:**
"${customPrompt}"

**Requirements:**
1. Return ONLY a valid JSON object: {"suggestedItems": ["item1", "item2", "item3"]}
2. Suggest 3-8 specific, actionable packing items
3. Consider the weather, trip type, and user's specific needs
4. Be specific and practical (e.g., "waterproof hiking boots" not just "shoes")
5. Focus on items relevant to the custom request
6. No explanations, just the JSON response

Generate suggestions:`;

      // Call Ollama API
      const response = await ollama.generate({
        model: process.env.OLLAMA_MODEL || 'llama3.1:8b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.4,
          num_predict: 512
        }
      });

      // Parse AI response
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      const validatedSuggestions = Array.isArray(aiResponse.suggestedItems)
        ? aiResponse.suggestedItems.filter(item => typeof item === 'string' && item.trim().length > 0)
        : [];

      console.log('✅ Custom suggestions generated successfully!');
      res.status(200).json({ suggestedItems: validatedSuggestions });

    } catch (aiError) {
      console.log('⚠️ AI suggestions failed:', aiError.message);
      // Fallback to basic suggestions
      res.status(200).json({
        suggestedItems: ['Additional clothing', 'Travel accessories', 'Personal items'],
        fallbackReason: aiError.message
      });
    }
  } catch (error) {
    console.error('❌ Error generating AI suggestions:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SmartPack API server with Ollama AI running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Generate endpoint: http://localhost:${PORT}/generate (POST)`);
  console.log(`💡 Suggestions endpoint: http://localhost:${PORT}/suggestions (POST)`);
  console.log(`🔧 Ollama host: ${process.env.OLLAMA_HOST || 'http://localhost:11434'}`);
  console.log(`🧠 AI model: ${process.env.OLLAMA_MODEL || 'llama3.1:8b'}`);
});
