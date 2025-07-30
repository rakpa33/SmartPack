# SmartPack - GitHub Copilot Instructions

## Project Overview

SmartPack is a mobile-first, single-user travel packing app built with:

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Headless UI
- **AI/Backend:** AWS Lambda (Express/Node) + Ollama (local/self-hosted)
- **Weather:** Open-Meteo API (client-side)
- **Goal:** Responsive, accessible, and persistent packing checklist with AI suggestions and weather integration.

## Architecture & Structure

- **Frontend:**
  - Located in `src/` directory
  - Uses Tailwind for styling and Headless UI for accessible components
  - Key UI patterns: mobile-first layouts, 3-column desktop, dark mode, and persistent state via localStorage
- **Backend:**
  - AWS Lambda functions using Express, deployed via Serverless Framework
  - `/generate` endpoint receives trip + weather data, connects to Ollama for AI packing suggestions
- **Documentation:**
  - Technical docs in `docs/` directory with organized subdirectories
  - Progress tracking in `docs/development/CHECKLIST.md` and `docs/development/DEVLOG.md`

## Project Conventions

- **All code is TypeScript**
- **UI:** Use Tailwind utility classes and Headless UI components for all new UI
- **State:** Use React context or custom hooks for shared state
- **Persistence:** Use localStorage for all user data—no cloud sync or authentication
- **Documentation Reference:** When implementing features or solving problems, always reference current official documentation for frameworks, libraries, and tools if there's any uncertainty about syntax, best practices, or API changes

## File Organization Standards

- **Import Paths:** Always use path aliases over relative imports:
  - `@components/` for `src/components/`
  - `@hooks/` for `src/hooks/`
  - `@utils/` for `src/utils/`
  - `@test-utils/` for `src/test-utils/`
  - `@pages/` for `src/pages/`
  - `@types/` for `src/types/`
  - `@assets/` for `src/assets/`
- **Configuration:** Single `vite.config.ts` handles both Vite and Vitest configuration
- **Testing Utilities:** Centralized in `src/test-utils/` with proper re-exports
- **Documentation:** Organized in `docs/` with subdirectories for development, testing, prompts, and API docs
- **Component Structure:** Organize by domain/feature, not by technical type

## Code Quality Standards

- **Testing:**
  - Write unit tests using Vitest and React Testing Library in `src/__tests__/`
  - Write E2E tests using Playwright in `playwright/`
  - Include accessibility checks with axe-core and Playwright assertions
  - Use centralized test utilities from `@test-utils/`
- **Code Quality:**
  - Use TypeScript strict mode
  - Follow React functional component patterns
  - Use modern ES6+ syntax
  - Prefer arrow functions for callbacks
  - Use path aliases instead of relative imports
  - Follow file organization standards in `docs/development/FILE_ORGANIZATION.md`
- **AI Integration:**
  - All AI suggestions flow through the `/generate` Lambda endpoint
  - Weather data is fetched client-side and sent to backend for AI context

## Integration Points & Patterns

- **Frontend/Backend:** All backend communication via REST endpoints, no direct database access
- **Component Structure:** Organize by domain in `components/`, `pages/`, `hooks/`, `utils/`, `types/`, `styles/`
- **Error Handling:** Use try-catch blocks and proper error boundaries
- **Performance:** Implement React.memo for expensive components, use lazy loading
- **Accessibility:** Ensure WCAG 2.1 AA compliance, use semantic HTML and ARIA labels
- **Build & Deploy:**
  - Build frontend with `npm run build`
  - Deploy static frontend to AWS S3 with CloudFront CDN
  - Deploy backend to AWS Lambda using Serverless Framework

## AI Assistant Guidelines

- **Documentation First:** Always check and reference current official documentation when implementing features or APIs for React, TypeScript, Vite, Tailwind CSS, Headless UI, Vitest, Playwright, or any other project dependencies
- **Version Awareness:** Verify current syntax and best practices for all frameworks and libraries before providing code examples
- **Uncertainty Protocol:** If uncertain about implementation details, syntax, or best practices, explicitly state the uncertainty and reference official documentation
- **Breaking Changes:** Check for recent breaking changes or deprecated features in project dependencies before suggesting code
- **Best Practices:** Always follow the most current best practices and conventions for each technology in the stack
