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
- `lambda/` - Backend Lambda functions (see ROADMAP.md)
- `copilotdocs/` - Project docs, logs, and commands

## Data Flow

- User enters trip details in frontend
- Weather data fetched client-side
- Trip + weather data sent to `/generate` Lambda endpoint
- Lambda connects to Ollama for AI suggestions
- Checklist and suggestions returned to frontend

## Integration Points

- REST API: `/generate` endpoint
- LocalStorage: persists user data
- Open-Meteo API: weather data

## See Also

- [ROADMAP.md](../.github/prompts/ROADMAP.md)
- [copilotdocs/COMMANDS.md](../copilotdocs/COMMANDS.md)
