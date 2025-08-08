import * as express from 'express';
import { Request, Response } from 'express';
import serverless from 'serverless-http';
import * as cors from 'cors';
import { Ollama } from 'ollama';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define TypeScript interfaces for the API
interface TripData {
  name: string;
  startDate: string;
  endDate: string;
  destinations: string[];
  travelModes: string[];
  tripDetails: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  precipitation: number;
}

interface GenerateRequest {
  trip: TripData;
  weather: WeatherData[];
}

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  checked: boolean;
  aiGenerated: boolean;
}

interface GenerateResponse {
  checklist: ChecklistItem[];
  suggestedItems: string[];
}

// Create Express app
const app = express();

// Configure middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-production-domain.com'
    : 'http://localhost:5173', // Vite default port
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'SmartPack API is running' });
});

// Main generate endpoint
app.post('/generate', async (req: Request<object, object, GenerateRequest>, res: Response) => {
  try {
    const { trip, weather } = req.body;
    
    if (!trip || !weather) {
      return res.status(400).json({ error: 'Missing trip or weather data' });
    }

    // Log incoming request for debugging (remove in production)
    console.log('Trip data:', JSON.stringify(trip, null, 2));
    console.log('Weather data:', JSON.stringify(weather, null, 2));

    // Generate packing list using Ollama AI
    const aiChecklist = await generateAIPackingList(trip, weather);
    
    res.status(200).json(aiChecklist);
  } catch (error) {
    console.error('Error generating packing list:', error);
    
    // Return error instead of fallback data
    res.status(503).json({
      error: 'AI service unavailable',
      message: error instanceof Error ? error.message : 'Failed to generate AI packing list',
      details: 'Ollama AI service is not responding with valid data. Please ensure Ollama is running and the model is properly configured.'
    });
  }
});

// Initialize Ollama client
const ollama = new Ollama({ host: process.env.OLLAMA_HOST || 'http://localhost:11434' });

// AI-powered packing list generator using Ollama
async function generateAIPackingList(trip: TripData, weather: WeatherData[]): Promise<GenerateResponse> {
  try {
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
        temperature: 0.3, // Lower temperature for more consistent results
        num_predict: 2048  // Limit response length
      }
    });

    // Parse AI response
    let aiResponse;
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', response.response);
      throw new Error('Invalid AI response format');
    }

    // Validate and ensure proper structure
    if (!aiResponse.checklist || !Array.isArray(aiResponse.checklist)) {
      throw new Error('AI response missing valid checklist array');
    }

    // Ensure all checklist items have required fields
    const validatedChecklist = aiResponse.checklist.map((item: Record<string, unknown>, index: number) => ({
      id: item.id?.toString() || (index + 1).toString(),
      text: item.text?.toString() || 'Unknown item',
      category: item.category?.toString() || 'Miscellaneous',
      checked: false,
      aiGenerated: true
    }));

    const validatedSuggestions = Array.isArray(aiResponse.suggestedItems) 
      ? aiResponse.suggestedItems.filter((item: unknown) => typeof item === 'string')
      : [];

    return {
      checklist: validatedChecklist,
      suggestedItems: validatedSuggestions
    };

  } catch (error) {
    console.error('AI generation failed:', error);
    throw error; // Re-throw to trigger fallback
  }
}

// Enhanced AI-powered packing list generator with comprehensive trip analysis
function generateMockChecklist(trip: TripData, weather: WeatherData[]): GenerateResponse {
  const checklist: ChecklistItem[] = [];
  const suggestedItems: string[] = [];
  let itemId = 1;

  // Calculate trip duration
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
  
  // Analyze trip characteristics
  const isCold = weather.some(w => w.temperature < 15);
  const isWarm = weather.some(w => w.temperature > 25);
  const isRainy = weather.some(w => w.precipitation > 5 || w.conditions.toLowerCase().includes('rain'));
  const isSnowy = weather.some(w => w.conditions.toLowerCase().includes('snow'));

  // Helper function to infer gender from user input (neutral by default)
  const inferGender = (tripDetails: string): 'neutral' | 'feminine' | 'masculine' => {
    const details = tripDetails.toLowerCase();
    
    // Look for gendered clothing/items mentioned by user
    const feminineKeywords = /dress|heels|makeup|jewelry|bra|skirt|blouse|lipstick|nail polish|purse|handbag/;
    const masculineKeywords = /suit|tie|beard|cologne|boxers|briefs|shaving|razor/;
    
    if (feminineKeywords.test(details)) return 'feminine';
    if (masculineKeywords.test(details)) return 'masculine';
    return 'neutral';
  };

  const genderContext = inferGender(trip.tripDetails);
  
  // Analyze trip purpose and type from name and details
  const tripContext = (trip.name + ' ' + trip.tripDetails).toLowerCase();
  const isBusiness = /business|work|conference|meeting|corporate|professional/.test(tripContext);
  const isAdventure = /adventure|hiking|camping|outdoor|mountain|skiing|climbing/.test(tripContext);
  const isBeach = /beach|ocean|surf|swim|tropical|coast/.test(tripContext);
  const isSki = /ski|snow|winter sports|snowboard|alpine/.test(tripContext);
  const isCultural = /culture|museum|tour|history|art|heritage/.test(tripContext);
  
  // Analyze destinations for specific requirements
  const destinations = trip.destinations.join(' ').toLowerCase();
  const isAsia = /japan|china|korea|thailand|singapore|vietnam|malaysia|hong kong/.test(destinations);
  const isEurope = /europe|france|germany|italy|spain|uk|england|netherlands|switzerland/.test(destinations);
  const isTropical = /hawaii|caribbean|bahamas|fiji|bali|philippines|costa rica|brazil/.test(destinations);
  const isUrban = /city|tokyo|paris|london|new york|singapore|hong kong/.test(destinations);
  
  // === DOCUMENTS & ESSENTIALS ===
  checklist.push(
    { id: (itemId++).toString(), text: 'Passport/ID', category: 'Documents', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Travel insurance', category: 'Documents', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Flight confirmations', category: 'Documents', checked: false, aiGenerated: true }
  );
  
  if (trip.travelModes.includes('car')) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Driver\'s license', category: 'Documents', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Car registration/insurance', category: 'Documents', checked: false, aiGenerated: true }
    );
  }
  
  // === ELECTRONICS & CHARGING ===
  checklist.push(
    { id: (itemId++).toString(), text: `Phone charger`, category: 'Electronics', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Portable power bank', category: 'Electronics', checked: false, aiGenerated: true }
  );
  
  if (isAsia || isEurope || trip.travelModes.includes('plane')) {
    checklist.push({ id: (itemId++).toString(), text: 'Universal travel adapter', category: 'Electronics', checked: false, aiGenerated: true });
  }
  
  if (isBusiness) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Laptop + charger', category: 'Electronics', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Business cards', category: 'Documents', checked: false, aiGenerated: true }
    );
  }
  
  // === CLOTHING (DURATION-BASED & GENDER-AWARE) ===
  const underwearCount = Math.min(Math.max(tripDays + 2, 3), 14); // 3-14 pairs
  const socksCount = Math.min(Math.max(tripDays + 2, 3), 14);     // 3-14 pairs
  const shirtCount = Math.min(Math.max(Math.ceil(tripDays / 2), 2), 10); // 2-10 shirts
  
  // Gender-neutral base clothing with specific types
  checklist.push(
    { id: (itemId++).toString(), text: `${underwearCount} pairs underwear`, category: 'Clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${socksCount} pairs socks`, category: 'Clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${shirtCount} t-shirts/tops`, category: 'Clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${Math.min(Math.ceil(tripDays / 3), 5)} pants/trousers`, category: 'Clothing', checked: false, aiGenerated: true }
  );

  // Add gender-aware suggestions if context is detected
  if (genderContext === 'feminine') {
    suggestedItems.push('Bras/undergarments', 'Makeup remover', 'Hair ties', 'Feminine hygiene products');
  } else if (genderContext === 'masculine') {
    suggestedItems.push('Shaving kit', 'Aftershave/cologne', 'Undershirts');
  }
  
  // Climate-specific clothing
  if (isCold || isSnowy) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Insulated winter coat', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Wool/fleece sweaters', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Thermal base layers', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm jeans/pants', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Waterproof boots', category: 'Footwear', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm gloves', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm hat/beanie', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Wool scarf', category: 'Accessories', checked: false, aiGenerated: true }
    );
  }
  
  if (isWarm || isTropical || isBeach) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Sunscreen (SPF 30+)', category: 'Health', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Sunglasses', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Cotton t-shirts', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Linen/cotton shorts', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Breathable pants/chinos', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Light cardigan/sweater', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Sun hat', category: 'Accessories', checked: false, aiGenerated: true }
    );
  }
  
  if (isBeach || isTropical) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Swimwear', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Beach towel', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Flip-flops/sandals', category: 'Footwear', checked: false, aiGenerated: true }
    );
  }
  
  if (isRainy) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Umbrella', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Rain jacket', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Waterproof shoes', category: 'Footwear', checked: false, aiGenerated: true }
    );
  }
  
  // Business-specific clothing
  if (isBusiness) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Business suit/blazer', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Dress shirts/blouses', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Dress pants/skirts', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Professional ties/accessories', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Leather dress shoes', category: 'Footwear', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Ties/accessories', category: 'Accessories', checked: false, aiGenerated: true }
    );
  }
  
  // Adventure-specific gear
  if (isAdventure) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Hiking boots', category: 'Footwear', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Outdoor gear', category: 'Equipment', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'First aid kit', category: 'Health', checked: false, aiGenerated: true }
    );
  }
  
  if (isSki) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Ski jacket & pants', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Ski goggles', category: 'Equipment', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Thermal layers', category: 'Clothing', checked: false, aiGenerated: true }
    );
  }
  
  // === TOILETRIES & HEALTH ===
  checklist.push(
    { id: (itemId++).toString(), text: 'Toothbrush & toothpaste', category: 'Toiletries', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Deodorant', category: 'Toiletries', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: 'Shampoo/soap', category: 'Toiletries', checked: false, aiGenerated: true }
  );
  
  if (tripDays > 3) {
    checklist.push({ id: (itemId++).toString(), text: 'Medications (if needed)', category: 'Health', checked: false, aiGenerated: true });
  }
  
  // === TRAVEL MODE SPECIFIC ===
  if (trip.travelModes.includes('plane')) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Neck pillow', category: 'Comfort', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Headphones/earbuds', category: 'Electronics', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Eye mask & earplugs', category: 'Comfort', checked: false, aiGenerated: true }
    );
  }
  
  if (trip.travelModes.includes('car')) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Car phone charger', category: 'Electronics', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Snacks & water', category: 'Food', checked: false, aiGenerated: true }
    );
  }
  
  // === DESTINATION-SPECIFIC SUGGESTIONS ===
  if (isAsia) {
    suggestedItems.push('Translation app', 'Cash (local currency)', 'Chopsticks (if needed)', 'Respectful clothing for temples');
  }
  
  if (isEurope) {
    suggestedItems.push('Eurail pass (if applicable)', 'Comfortable walking shoes', 'Light jacket for evenings');
  }
  
  if (isTropical) {
    suggestedItems.push('Insect repellent', 'After-sun lotion', 'Quick-dry clothing');
  }
  
  if (isUrban) {
    suggestedItems.push('Comfortable walking shoes', 'Daypack for sightseeing', 'Portable umbrella');
  }
  
  // === TRIP-SPECIFIC SUGGESTIONS ===
  if (isCultural) {
    suggestedItems.push('Camera', 'Guidebook/apps', 'Respectful attire for religious sites');
  }
  
  if (tripDays > 7) {
    suggestedItems.push('Laundry detergent pods', 'Extra phone charger', 'Travel journal');
  }
  
  // === GENERAL SMART SUGGESTIONS ===
  suggestedItems.push(
    'Reusable water bottle',
    'Travel-sized laundry detergent',
    'Emergency contact list',
    'Local currency/card',
    'Travel journal',
    'Good book/e-reader'
  );
  
  return {
    checklist,
    suggestedItems: [...new Set(suggestedItems)] // Remove duplicates
  };
}

// AI suggestions endpoint for custom prompts
app.post('/suggestions', async (req: Request<object, object, { customPrompt: string; trip: TripData; weather: WeatherData[] }>, res: Response) => {
  try {
    const { customPrompt, trip, weather } = req.body;
    
    if (!customPrompt || !trip || !weather) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Generate AI suggestions based on custom prompt
    const aiSuggestions = await generateAISuggestions(customPrompt, trip, weather);
    
    res.status(200).json(aiSuggestions);
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    res.status(500).json({
      error: 'Failed to generate suggestions',
      message: error instanceof Error ? error.message : 'AI service unavailable'
    });
  }
});

// AI-powered suggestions generator for custom prompts
async function generateAISuggestions(customPrompt: string, trip: TripData, weather: WeatherData[]): Promise<{ suggestedItems: string[] }> {
  try {
    // Calculate trip duration
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    
    // Prepare weather summary
    const weatherSummary = weather.map(w => 
      `${w.location}: ${w.temperature}°C, ${w.conditions}, ${w.precipitation}mm precipitation`
    ).join('; ');
    
    // Create focused prompt for custom suggestions
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
        temperature: 0.4, // Slightly higher for more creative suggestions
        num_predict: 512   // Shorter response for suggestions
      }
    });

    // Parse AI response
    let aiResponse;
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI suggestions response:', parseError);
      console.log('Raw AI response:', response.response);
      throw new Error('Invalid AI response format');
    }

    // Validate response
    const validatedSuggestions = Array.isArray(aiResponse.suggestedItems) 
      ? aiResponse.suggestedItems.filter((item: unknown) => typeof item === 'string' && item.trim().length > 0)
      : [];

    return {
      suggestedItems: validatedSuggestions
    };

  } catch (error) {
    console.error('AI suggestions generation failed:', error);
    throw error;
  }
}

// Default route
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the Express app wrapped with serverless-http
export const handler = serverless(app);

// Export the app for local development
export default app;
