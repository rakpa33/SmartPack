<!--
This file provides onboarding instructions and key setup steps for new contributors to SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Update this doc whenever onboarding steps, prerequisites, or key docs change. Review after major project or process changes.
-->

# Onboarding Guide for SmartPack

Welcome! This guide will help you (or future contributors) get up and running quickly.

## Prerequisites

- Node.js (LTS)
- npm
- AWS CLI (configured)
- Ollama (local/self-hosted, running)
- **Modern Browser**: For Heroicons vector icon rendering and accessibility features
- **(Optional)** AWS S3 bucket for frontend deployment
- **Testing Environment**: Playwright for E2E test execution

## Setup Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in required values (see ENVIRONMENT.md)
4. **Start both development servers:**
   - **Enhanced AI Backend**: `npm run lambda:dev` (runs on port 3000)
   - **Professional UI Frontend**: `npm run dev` (runs on port 5173)
5. **Verify enhanced setup:**
   - Backend health: Visit `http://localhost:3000/health`
   - Frontend: Visit `http://localhost:5173`
   - **Enhanced AI Test**: Create trip with specific details (e.g., "4-day business trip") and verify intelligent recommendations
   - **Professional UI Check**: Confirm Heroicons vector icons render properly
6. **Run comprehensive test suite**:
   - Unit/Integration tests: `npm test -- --run`
   - E2E tests: `npx playwright test`
   - Enhanced AI validation: `npm test -- enhancedAI`

## Development Workflow

### Daily Development

1. **Start Enhanced AI Backend**: `npm run lambda:dev`
2. **Start Professional UI Frontend**: `npm run dev` (in separate terminal)
3. Both must be running for Enhanced AI Suggestions to work properly
4. **Verify Enhanced Features**: Test intelligent recommendations and professional icons
5. **Run Test Suite**: Validate changes with comprehensive testing
6. Test changes, run tests, commit

### Enhanced Testing Strategy

- **Unit Tests**: `npm test -- --run` (enhanced AI logic and services)
- **Integration Tests**: `npm test -- enhancedAI.integration.test.tsx` (component interactions)
- **E2E Tests**: `npx playwright test` (full user workflows with intelligent AI)
- **Enhanced AI Validation**: Test context-aware recommendations vs. repetitive suggestions
- **Professional UI Testing**: Verify Heroicons icons render and accessibility compliance
- **Manual Testing**: Test AI Suggestions panel with varied trip scenarios
- **Health Check**: Ensure enhanced backend responds at `http://localhost:3000/health`

## Key Docs

- [copilotdocs/COMMANDS.md](../copilotdocs/COMMANDS.md): Common commands and troubleshooting
- [copilotdocs/CHECKLIST.md](../copilotdocs/CHECKLIST.md): Feature/milestone progress
- [copilotdocs/DEVLOG.md](../copilotdocs/DEVLOG.md): Major changes and troubleshooting sessions
- [copilotdocs/ARCHITECTURE.md](../copilotdocs/ARCHITECTURE.md): System architecture and component overview
- [copilotdocs/TROUBLESHOOTING.md](../copilotdocs/TROUBLESHOOTING.md): Common issues and solutions
- [.github/prompts/ROADMAP.md](../.github/prompts/ROADMAP.md): Project roadmap
- [.github/copilot-instructions.md](../.github/copilot-instructions.md): AI coding/workflow rules

## Current Status (Enhanced AI System Complete)

✅ **Enhanced AI Backend Implementation:**

- 7-aspect intelligent trip analysis (destinations, dates, modes, weather, purpose, duration, preferences)
- Context-aware packing recommendations replacing repetitive static suggestions
- Smart quantity calculations based on trip specifics

✅ **Professional UI Upgrade:**

- Heroicons React vector icon system with ARIA accessibility
- Professional design replacing emoji-based elements
- Optimized performance with tree-shaking

✅ **Comprehensive Testing Suite:**

- Unit tests (enhancedAI.unit.test.ts) - API service coverage with intelligent behavior validation
- Integration tests (enhancedAI.integration.test.tsx) - Complete user workflow testing
- E2E tests (enhancedAI.e2e.test.ts) - 8 real browser scenarios covering all trip types
- Test coverage following external best practices (Kent C. Dodds, React Testing Library)

✅ **All Core Features Enhanced:**

- Trip planning with intelligent geocoding and weather integration
- Dynamic context-aware packing checklist with smart categories
- Enhanced AI Suggestions Panel with intelligent custom prompts
- Professional responsive design with dark/light mode
- Enhanced local backend with intelligent Ollama integration
- Comprehensive test coverage (100% enhanced AI coverage)

🚀 **Ready for Production Deployment with Enhanced Intelligence**

## Updating Docs

- Always update `COMMANDS.md`, `CHECKLIST.md`, and `DEVLOG.md` as you develop.
- Reference this file for onboarding new contributors.
