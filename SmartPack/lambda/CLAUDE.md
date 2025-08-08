# SmartPack Lambda Directory Navigation

**NAVIGATION GUIDE - DO NOT DELETE**

This file provides quick backend service understanding without deep code exploration. It reduces token usage by providing immediate context about the backend architecture.

**Purpose**: Backend API documentation, service endpoints, integration patterns
**Status**: Critical navigation file for backend development

## Directory Purpose

The `lambda/` directory contains the Express.js backend server that provides AI integration via Ollama and serves as the API layer for the SmartPack application. It's designed to run both locally for development and as an AWS Lambda function in production.

## Key Files

### Core Server Files
- **`app.ts`** - Main Express application with all API routes and middleware
  - `/api/packing-list` - Generate AI-powered packing lists
  - `/api/suggestions` - Get AI suggestions for specific contexts
  - `/api/weather` - Fetch weather data for destinations
  - `/health` - Health check endpoint
  - CORS configuration for frontend integration

- **`server.js`** - Local development server wrapper
  - Runs Express app on port 3000
  - Provides console logging for debugging
  - Handles graceful shutdown

- **`server.ts`** - TypeScript version of server (if using TypeScript)
  - Type-safe server implementation
  - Enhanced error handling

- **`serverless.yml`** - AWS Lambda deployment configuration
  - Function definitions
  - API Gateway configuration
  - Environment variable mappings
  - IAM permissions

### Test Files
- **`app.test.ts`** - Unit tests for Express routes
  - API endpoint testing
  - Error handling validation
  - Mock Ollama responses

## API Endpoints

### POST /api/packing-list
Generate comprehensive packing list based on trip details.

**Request Body**:
```json
{
  "tripName": "string",
  "destinations": ["string"],
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "transportModes": ["car", "plane", "train"],
  "weatherData": { /* optional weather context */ }
}
```

**Response**:
```json
{
  "categories": {
    "clothing": ["items..."],
    "toiletries": ["items..."],
    "electronics": ["items..."],
    "documents": ["items..."],
    "essentials": ["items..."]
  }
}
```

### POST /api/suggestions
Get AI suggestions for specific packing contexts.

**Request Body**:
```json
{
  "prompt": "string",
  "context": {
    "tripDetails": { /* trip information */ },
    "currentList": { /* existing packing list */ }
  }
}
```

**Response**:
```json
{
  "suggestions": ["string"],
  "reasoning": "string"
}
```

### GET /api/weather
Fetch weather data for destination.

**Query Parameters**:
- `city` - Destination city name
- `lat` - Latitude (optional, for precise location)
- `lon` - Longitude (optional, for precise location)

**Response**:
```json
{
  "current": { /* current weather */ },
  "forecast": [ /* 5-day forecast */ ]
}
```

## Service Integrations

### Ollama AI Service
- **Local Instance**: `http://localhost:11434`
- **Model**: `llama3.1:8b` (8 billion parameters)
- **Fallback**: Mock data when service unavailable
- **Timeout**: 30 seconds for AI generation
- **Error Handling**: Graceful degradation with helpful error messages

### Weather API
- **Service**: OpenWeatherMap or similar
- **Rate Limiting**: Implemented to prevent API abuse
- **Caching**: 15-minute cache for repeated requests
- **Error Handling**: Returns last known data or defaults

## Development Setup

### Local Development
```bash
# Install dependencies
npm install

# Start Ollama service (required for AI features)
ollama serve

# Start development server
npm run lambda:dev

# Server runs on http://localhost:3000
```

### Testing
```bash
# Run unit tests
npm run lambda:test

# Test Ollama connection
node test-ollama.js

# Test specific endpoint
curl -X POST http://localhost:3000/api/packing-list \
  -H "Content-Type: application/json" \
  -d '{"tripName":"Test","destinations":["Paris"]}'
```

## Environment Variables

Required environment variables for the backend:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Weather API
WEATHER_API_KEY=your_api_key_here
WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Error Handling

### Common Error Patterns
- **Ollama Unavailable**: Returns mock data with warning
- **Invalid Trip Data**: Returns 400 with validation errors
- **Weather API Failure**: Returns cached or default weather
- **Timeout**: Returns partial data with timeout warning

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional context */ }
}
```

## Deployment

### AWS Lambda Deployment
```bash
# Build for production
npm run lambda:build

# Deploy to AWS
serverless deploy --stage production

# Check deployment status
serverless info
```

### Production Considerations
- **Cold Starts**: Minimized with proper Lambda configuration
- **Memory**: 512MB recommended for AI operations
- **Timeout**: 30 seconds for AI generation endpoints
- **Scaling**: Auto-scaling handled by AWS Lambda

## Troubleshooting

### Common Issues
1. **"Cannot connect to Ollama"**
   - Ensure Ollama is running: `ollama serve`
   - Check port 11434 is available
   - Verify model is pulled: `ollama pull llama3.1:8b`

2. **"CORS error in browser"**
   - Check ALLOWED_ORIGINS environment variable
   - Ensure frontend URL is whitelisted
   - Verify CORS middleware is enabled

3. **"Timeout generating packing list"**
   - Check Ollama service performance
   - Consider using smaller model for faster responses
   - Implement response streaming for better UX

## Integration with Frontend

### API Service Client
Frontend uses `src/services/apiService.ts` to communicate with this backend.

### Key Integration Points
- **Base URL**: `http://localhost:3000` (development)
- **Headers**: `Content-Type: application/json`
- **Error Handling**: Frontend implements retry logic
- **Loading States**: Frontend shows progress during AI generation

## Performance Optimization

### Caching Strategy
- Weather data: 15-minute cache
- AI responses: Not cached (unique per request)
- Static responses: CDN caching in production

### Response Optimization
- Compression enabled for all responses
- JSON minification in production
- Streaming for large AI responses (planned)

## Security Considerations

### Input Validation
- All inputs sanitized before AI processing
- Trip dates validated for reasonable ranges
- Destination names checked against known locations

### Rate Limiting
- 100 requests per minute per IP
- 10 AI generation requests per minute per IP
- Weather API calls limited to prevent abuse

### Authentication (Future)
- JWT tokens for user sessions (planned)
- API key authentication for third-party access (planned)