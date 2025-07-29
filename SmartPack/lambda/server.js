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

2. Categories: Create meaningful, context-aware categories based on the trip. Examples include:
   - Core categories: Documents, Clothing, Footwear, Electronics, Toiletries, Health
   - Activity-specific: Photography Gear, Business Items, Outdoor Equipment, Beach Essentials
   - Travel-specific: Flight Essentials, Road Trip Items, International Travel
   - Climate-specific: Cold Weather Gear, Rain Protection, Sun Protection
   - Choose the most relevant categories for this specific trip

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

  // Analyze trip characteristics
  const isCold = weather.some(w => w.temperature < 15);
  const isWarm = weather.some(w => w.temperature > 25);
  const isRainy = weather.some(w => w.precipitation > 5 || w.conditions.toLowerCase().includes('rain'));

  // Analyze trip purpose and type
  const tripContext = (trip.name + ' ' + trip.tripDetails).toLowerCase();
  const isBusiness = /business|work|conference|meeting|corporate|professional/.test(tripContext);
  const isAdventure = /adventure|hiking|camping|outdoor|mountain|skiing|climbing/.test(tripContext);
  const isBeach = /beach|ocean|surf|swim|tropical|coast/.test(tripContext);

  // Analyze destinations
  const destinations = trip.destinations.join(' ').toLowerCase();
  const isAsia = /japan|china|korea|thailand|singapore|vietnam|malaysia|hong kong/.test(destinations);
  const isEurope = /europe|france|germany|italy|spain|uk|england|netherlands|switzerland/.test(destinations);
  const isTropical = /hawaii|caribbean|bahamas|fiji|bali|philippines|costa rica|brazil/.test(destinations);

  // === DOCUMENTS & ESSENTIALS ===
  checklist.push(
    { id: (itemId++).toString(), text: 'Passport/ID', category: 'documents', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Travel insurance', category: 'documents', checked: false, aiGenerated: true }
  );

  // === ELECTRONICS ===
  checklist.push(
    { id: (itemId++).toString(), text: 'Phone charger', category: 'electronics', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Portable power bank', category: 'electronics', checked: false, aiGenerated: true }
  );

  if (isAsia || isEurope || trip.travelModes.includes('plane')) {
    checklist.push({ id: (itemId++).toString(), text: 'Universal travel adapter', category: 'electronics', checked: false, aiGenerated: true });
  }

  if (isBusiness) {
    checklist.push({ id: (itemId++).toString(), text: 'Laptop + charger', category: 'electronics', checked: false, aiGenerated: true });
  }

  // === CLOTHING (DURATION-BASED) ===
  const underwearCount = Math.min(Math.max(tripDays + 2, 3), 14);
  const socksCount = Math.min(Math.max(tripDays + 2, 3), 14);
  const shirtCount = Math.min(Math.max(Math.ceil(tripDays / 2), 2), 10);

  checklist.push(
    { id: (itemId++).toString(), text: `${underwearCount} pairs underwear`, category: 'clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${socksCount} pairs socks`, category: 'clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${shirtCount} shirts/tops`, category: 'clothing', checked: false, aiGenerated: true }
  );

  // Climate-specific clothing
  if (isCold) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Winter jacket/coat', category: 'clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm sweaters', category: 'clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm gloves', category: 'accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm hat/beanie', category: 'accessories', checked: false, aiGenerated: true }
    );
  }

  if (isWarm || isTropical || isBeach) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Sunscreen (SPF 30+)', category: 'health', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Sunglasses', category: 'accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Light summer clothes', category: 'clothing', checked: false, aiGenerated: true }
    );
  }

  if (isBeach || isTropical) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Swimwear', category: 'clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Beach towel', category: 'accessories', checked: false, aiGenerated: true }
    );
  }

  if (isRainy) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Umbrella', category: 'accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Rain jacket', category: 'clothing', checked: false, aiGenerated: true }
    );
  }

  // Business-specific items
  if (isBusiness) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Business suits/formal wear', category: 'clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Business cards', category: 'documents', checked: false, aiGenerated: true }
    );
  }

  // Adventure-specific gear
  if (isAdventure) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Hiking boots', category: 'footwear', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'First aid kit', category: 'health', checked: false, aiGenerated: true }
    );
  }

  // === TOILETRIES ===
  checklist.push(
    { id: (itemId++).toString(), text: 'Toothbrush & toothpaste', category: 'toiletries', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Deodorant', category: 'toiletries', checked: false, aiGenerated: true }
  );

  // === TRAVEL MODE SPECIFIC ===
  if (trip.travelModes.includes('plane')) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Neck pillow', category: 'comfort', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Headphones/earbuds', category: 'electronics', checked: false, aiGenerated: true }
    );
  }

  if (trip.travelModes.includes('car')) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Driver\'s license', category: 'documents', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Car phone charger', category: 'electronics', checked: false, aiGenerated: true }
    );
  }

  // === DESTINATION-SPECIFIC SUGGESTIONS ===
  if (isAsia) {
    suggestedItems.push('Translation app', 'Cash (local currency)', 'Respectful clothing for temples');
  }
  if (isEurope) {
    suggestedItems.push('Comfortable walking shoes', 'Light jacket for evenings');
  }
  if (isTropical) {
    suggestedItems.push('Insect repellent', 'After-sun lotion');
  }

  // === GENERAL SMART SUGGESTIONS ===
  suggestedItems.push('Reusable water bottle', 'Emergency contact list', 'Travel journal');

  return {
    checklist,
    suggestedItems: [...new Set(suggestedItems)] // Remove duplicates
  };
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
      const mockResult = generateMockChecklist(trip, weather);
      res.status(200).json({ ...mockResult, aiGenerated: false, fallbackReason: aiError.message });
    }
  } catch (error) {
    console.error('Error generating packing list:', error);
    res.status(500).json({
      error: 'Failed to generate packing list',
      message: error.message
    });
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
6. Use descriptive, context-aware item names that clearly indicate their purpose
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

// Default route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SmartPack API server with Ollama AI running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Generate endpoint: http://localhost:${PORT}/generate (POST)`);
  console.log(`💡 Suggestions endpoint: http://localhost:${PORT}/suggestions (POST)`);
  console.log(`🔧 Ollama host: ${process.env.OLLAMA_HOST || 'http://localhost:11434'}`);
  console.log(`🧠 AI model: ${process.env.OLLAMA_MODEL || 'llama3.1:8b'}`);
});
