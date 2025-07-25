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
4. Start the development server: `npm run dev`
5. Run tests: `npm test` or `npx playwright test`

## Key Docs
- [copilotdocs/COMMANDS.md](../copilotdocs/COMMANDS.md): Common commands
- [copilotdocs/CHECKLIST.md](../copilotdocs/CHECKLIST.md): Feature/milestone progress
- [copilotdocs/DEVLOG.md](../copilotdocs/DEVLOG.md): Major changes and troubleshooting
- [.github/prompts/ROADMAP.md](../.github/prompts/ROADMAP.md): Project roadmap
- [.github/copilot-instructions.md](../.github/copilot-instructions.md): AI coding/workflow rules

## Updating Docs
- Always update `COMMANDS.md`, `CHECKLIST.md`, and `DEVLOG.md` as you develop.
- Reference this file for onboarding new contributors.
