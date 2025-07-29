import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

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

    // For now, return mock data
    // In a real implementation, this would call Ollama or another LLM
    const mockChecklist = generateMockChecklist(trip, weather);
    
    res.status(200).json(mockChecklist);
  } catch (error) {
    console.error('Error generating packing list:', error);
    res.status(500).json({
      error: 'Failed to generate packing list',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

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
  
  // === CLOTHING (DURATION-BASED) ===
  const underwearCount = Math.min(Math.max(tripDays + 2, 3), 14); // 3-14 pairs
  const socksCount = Math.min(Math.max(tripDays + 2, 3), 14);     // 3-14 pairs
  const shirtCount = Math.min(Math.max(Math.ceil(tripDays / 2), 2), 10); // 2-10 shirts
  
  checklist.push(
    { id: (itemId++).toString(), text: `${underwearCount} pairs underwear`, category: 'Clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${socksCount} pairs socks`, category: 'Clothing', checked: false, aiGenerated: true },
    { id: (itemId++).toString(), text: `${shirtCount} shirts/tops`, category: 'Clothing', checked: false, aiGenerated: true }
  );
  
  // Climate-specific clothing
  if (isCold || isSnowy) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Winter jacket/coat', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm sweaters', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Thermal underwear', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm gloves', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Warm hat/beanie', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Scarf', category: 'Accessories', checked: false, aiGenerated: true }
    );
  }
  
  if (isWarm || isTropical || isBeach) {
    checklist.push(
      { id: (itemId++).toString(), text: 'Sunscreen (SPF 30+)', category: 'Health', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Sunglasses', category: 'Accessories', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Light summer clothes', category: 'Clothing', checked: false, aiGenerated: true },
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
      { id: (itemId++).toString(), text: 'Business suits/formal wear', category: 'Clothing', checked: false, aiGenerated: true },
      { id: (itemId++).toString(), text: 'Dress shoes', category: 'Footwear', checked: false, aiGenerated: true },
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

// Default route
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the Express app wrapped with serverless-http
export const handler = serverless(app);

// Export the app for local development
export default app;
