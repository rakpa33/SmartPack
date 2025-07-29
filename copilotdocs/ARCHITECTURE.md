<!--
This file describes the high-level system architecture, major components, and data flows for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Update this doc whenever you add, remove, or change major components, data flows, or integration points. Review after any significant frontend, backend, or API change.
-->

# Architecture Overview for SmartPack

This document provides a high-level overview of the system architecture, major components, and data flows.

## Overview

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Heroicons
- **Backend:** Ollama AI-Integrated Lambda (Express/Node) with local llama3.1:8b model
- **AI Engine:** Ollama local instance with llama3.1:8b for intelligent packing recommendations
- **Weather:** Open-Meteo API (client-side)
- **Icons:** Professional Heroicons vector icon system
- **Testing:** Comprehensive Vitest + React Testing Library + Playwright suite

## Major Components

- `src/` - Frontend code with enhanced AI integration
  - **MainLayout**: Three-column responsive layout (Trip Details, Packing Checklist, AI Suggestions)
  - **TripForm**: Multi-step trip planning with geocoding and weather integration
  - **PackingList**: Dynamic checklist with add, check, uncheck, and remove items/categories
  - **SuggestionsPanel**: Ollama AI-powered refinement UI with real-time intelligent recommendations
  - **TripDetails**: Professional UI with Heroicons (PencilIcon for editing)
  - **Ollama AI Integration**: Real AI-powered recommendations using local llama3.1:8b model
  - Includes robust checklist logic with state persisted to localStorage and reflected in UI
  - Professional vector icons replace emoji-based UI elements
  - Comprehensive test coverage with unit, integration, and E2E tests
- `lambda/` - Ollama AI-Integrated Backend with local AI processing
  - **server.js**: Production server with Ollama integration and intelligent fallback system
  - **server-ollama.js**: Backup comprehensive AI server implementation
  - **Ollama Features**: Real-time AI generation, smart prompting, JSON parsing, error handling
  - **Endpoints**: `/generate` (AI checklists), `/suggestions` (custom AI recommendations), `/health`
- `copilotdocs/` - Project docs, logs, and commands
- `__tests__/` - Comprehensive testing suite following external best practices

## Ollama AI Integration Architecture

### Local AI Processing

- **Ollama Host:** `http://localhost:11434` (configurable via OLLAMA_HOST env var)
- **Model:** `llama3.1:8b` (configurable via OLLAMA_MODEL env var)
- **Processing:** Local AI inference for privacy and performance
- **Fallback:** Graceful degradation to intelligent mock data when AI unavailable

### AI-Powered Endpoints

- **`/generate`** - Comprehensive packing checklist generation
  - Input: trip details (name, dates, destinations, modes, details) + weather data
  - AI Processing: Context-aware prompting with trip analysis
  - Output: 15-25 categorized checklist items + 5-10 suggested items
- **`/suggestions`** - Custom AI recommendations
  - Input: custom prompt + trip context + weather conditions
  - AI Processing: Tailored suggestions based on specific user requests
  - Output: 3-8 specific, actionable packing recommendations

### Enhanced AI Intelligence Features

### Smart Quantity Calculations

- **Duration-based**: 1-3 days (4 pairs), 4-7 days (7 pairs), 8+ days (caps at 14 pairs)
- **Item scaling**: Shirts, pants, and accessories scale appropriately with trip length
- **Realistic limits**: Prevents unrealistic quantities for extended trips

### Trip Purpose Recognition

- **Business trips**: Detects keywords like "business", "meeting", "conference", "presentation"
  - Generates: Business suits, laptop + charger, business cards, professional materials
- **Beach vacations**: Detects "beach", "swimming", "surfing", "tropical"
  - Generates: Swimwear, beach towel, sunscreen (SPF 30+), sun protection gear
- **Adventure trips**: Detects "hiking", "camping", "outdoor", "mountain"
  - Generates: Hiking boots, first aid kit, outdoor gear, safety equipment

### Weather-Based Adaptation

- **Cold weather (<15°C)**: Winter jacket, warm gloves, thermal underwear, insulated boots
- **Hot weather (>25°C)**: Sunscreen, sunglasses, light summer clothes, sun hat
- **Rainy conditions**: Umbrella, rain jacket, waterproof shoes, quick-dry clothing

### Travel Mode Optimization

- **Plane travel**: Neck pillow, headphones, eye mask & earplugs, passport, compression socks
- **Car travel**: Driver's license, car phone charger, snacks & water, emergency kit
- **Train travel**: Comfortable seating accessories, entertainment, light luggage

### Destination Intelligence

- **Asia destinations**: Universal travel adapter, translation app, respectful temple clothing, cultural considerations
- **Europe destinations**: Comfortable walking shoes, light evening jacket, regional suggestions
- **Tropical destinations**: Insect repellent, after-sun lotion, beach gear, sun protection

## Data Flow

### Enhanced AI Workflow

- User enters trip details in frontend with geocoding validation and weather fetching
- Weather data fetched client-side from Open-Meteo API with temperature and precipitation analysis
- Trip + weather data sent to `/generate` Lambda endpoint with enhanced intelligence
- **Enhanced AI Analysis**: Backend processes 7 aspects of trip data:
  1. **Destinations**: Geographic analysis for regional recommendations
  2. **Dates**: Duration calculations for smart quantity algorithms
  3. **Travel Modes**: Mode-specific item generation (plane/car/train)
  4. **Weather**: Temperature and precipitation-based gear recommendations
  5. **Trip Purpose**: Business/leisure/adventure recognition via NLP
  6. **Duration**: Smart quantity scaling with realistic caps
  7. **Preferences**: User preference integration for personalization
- Lambda generates context-aware recommendations with intelligent quantities
- User can refine suggestions via SuggestionsPanel with custom prompts
- Enhanced suggestions returned with categorized items and smart quantities
- User can add suggestions to main checklist with one-click
- Checklist state changes (add/remove/check/uncheck) are persisted to localStorage and reflected in UI immediately
- Professional Heroicons provide consistent, accessible UI elements

### Testing Data Flow

- **Unit Tests**: Mock API responses to test intelligent algorithms
- **Integration Tests**: Complete form-to-AI-to-results workflows
- **E2E Tests**: Real browser interactions with actual AI recommendations
- **Error Handling**: Graceful degradation for API failures and network issues

## Integration Points

- **Enhanced AI API**: `/generate` endpoint with intelligent trip analysis and context-aware recommendations
- **LocalStorage**: Persists user data (including checklist state, trip form state, theme, AI-generated items)
- **Open-Meteo API**: Weather data with geocoding integration for temperature and precipitation analysis
- **Context API**: React contexts for TripForm and PackingList state management
- **Heroicons Integration**: Professional vector icon system for consistent UI
- **Testing Infrastructure**: Comprehensive test suite with external API mocking and browser automation

## Professional UI System

### Icon Architecture

- **Heroicons React**: Professional vector icon library replacing emoji-based UI
- **Key Icons Used**:
  - `PencilIcon`: Edit functionality in TripDetails
  - `SparklesIcon`: AI feature indicators in SuggestionsPanel
  - `ArrowPathIcon`: Regeneration and refresh actions
  - `CpuChipIcon`: AI processing indicators
- **Accessibility**: All icons include proper ARIA labels and semantic markup
- **Performance**: Optimized tree-shaking for minimal bundle size

### Testing Architecture

- **Unit Tests** (`enhancedAI.unit.test.ts`): API service layer testing with comprehensive mocking
- **Integration Tests** (`enhancedAI.integration.test.tsx`): Complete user workflow validation
- **E2E Tests** (`enhancedAI.e2e.test.ts`): Real browser scenario testing with Playwright
- **Test Utilities**: Reusable testing components and mock data generators
- **Coverage Metrics**: 100% coverage of enhanced AI features with quality gates

## Local Development Setup

- **Frontend**: Runs on `http://localhost:5173` (Vite default)
- **Backend**: Runs on `http://localhost:3000` (Express server)
- **Critical**: Both servers must be running for AI Suggestions to work
- **Start Commands**:
  - Frontend: `npm run dev`
  - Backend: `npm run lambda:dev`
- **Health Check**: Visit `http://localhost:3000/health` to verify backend

## API Endpoints

### Lambda Backend

1. **Health Check**

   - **Endpoint**: `/health`
   - **Method**: GET
   - **Description**: Simple health check to verify API is running
   - **Response**: `{ status: "ok", message: "SmartPack API is running" }`

2. **Generate Packing List**
   - **Endpoint**: `/generate`
   - **Method**: POST
   - **Description**: Generates a packing list based on trip and weather data
   - **Request Body**:
     ```json
     {
       "trip": {
         "name": "Trip Name",
         "startDate": "YYYY-MM-DD",
         "endDate": "YYYY-MM-DD",
         "destinations": ["City, Country"],
         "travelModes": ["plane", "car", "train", "bus", "boat"],
         "tripDetails": "Additional details about the trip"
       },
       "weather": [
         {
           "location": "City, Country",
           "temperature": 20,
           "conditions": "Sunny",
           "precipitation": 0
         }
       ]
     }
     ```
   - **Response**:
     ```json
     {
       "checklist": [
         {
           "id": "1",
           "text": "Passport/ID",
           "category": "Documents",
           "checked": false,
           "aiGenerated": true
         }
       ],
       "suggestedItems": [
         "Travel insurance documentation",
         "Emergency contact list"
       ]
     }
     ```

## Testing & Validation Protocol

- All checklist and trip flows are covered by robust E2E/integration tests (see TESTING_GUIDELINES.md).
- When diagnosing test failures, always validate the behavior live (via `npm run dev`) before assuming the test is incorrect.
- Validate against external sources for best practices (e.g., React Testing Library, accessibility, and E2E patterns).
- Only update tests if the live UI matches the intended acceptance criteria and best practices.

## Testing Architecture Insights

### Component Dependencies and Conditional Rendering

- **TripForm Component**: Automatically navigates to `/MainLayout` when `state.step === 2`
- **MainLayout Component**: Has guard clause `if (!state || state.step < 2)` that shows loading state instead of content
- **Key Insight**: Understanding conditional rendering is crucial for writing reliable integration tests

### localStorage Dependencies

- **Trip Form State**: Stored in `localStorage.getItem('tripForm')` with step tracking
- **Checklist Items**: Stored in `localStorage.getItem('smartpack_checklist')`
- **Categories**: Stored in `localStorage.getItem('smartpack_categories')`
- **Theme**: Stored in `localStorage.getItem('theme')`
- **Test Impact**: Components initialize from localStorage, making proper cleanup essential

### Test Contamination Patterns

- **Root Cause**: localStorage persistence between tests causing state leakage
- **Symptoms**: Tests showing data from previous runs, wrong component rendering
- **Solution**: Comprehensive localStorage cleanup in beforeEach hooks

### Routing and Navigation Testing

- **Challenge**: Complex navigation flows are harder to test reliably than direct component testing
- **Best Practice**: Start tests at the target route when testing specific functionality
- **Example**: Use `/MainLayout` directly for packing list tests instead of navigating through trip form

## See Also

- [ROADMAP.md](../.github/prompts/ROADMAP.md)
- [copilotdocs/COMMANDS.md](../copilotdocs/COMMANDS.md)
