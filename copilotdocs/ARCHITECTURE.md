<!--
This file describes the high-level system architecture, major components, and data flows for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Update this doc whenever you add, remove, or change major components, data flows, or integration points. Review after any significant frontend, backend, or API change.
-->

# Architecture Overview for SmartPack

This document provides a high-level overview of the system architecture, major components, and data flows.

## Overview

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Headless UI
- **Backend:** AWS Lambda (Express/Node) + Ollama (local/self-hosted)
- **Weather:** Open-Meteo API (client-side)

## Major Components

- `src/` - Frontend code (see ROADMAP.md for structure)
  - Includes robust checklist logic: add, check, uncheck, and remove items/categories, with state persisted to localStorage and reflected in UI.
  - E2E/integration tests validate all checklist acceptance criteria and UI flows.
- `lambda/` - Backend Lambda functions (see ROADMAP.md)
- `copilotdocs/` - Project docs, logs, and commands

## Data Flow

- User enters trip details in frontend
- Weather data fetched client-side
- Trip + weather data sent to `/generate` Lambda endpoint
- Lambda connects to Ollama for AI suggestions
- Checklist and suggestions returned to frontend
- Checklist state changes (add/remove/check/uncheck) are persisted to localStorage and reflected in UI immediately

## Integration Points

- REST API: `/generate` endpoint
- LocalStorage: persists user data (including checklist state)
- Open-Meteo API: weather data

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
