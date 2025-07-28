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

// Helper function to generate mock data (will be replaced with actual Ollama integration)
function generateMockChecklist(trip: TripData, weather: WeatherData[]): GenerateResponse {
  // Check if it's a cold destination
  const isCold = weather.some(w => w.temperature < 15); // Less than 15°C is considered cold
  
  // Check if it's rainy
  const isRainy = weather.some(w => 
    w.precipitation > 5 || 
    w.conditions.toLowerCase().includes('rain') || 
    w.conditions.toLowerCase().includes('shower')
  );
  
  // Base checklist items that everyone needs
  const baseItems: ChecklistItem[] = [
    { id: '1', text: 'Passport/ID', category: 'Documents', checked: false, aiGenerated: true },
    { id: '2', text: 'Phone charger', category: 'Electronics', checked: false, aiGenerated: true },
    { id: '3', text: 'Toothbrush', category: 'Toiletries', checked: false, aiGenerated: true },
    { id: '4', text: 'Toothpaste', category: 'Toiletries', checked: false, aiGenerated: true },
    { id: '5', text: 'Deodorant', category: 'Toiletries', checked: false, aiGenerated: true },
    { id: '6', text: 'Underwear', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '7', text: 'Socks', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '8', text: 'T-shirts', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '9', text: 'Medication', category: 'Health', checked: false, aiGenerated: true },
    { id: '10', text: 'Wallet', category: 'Essentials', checked: false, aiGenerated: true },
  ];
  
  // Cold weather items
  const coldItems: ChecklistItem[] = isCold ? [
    { id: '11', text: 'Winter jacket', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '12', text: 'Gloves', category: 'Accessories', checked: false, aiGenerated: true },
    { id: '13', text: 'Scarf', category: 'Accessories', checked: false, aiGenerated: true },
    { id: '14', text: 'Thermal underwear', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '15', text: 'Wool socks', category: 'Clothing', checked: false, aiGenerated: true },
  ] : [];
  
  // Rainy weather items
  const rainyItems: ChecklistItem[] = isRainy ? [
    { id: '16', text: 'Umbrella', category: 'Accessories', checked: false, aiGenerated: true },
    { id: '17', text: 'Rain jacket', category: 'Clothing', checked: false, aiGenerated: true },
    { id: '18', text: 'Waterproof shoes', category: 'Footwear', checked: false, aiGenerated: true },
  ] : [];
  
  // Travel mode specific items
  const travelModeItems: ChecklistItem[] = [];
  
  if (trip.travelModes.includes('plane')) {
    travelModeItems.push(
      { id: '19', text: 'Neck pillow', category: 'Comfort', checked: false, aiGenerated: true },
      { id: '20', text: 'Headphones', category: 'Electronics', checked: false, aiGenerated: true },
      { id: '21', text: 'Boarding pass', category: 'Documents', checked: false, aiGenerated: true },
    );
  }
  
  if (trip.travelModes.includes('car')) {
    travelModeItems.push(
      { id: '22', text: 'Driver\'s license', category: 'Documents', checked: false, aiGenerated: true },
      { id: '23', text: 'Car insurance', category: 'Documents', checked: false, aiGenerated: true },
      { id: '24', text: 'Road map/GPS', category: 'Navigation', checked: false, aiGenerated: true },
    );
  }
  
  // Combine all items
  const checklist = [...baseItems, ...coldItems, ...rainyItems, ...travelModeItems];
  
  // Generate suggested items that are not in the main checklist
  const suggestedItems = [
    'Travel insurance documentation',
    'Emergency contact list',
    'Portable power bank',
    'Local currency',
    'Travel adapter',
    'Reusable water bottle',
  ];
  
  return {
    checklist,
    suggestedItems
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
