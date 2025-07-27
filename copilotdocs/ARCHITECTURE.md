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

## Testing & Validation Protocol

- All checklist and trip flows are covered by robust E2E/integration tests (see TESTING_GUIDELINES.md).
- When diagnosing test failures, always validate the behavior live (via `npm run dev`) before assuming the test is incorrect.
- Validate against external sources for best practices (e.g., React Testing Library, accessibility, and E2E patterns).
- Only update tests if the live UI matches the intended acceptance criteria and best practices.

## See Also

- [ROADMAP.md](../.github/prompts/ROADMAP.md)
- [copilotdocs/COMMANDS.md](../copilotdocs/COMMANDS.md)
