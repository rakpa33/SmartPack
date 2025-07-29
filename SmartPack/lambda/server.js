// Simple server to run the built lambda locally
import express from 'express';
import cors from 'cors';

// Create Express app (simplified version of lambda/app.ts)
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

// Main generate endpoint - simplified mock version
app.post('/generate', async (req, res) => {
  try {
    const { trip, weather } = req.body;

    if (!trip || !weather) {
      return res.status(400).json({ error: 'Missing trip or weather data' });
    }

    console.log('Received trip data:', JSON.stringify(trip, null, 2));
    console.log('Received weather data:', JSON.stringify(weather, null, 2));

    // Enhanced AI-powered packing list generator
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

    const mockResponse = {
      checklist,
      suggestedItems: [...new Set(suggestedItems)] // Remove duplicates
    };

    console.log('Sending response:', JSON.stringify(mockResponse, null, 2));
    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('Error generating packing list:', error);
    res.status(500).json({
      error: 'Failed to generate packing list',
      message: error.message
    });
  }
});

// Default route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 SmartPack API server running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Generate endpoint: http://localhost:${PORT}/generate (POST)`);
  console.log('');
  console.log('Ready to receive requests from frontend!');
});
