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

    // Generate mock response based on weather and trip data
    const isCold = weather.some(w => w.temperature < 15);
    const isRainy = weather.some(w => w.precipitation > 5 || w.conditions.toLowerCase().includes('rain'));

    const baseItems = [
      { id: '1', text: 'Passport/ID', category: 'documents', checked: false, aiGenerated: true },
      { id: '2', text: 'Phone charger', category: 'electronics', checked: false, aiGenerated: true },
      { id: '3', text: 'Toothbrush', category: 'toiletries', checked: false, aiGenerated: true },
      { id: '4', text: 'Underwear', category: 'clothing', checked: false, aiGenerated: true },
      { id: '5', text: 'Socks', category: 'clothing', checked: false, aiGenerated: true }
    ];

    const weatherItems = [];

    if (isCold) {
      weatherItems.push(
        { id: '6', text: 'Winter jacket', category: 'clothing', checked: false, aiGenerated: true },
        { id: '7', text: 'Gloves', category: 'accessories', checked: false, aiGenerated: true },
        { id: '8', text: 'Warm hat', category: 'accessories', checked: false, aiGenerated: true }
      );
    }

    if (isRainy) {
      weatherItems.push(
        { id: '9', text: 'Umbrella', category: 'accessories', checked: false, aiGenerated: true },
        { id: '10', text: 'Rain jacket', category: 'clothing', checked: false, aiGenerated: true }
      );
    }

    // Add travel mode specific items
    if (trip.travelModes.includes('plane')) {
      weatherItems.push(
        { id: '11', text: 'Neck pillow', category: 'comfort', checked: false, aiGenerated: true },
        { id: '12', text: 'Headphones', category: 'electronics', checked: false, aiGenerated: true }
      );
    }

    const mockResponse = {
      checklist: [...baseItems, ...weatherItems],
      suggestedItems: ['Travel insurance', 'Portable charger', 'Local currency']
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
