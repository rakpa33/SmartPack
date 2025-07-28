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
- (Optional) AWS S3 bucket for frontend deployment

## Setup Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in required values (see ENVIRONMENT.md)
4. **Start both development servers:**
   - Backend: `npm run lambda:dev` (runs on port 3000)
   - Frontend: `npm run dev` (runs on port 5173)
5. **Verify setup:**
   - Backend health: Visit `http://localhost:3000/health`
   - Frontend: Visit `http://localhost:5173`
6. Run tests: `npm test -- --run` or `npx playwright test`

## Development Workflow

### Daily Development

1. Start backend: `npm run lambda:dev`
2. Start frontend: `npm run dev` (in separate terminal)
3. Both must be running for AI Suggestions to work
4. Test changes, run tests, commit

### Testing Strategy

- Unit tests: `npm test -- --run` (avoid watch mode for final verification)
- E2E tests: `npx playwright test`
- Manual testing: Test AI Suggestions panel with custom prompts
- Health check: Ensure backend responds at `http://localhost:3000/health`

## Key Docs

- [copilotdocs/COMMANDS.md](../copilotdocs/COMMANDS.md): Common commands and troubleshooting
- [copilotdocs/CHECKLIST.md](../copilotdocs/CHECKLIST.md): Feature/milestone progress
- [copilotdocs/DEVLOG.md](../copilotdocs/DEVLOG.md): Major changes and troubleshooting sessions
- [copilotdocs/ARCHITECTURE.md](../copilotdocs/ARCHITECTURE.md): System architecture and component overview
- [copilotdocs/TROUBLESHOOTING.md](../copilotdocs/TROUBLESHOOTING.md): Common issues and solutions
- [.github/prompts/ROADMAP.md](../.github/prompts/ROADMAP.md): Project roadmap
- [.github/copilot-instructions.md](../.github/copilot-instructions.md): AI coding/workflow rules

## Current Status (Phase 3 Complete)

✅ **All Core Features Implemented:**

- Trip planning with geocoding and weather integration
- Dynamic packing checklist with categories
- AI Suggestions Panel with custom prompts
- Responsive design with dark/light mode
- Local backend with Ollama integration
- Comprehensive test coverage (97% pass rate)

🚀 **Ready for Production Use**

## Updating Docs

- Always update `COMMANDS.md`, `CHECKLIST.md`, and `DEVLOG.md` as you develop.
- Reference this file for onboarding new contributors.
