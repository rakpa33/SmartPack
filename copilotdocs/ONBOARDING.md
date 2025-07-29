<!--
This file provides comprehensive onboarding instructions, environment setup, and workflow guidance for new contributors to SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Complete setup guide for development environment (Node.js, Ollama AI, dependencies)
- Step-by-step onboarding workflow with verification checkpoints
- Current project status summary with enhanced AI features and testing coverage
- Key documentation navigation for new contributors
- Development workflow patterns and daily procedures
- Integration testing guidance for enhanced AI and professional UI features

TARGET AUDIENCE:
- New developers joining the SmartPack project
- AI assistants providing onboarding support
- Contributors returning after extended absence
- Deployment engineers setting up production environments
- QA engineers validating complete system functionality

WHEN TO UPDATE:
1. DEPENDENCY CHANGES: Node.js version updates, npm version changes, new required tools
2. ENVIRONMENT SETUP: Ollama model updates, new environment variables, configuration changes
3. WORKFLOW UPDATES: New development scripts, testing procedures, deployment processes
4. FEATURE COMPLETION: Major milestones, enhanced AI updates, UI improvements
5. TOOLING CHANGES: New testing frameworks, build tools, development utilities
6. DOCUMENTATION STRUCTURE: New docs, reorganized files, updated cross-references

UPDATE GUIDELINES:
- Keep prerequisites current with actual project requirements and package.json engines
- Verify all setup commands work on clean environments before documenting
- Update status sections when major features are completed or enhanced
- Maintain step-by-step verification procedures with expected outputs
- Cross-reference with COMMANDS.md for command syntax and TROUBLESHOOTING.md for common issues
- Include version numbers and compatibility requirements for all tools

SETUP VERIFICATION CHECKLIST:
- All prerequisite tools installed with correct versions
- Ollama AI service running with required model (llama3.1:8b)
- Backend health endpoint responding correctly
- Frontend development server accessible
- Enhanced AI integration functional (not falling back to mock data)
- Professional UI features rendering properly (Heroicons, accessibility)
- Complete test suite passing (unit, integration, E2E)

WORKFLOW INTEGRATION:
- Daily development startup sequence with service verification
- Testing strategy explanation for different test types
- Development cycle patterns for enhanced AI features
- Quality gates and validation procedures
- Cross-document references for detailed technical guidance

HOW TO USE FOR AI ASSISTANCE:
- Reference this document for complete environment setup before troubleshooting
- Use verification checkpoints to diagnose setup issues systematically
- Check current status sections to understand implemented features and capabilities
- Cross-reference with COMMANDS.md for specific command syntax and options
- Consult TROUBLESHOOTING.md for common setup and integration issues
- Validate that setup instructions align with current project dependencies and requirements
-->

# Onboarding Guide for SmartPack

Welcome! This guide will help you (or future contributors) get up and running quickly.

## Prerequisites

- **Node.js** v20.14.0+ (LTS)
- **npm** 10.7.0+
- **Ollama** (local AI service)
  - Download from: https://ollama.ai/
  - Must have llama3.1:8b model installed
- **Modern Browser**: For Heroicons vector icon rendering and accessibility features
- **(Optional)** AWS CLI (configured) for deployment
- **(Optional)** AWS S3 bucket for frontend deployment
- **Testing Environment**: Playwright for E2E test execution

## Setup Steps

1. **Clone the repository**
2. **Install Ollama and AI model:**
   ```bash
   # Download Ollama from https://ollama.ai/
   ollama pull llama3.1:8b
   ollama serve  # Start service on port 11434
   ```
3. **Install project dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
4. **Copy environment configuration:**
   ```bash
   # Copy .env.example to .env and configure (see ENVIRONMENT.md)
   # Key variables: OLLAMA_HOST=http://localhost:11434, OLLAMA_MODEL=llama3.1:8b
   ```
5. **Start development environment:**

   ```bash
   # Terminal 1: Ollama service (if not running as system service)
   ollama serve

   # Terminal 2: AI-integrated backend
   npm run lambda:dev

   # Terminal 3: Frontend
   npm run dev
   ```

6. **Verify complete setup:**
   - **Ollama AI**: `http://localhost:11434` (service running)
   - **Backend Health**: `http://localhost:3000/health` (API ready)
   - **Frontend**: `http://localhost:5173` (UI running)
   - **AI Integration Test**: Create trip and verify real AI-generated recommendations (not mock data)
   - **Professional UI Check**: Confirm Heroicons vector icons render properly
7. **Run comprehensive test suite:**
   ```bash
   npm test -- --run                    # Unit/Integration tests
   npx playwright test                   # E2E tests
   npm test -- enhancedAI               # AI-specific validation
   ```

## Development Workflow

### Daily Development Setup

1. **Verify Ollama**: `ollama list` (confirm llama3.1:8b available)
2. **Start AI-Integrated Backend**: `npm run lambda:dev`
3. **Start Professional UI Frontend**: `npm run dev` (separate terminal)
4. **Validate AI Integration**: Test that checklist generation uses real AI (not fallback)
5. **Verify Enhanced Features**: Test intelligent recommendations and professional icons
6. **Development Cycle**: Make changes → Test AI integration → Run test suite → Commit

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
