# SmartPack Development Instructions

## Project Overview

SmartPack is a mobile-first, single-user travel packing app built with React + TypeScript + Vite + Tailwind CSS + Headless UI. AI-powered suggestions via AWS Lambda + Ollama, weather integration with Open-Meteo API, and localStorage persistence.

## Development Workflow Standards

- Check CHECKLIST.md for current step and completion status
- Update DEVLOG.md with significant changes (ALWAYS add entries at TOP, never append)
- Reference ROADMAP.md for feature priorities and development phases
- Follow testing protocols in TESTING_GUIDELINES.md
- Use TROUBLESHOOTING.md for known issues and solutions

## File Organization Patterns

- Use path aliases: @components/, @hooks/, @utils/, @types/, @assets/, @pages/
- Organize by domain/feature, not technical type
- Centralize test utilities in src/test-utils/
- Documentation in docs/ with development/, testing/, api/ subdirectories

## Technology Stack & Patterns

### Frontend

- React 18+ with functional components and hooks
- TypeScript strict mode (no implicit any)
- Vite for build tooling and development server
- Tailwind CSS utility classes (no custom CSS)
- Headless UI for accessible components

### Backend & Integration

- AWS Lambda with Express framework
- Ollama for local AI processing
- Open-Meteo API for weather data (client-side)
- LocalStorage for all user data persistence

### Testing & Quality

- Unit/Integration: Vitest + React Testing Library
- E2E: Playwright with accessibility checks
- Accessibility: axe-core validation, WCAG 2.1 AA compliance
- Code Quality: ESLint strict + Prettier auto-format

## Documentation Maintenance

- DEVLOG.md: Reverse chronological order (newest entries at TOP)
- CHECKLIST.md: Mirror ROADMAP.md structure, track completion
- TROUBLESHOOTING.md: Symptom → Root Cause → Solution → Prevention
- ARCHITECTURE.md: Follow arc42 template, update ADRs for decisions

## Code Quality Requirements

### TypeScript Standards

- Strict mode enabled
- No implicit any types
- Proper type definitions for all props and functions
- Use interfaces for object types

### React Patterns

- Functional components with hooks
- Custom hooks for shared logic
- React.memo for expensive components
- Proper error boundaries

### Accessibility Standards

- WCAG 2.1 AA compliance mandatory
- 44px minimum touch targets
- Proper contrast ratios (3:1 for UI components)
- Screen reader optimization with ARIA labels
- Keyboard navigation support
- Focus management and visual indicators

## UI/UX Standards

### Design System

- Heroicons for all icons (no emojis)
- Mobile-first responsive design
- 3-column desktop layout: Trip Details | Packing List | AI Suggestions
- Dark mode support required
- Consistent spacing using Tailwind scale

### Component Patterns

- Card-style selections with proper states
- Button hierarchy: Primary (blue-50), Secondary (white), Utility (gray-50)
- Form patterns with debounced validation (750ms)
- Loading states and error handling
- Visual hierarchy with proper typography

## Testing Standards

### Test Organization

- Unit tests: src/**tests**/
- Integration tests: src/**tests**/integration/
- E2E tests: playwright/
- Test utilities: src/test-utils/ (centralized)

### Quality Gates

- All new features require comprehensive tests
- Accessibility validation with axe-core
- Mobile and desktop viewport testing
- Error boundary and edge case coverage
- LocalStorage persistence testing

## Development Commands Reference

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Production build
npm run lint                   # ESLint checking
npm run type-check            # TypeScript validation

# Testing
npm test -- --run            # Run all tests once
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests
npm run test:e2e              # Playwright E2E tests
npm run test:coverage         # Coverage report

# Backend
npm run lambda:dev            # Start backend server
npm run lambda:test           # Test backend functions
```

## Error Handling Patterns

### Common Issues

- Always check for hanging Node.js processes before testing
- Kill processes: `taskkill /F /IM node.exe`
- Use targeted testing instead of full test suite for quick validation
- Check TROUBLESHOOTING.md for specific error patterns

### Recovery Procedures

- TypeScript errors: Check tsconfig and dependency versions
- Test hanging: Kill processes, restart environment, use unit tests
- Build failures: Clear node_modules, npm install --legacy-peer-deps
- Integration issues: Check API endpoints and service connectivity

## Architecture Patterns

### State Management

- React Context for global state
- LocalStorage for persistence
- Custom hooks for business logic
- No external state management libraries

### Component Architecture

- Domain-based organization
- Reusable UI components
- Business logic in custom hooks
- Clear separation of concerns

### Performance

- React.memo for expensive renders
- Lazy loading for route components
- Debounced inputs for search/validation
- Optimized bundle size with tree shaking
