# Copilot Instructions for SmartPack

## Project Overview
SmartPack is a mobile-first, single-user travel packing app built with:
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Headless UI
- **AI/Backend:** AWS Lambda (Express/Node) + Ollama (local/self-hosted)
- **Weather:** Open-Meteo API (client-side)
- **Goal:** Responsive, accessible, and persistent packing checklist with AI suggestions and weather integration.

## Architecture & Structure
- **Frontend:**  
  - Located in `src/` (see Implementation_Plan.md for structure).
  - Uses Tailwind for styling and Headless UI for accessible components.
  - Key UI patterns: mobile-first layouts, 3-column desktop, dark mode, and persistent state via localStorage.
- **Backend:**  
  - AWS Lambda functions (see `lambda/` in plan) using Express, deployed via Serverless Framework.
  - `/generate` endpoint receives trip + weather data, connects to Ollama for AI packing suggestions.
- **Docs & Prompts:**  
  - `.github/prompts/Implementation_Plan.md`: authoritative roadmap, phases, and deliverables.
  - `.github/prompts/Smartpack_Prompts.prompt.md`: workflow prompts for Copilot Chat.
  - `copilotdocs/Checklist.md` and `copilotdocs/Devlog.md`: track progress and log major changes.

## Key Workflows
- **Development:**  
  - Scaffold with Vite, install dependencies as per Implementation_Plan.md.
  - Use Tailwind and Headless UI for all UI work.
  - Persist user data (trip, checklist) in localStorage.
- **Testing:**  
  - Use Vitest/RTL for integration tests (`src/__tests__/`).
  - Use Playwright for E2E tests (`playwright/`).
  - Accessibility checks with axe-core and Playwright assertions.
- **Build & Deploy:**  
  - Build frontend with `npm run build`.
  - Deploy static frontend to AWS S3 (optionally behind CloudFront).
  - Deploy backend to Lambda using Serverless Framework.

## Project Conventions
- **All code is TypeScript.**
- **UI:** Use Tailwind utility classes and Headless UI components for all new UI.
- **State:** Use React context or custom hooks for shared state (see `useTripForm.ts`).
- **Persistence:** Use localStorage for all user data—no cloud sync or authentication.
- **AI Integration:**  
  - All AI suggestions flow through the `/generate` Lambda endpoint.
  - Weather data is fetched client-side and sent to backend for AI context.
- **Documentation:**  
  - Update `Checklist.md` and `Devlog.md` as features/milestones are completed or major issues resolved.
  - Follow the Implementation Plan for all phases and deliverables.

## Integration Points & Patterns
- **Frontend/Backend:**  
  - All backend communication is via REST endpoints (see `/generate`).
  - Weather API is called client-side; results are passed to backend for AI.
- **Component Structure:**  
  - Organize components by domain: `components/`, `pages/`, `hooks/`, `utils/`, `types/`, `styles/`.
  - Use the folder structure outlined in Implementation_Plan.md.

## Common Commands
- See `copilotdocs/Commands.md` for all frequently used development, testing, and deployment commands.
- **Always update `copilotdocs/Commands.md` whenever you add, remove, or change a commonly used command or script.**

## Onboarding & Troubleshooting
- See `copilotdocs/ONBOARDING.md` for setup and onboarding steps.
- See `copilotdocs/TROUBLESHOOTING.md` for common issues and solutions.
- See `copilotdocs/ENVIRONMENT.md` for required environment variables and usage.
- See `copilotdocs/ARCHITECTURE.md` for a high-level system overview.

## Examples
- **Adding a new feature:**  
  - Reference the Implementation Plan for the correct phase/step.
  - Update `Checklist.md` and log in `Devlog.md` after completion.
- **Testing:**  
  - Place integration tests in `src/__tests__/`.
  - E2E flows in `playwright/`.

## References
- See `.github/prompts/ROADMAP.md` for the authoritative roadmap.
- Use `.github/prompts/PROMPTS.md` for Copilot Chat workflows.
- Progress and logs: `copilotdocs/CHECKLIST.md`, `copilotdocs/DEVLOG.md`.
