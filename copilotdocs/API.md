<!--
This file provides comprehensive API documentation for SmartPack backend endpoints.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Define complete API contract for all backend endpoints
- Provide detailed request/response schemas and examples
- Document error handling, status codes, and edge cases
- Serve as single source of truth for API consumers and frontend developers

HOW TO UPDATE:
1. ENDPOINT CHANGES: Update immediately when adding, modifying, or removing endpoints
2. SCHEMA UPDATES: Modify request/response schemas when data structures change
3. ERROR HANDLING: Add new error codes and scenarios as they are implemented
4. EXAMPLES: Keep examples current with actual API behavior and data formats
5. VERSIONING: Document API version changes and deprecation notices
6. TESTING: Update after API testing reveals new edge cases or behaviors

FORMATTING RULES:
- Use OpenAPI/Swagger-style documentation format
- Include complete JSON schemas for all request/response bodies
- Provide multiple examples for different scenarios
- Document all possible HTTP status codes and error responses
- Include authentication requirements and rate limiting information
- Use consistent parameter naming and data type specifications
- Link to related documentation (architecture, troubleshooting, etc.)
-->

# SmartPack API Documentation

## Current Implementation Status

Based on the actual codebase analysis:

### ✅ **Actually Implemented**

- **Frontend-to-Backend API calls** via `apiService.ts`
- **Three endpoints**: `/generate`, `/suggestions`, `/health`
- **Lambda backend** with Express.js and Ollama integration
- **Basic error handling** with try/catch blocks
- **Weather data integration** from Open-Meteo API
- **Fallback system** when Ollama is unavailable

### 🔄 **Partially Implemented**

- **Request/response schemas** - basic structure exists but needs validation
- **CORS configuration** - implemented for localhost:5173 (Vite dev server)
- **Environment configuration** - supports dev vs production URLs

### ❌ **Not Currently Implemented**

- **Authentication system** - currently open/public API
- **Rate limiting** - no throttling implemented
- **Comprehensive error codes** - basic error handling only
- **Production deployment** - AWS infrastructure not set up
- **API documentation validation** - schemas need verification

### 📋 **Planned Features**

- **AWS API Gateway deployment** - Lambda backend ready but not deployed
- **Enhanced error handling** - standardized error response format
- **Request validation** - comprehensive input validation middleware
- **Production CORS** - proper origin restrictions

## ⚠️ CLARIFYING QUESTIONS NEEDED

**IMPORTANT**: This document contains fictional content that needs to be revised based on actual implementation. The following questions need answers:

1. **API Endpoints**: Are `/generate`, `/suggestions`, and `/health` the actual endpoint names?
2. **Authentication**: Is there currently NO authentication (MVP mode), or is there a planned auth system?
3. **Rate Limiting**: Is rate limiting implemented, or is this a future feature?
4. **Response Format**: Do responses actually follow the JSON structure shown, or is it different?
5. **Error Codes**: What are the actual error codes and messages returned by the Lambda function?
6. **AWS Lambda URL**: What is the actual API Gateway URL for the deployed Lambda?
7. **Request/Response Schemas**: Do the schemas match what's actually implemented in the Lambda function?

## Table of Contents

- [Current Implementation Status](#current-implementation-status)
- [Base URL & Environment](#base-url--environment)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Generate Packing List](#generate-packing-list)
  - [Custom AI Suggestions](#custom-ai-suggestions)
- [Data Models](#data-models)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Base URL & Environment

### Local Development (Current)

```
Base URL: http://localhost:3000
```

### Production (Planned - Not Yet Deployed)

```
Base URL: https://[TO_BE_DETERMINED]/[stage]
```

**Note**: Production deployment to AWS Lambda + API Gateway is planned but not yet implemented.

## Authentication

Currently, SmartPack API does not require authentication. All endpoints are publicly accessible for the MVP version.

**Future Considerations:**

- API key authentication for rate limiting
- User-based session management for personalization

## Rate Limiting

### Current Status

No rate limiting implemented in development environment.

### Production Recommendations

- **Rate Limit**: 100 requests per minute per IP
- **Burst Limit**: 10 requests per second
- **Headers**: Standard rate limit headers in responses

## Response Format

All API responses follow a consistent JSON format:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "metadata": {
    "aiGenerated": true,
    "fallbackReason": null,
    "processingTime": 1250
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Trip data validation failed",
    "details": {
      "field": "destinations",
      "reason": "At least one destination is required"
    }
  }
}
```

## Error Handling

### HTTP Status Codes

| Status Code | Meaning               | Description                           |
| ----------- | --------------------- | ------------------------------------- |
| 200         | OK                    | Request successful                    |
| 400         | Bad Request           | Invalid request data or format        |
| 500         | Internal Server Error | Server error or AI processing failure |
| 503         | Service Unavailable   | AI service temporarily unavailable    |

### Error Codes

| Error Code           | Description                    | Resolution                               |
| -------------------- | ------------------------------ | ---------------------------------------- |
| `VALIDATION_ERROR`   | Request data validation failed | Check request format and required fields |
| `AI_SERVICE_ERROR`   | Ollama AI service unavailable  | Check Ollama connection or use fallback  |
| `WEATHER_DATA_ERROR` | Weather data processing failed | Verify weather data format               |
| `PROCESSING_ERROR`   | General processing error       | Check server logs for details            |

## Endpoints

### Health Check

Check API availability and service status.

**Endpoint:** `GET /health`

#### Response

```json
{
  "status": "ok",
  "message": "SmartPack API is running",
  "timestamp": "2025-07-29T10:30:00.000Z",
  "services": {
    "ollama": {
      "status": "connected",
      "model": "llama3.1:8b",
      "host": "http://localhost:11434"
    }
  }
}
```

#### Status Codes

- `200 OK`: Service is healthy
- `503 Service Unavailable`: Service issues detected

---

### Generate Packing List

Generate comprehensive AI-powered packing list based on trip details and weather data.

**Endpoint:** `POST /generate`

#### Request Schema

```json
{
  "trip": {
    "name": "string (required)",
    "startDate": "string (required, ISO date format)",
    "endDate": "string (required, ISO date format)",
    "destinations": ["string (required, non-empty array)"],
    "travelModes": ["string (optional, enum values)"],
    "tripDetails": "string (optional, additional context)"
  },
  "weather": [
    {
      "location": "string (required)",
      "temperature": "number (required, Celsius)",
      "conditions": "string (required)",
      "precipitation": "number (required, mm)"
    }
  ]
}
```

#### Travel Mode Values

- `"plane"` - Air travel
- `"car"` - Road travel
- `"train"` - Rail travel
- `"bus"` - Bus travel
- `"boat"` - Water travel

#### Response Schema

```json
{
  "success": true,
  "data": {
    "checklist": [
      {
        "id": "string (unique identifier)",
        "text": "string (item description)",
        "category": "string (item category)",
        "checked": false,
        "aiGenerated": true,
        "quantity": "number (optional, for countable items)",
        "priority": "string (high|medium|low)"
      }
    ],
    "suggestedItems": ["string (additional suggestion)"],
    "categories": [
      {
        "id": "string (category identifier)",
        "name": "string (category display name)",
        "itemCount": "number (items in category)"
      }
    ]
  },
  "metadata": {
    "aiGenerated": true,
    "fallbackReason": null,
    "processingTime": 1250,
    "tripAnalysis": {
      "duration": 5,
      "purpose": "business",
      "weatherSummary": "mild with rain expected"
    }
  }
}
```

#### Example Request

```json
{
  "trip": {
    "name": "Business Trip to London",
    "startDate": "2025-08-15",
    "endDate": "2025-08-20",
    "destinations": ["London, UK"],
    "travelModes": ["plane"],
    "tripDetails": "Important client meetings and conference presentation. Need professional attire."
  },
  "weather": [
    {
      "location": "London, UK",
      "temperature": 18,
      "conditions": "Partly cloudy with rain",
      "precipitation": 5.2
    }
  ]
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "checklist": [
      {
        "id": "item_001",
        "text": "Business suit",
        "category": "Clothing",
        "checked": false,
        "aiGenerated": true,
        "quantity": 2,
        "priority": "high"
      },
      {
        "id": "item_002",
        "text": "Laptop + charger",
        "category": "Electronics",
        "checked": false,
        "aiGenerated": true,
        "priority": "high"
      },
      {
        "id": "item_003",
        "text": "Umbrella",
        "category": "Weather Gear",
        "checked": false,
        "aiGenerated": true,
        "priority": "medium"
      }
    ],
    "suggestedItems": [
      "Business cards",
      "Presentation materials",
      "Power adapter (Type G for UK)"
    ],
    "categories": [
      {
        "id": "clothing",
        "name": "Clothing",
        "itemCount": 8
      },
      {
        "id": "electronics",
        "name": "Electronics",
        "itemCount": 3
      }
    ]
  },
  "metadata": {
    "aiGenerated": true,
    "fallbackReason": null,
    "processingTime": 1456,
    "tripAnalysis": {
      "duration": 5,
      "purpose": "business",
      "weatherSummary": "mild with rain expected"
    }
  }
}
```

---

### Custom AI Suggestions

Get targeted AI suggestions based on custom prompts and trip context.

**Endpoint:** `POST /suggestions`

#### Request Schema

```json
{
  "prompt": "string (required, user's custom request)",
  "trip": {
    // Same trip schema as /generate endpoint
  },
  "weather": [
    // Same weather schema as /generate endpoint
  ],
  "context": {
    "existingItems": ["string (optional, current checklist items)"],
    "preferences": "string (optional, user preferences)"
  }
}
```

#### Response Schema

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "text": "string (suggestion text)",
        "category": "string (suggested category)",
        "reason": "string (why this is suggested)",
        "priority": "string (high|medium|low)"
      }
    ],
    "analysis": {
      "promptInterpretation": "string (how AI understood the request)",
      "contextFactors": ["string (factors considered)"]
    }
  },
  "metadata": {
    "aiGenerated": true,
    "fallbackReason": null,
    "processingTime": 890
  }
}
```

#### Example Request

```json
{
  "prompt": "I need photography gear for landscape shots",
  "trip": {
    "name": "Iceland Photography Tour",
    "startDate": "2025-09-10",
    "endDate": "2025-09-17",
    "destinations": ["Reykjavik, Iceland"],
    "travelModes": ["plane"],
    "tripDetails": "Landscape photography expedition focusing on waterfalls and northern lights"
  },
  "weather": [
    {
      "location": "Reykjavik, Iceland",
      "temperature": 8,
      "conditions": "Cold with frequent rain",
      "precipitation": 12.5
    }
  ],
  "context": {
    "existingItems": ["Camera body", "Basic lens"],
    "preferences": "Professional quality, weather protection important"
  }
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "text": "Waterproof camera cover",
        "category": "Photography",
        "reason": "Essential protection for frequent rain conditions",
        "priority": "high"
      },
      {
        "text": "Wide-angle lens (14-24mm)",
        "category": "Photography",
        "reason": "Ideal for landscape and waterfall photography",
        "priority": "high"
      },
      {
        "text": "Sturdy tripod with spikes",
        "category": "Photography",
        "reason": "Necessary for stable shots in windy conditions and northern lights",
        "priority": "high"
      },
      {
        "text": "Extra batteries + warmer",
        "category": "Photography",
        "reason": "Cold weather significantly reduces battery life",
        "priority": "medium"
      }
    ],
    "analysis": {
      "promptInterpretation": "User needs specialized photography equipment for landscape photography in harsh weather conditions",
      "contextFactors": [
        "Cold, wet climate requiring weather protection",
        "Landscape focus suggests wide-angle needs",
        "Northern lights opportunity requires low-light capability",
        "Existing basic equipment needs professional supplements"
      ]
    }
  },
  "metadata": {
    "aiGenerated": true,
    "fallbackReason": null,
    "processingTime": 1120
  }
}
```

## Data Models

### Trip Model

```typescript
interface Trip {
  name: string; // Trip identifier/name
  startDate: string; // ISO date format (YYYY-MM-DD)
  endDate: string; // ISO date format (YYYY-MM-DD)
  destinations: string[]; // Array of "City, Country" format
  travelModes?: TravelMode[]; // Optional travel methods
  tripDetails?: string; // Optional additional context
}
```

### Weather Model

```typescript
interface Weather {
  location: string; // Must match trip destination
  temperature: number; // Temperature in Celsius
  conditions: string; // Weather description
  precipitation: number; // Precipitation in mm
}
```

### ChecklistItem Model

```typescript
interface ChecklistItem {
  id: string; // Unique identifier
  text: string; // Item description
  category: string; // Item category
  checked: boolean; // Completion status
  aiGenerated: boolean; // Source indicator
  quantity?: number; // Optional quantity
  priority?: 'high' | 'medium' | 'low'; // Optional priority
}
```

## Examples

### Business Trip Example

**Request:**

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "trip": {
      "name": "Tokyo Business Conference",
      "startDate": "2025-08-01",
      "endDate": "2025-08-05",
      "destinations": ["Tokyo, Japan"],
      "travelModes": ["plane"],
      "tripDetails": "Tech conference with evening networking events"
    },
    "weather": [{
      "location": "Tokyo, Japan",
      "temperature": 28,
      "conditions": "Hot and humid",
      "precipitation": 0
    }]
  }'
```

### Adventure Trip Example

**Request:**

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "trip": {
      "name": "Alps Hiking Adventure",
      "startDate": "2025-07-15",
      "endDate": "2025-07-22",
      "destinations": ["Chamonix, France", "Zermatt, Switzerland"],
      "travelModes": ["plane", "train"],
      "tripDetails": "Multi-day hiking with mountain hut stays"
    },
    "weather": [{
      "location": "Chamonix, France",
      "temperature": 15,
      "conditions": "Variable mountain weather",
      "precipitation": 8
    }]
  }'
```

## Troubleshooting

### Common Issues

#### 1. AI Service Unavailable (503 Error)

**Symptoms:**

```json
{
  "success": false,
  "error": {
    "code": "AI_SERVICE_ERROR",
    "message": "Ollama service is not available"
  }
}
```

**Solutions:**

1. Check Ollama is running: `ollama serve`
2. Verify model is available: `ollama list`
3. Test Ollama directly: `curl http://localhost:11434/api/generate`

#### 2. Validation Errors (400 Error)

**Common validation failures:**

- Empty destinations array
- Invalid date format (must be YYYY-MM-DD)
- Missing required trip fields

#### 3. Fallback Mode Responses

When AI is unavailable, the API automatically switches to rule-based logic:

```json
{
  "metadata": {
    "aiGenerated": false,
    "fallbackReason": "Ollama service unavailable, using rule-based generation"
  }
}
```

### Performance Considerations

- **Response Times**: AI generation typically takes 1-3 seconds
- **Timeout**: Requests timeout after 30 seconds
- **Caching**: No caching implemented; each request generates fresh recommendations

### Testing the API

#### Health Check Test

```bash
curl http://localhost:3000/health
```

#### Basic Generate Test

```bash
curl -X POST http://localhost:3000/generate \
  -H "Content-Type: application/json" \
  -d '{
    "trip": {
      "name": "Test Trip",
      "startDate": "2025-08-01",
      "endDate": "2025-08-03",
      "destinations": ["Paris, France"]
    },
    "weather": [{
      "location": "Paris, France",
      "temperature": 22,
      "conditions": "Sunny",
      "precipitation": 0
    }]
  }'
```

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture overview
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed troubleshooting guide
- [DEVLOG.md](DEVLOG.md) - Implementation history and changes
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment procedures
- [SECURITY.md](SECURITY.md) - Security configurations and best practices
