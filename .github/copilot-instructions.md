# SmartPack - GitHub Copilot Instructions

## Project Overview

SmartPack is a mobile-first, single-user travel packing app built with React + TypeScript + Vite + Tailwind CSS + Headless UI. AI-powered suggestions via AWS Lambda + Ollama, weather integration with Open-Meteo API, and localStorage persistence.

## Quick Reference

For comprehensive guidance, reference these instruction files:

- **Development**: [smartpack-development.instructions.md](.github/smartpack-development.instructions.md)
- **Testing**: [smartpack-testing.instructions.md](.github/smartpack-testing.instructions.md)
- **Documentation**: [smartpack-documentation.instructions.md](.github/smartpack-documentation.instructions.md)

## Key Documentation Files

- **Progress Tracking**: `docs/development/CHECKLIST.md` (current step and completion)
- **Development History**: `docs/development/DEVLOG.md` (technical context, newest entries at TOP)
- **Issue Resolution**: `docs/development/TROUBLESHOOTING.md` (known issues and solutions)
- **Project Phases**: `docs/development/ROADMAP.md` (development milestones)

## Core Development Standards

### Technology Stack

- **Frontend**: React 18+ functional components, TypeScript strict mode
- **Styling**: Tailwind CSS utilities only, Headless UI for accessibility
- **Testing**: Vitest + React Testing Library + Playwright
- **Backend**: AWS Lambda + Express + Ollama AI

### File Organization

- Use path aliases: `@components/`, `@hooks/`, `@utils/`, `@types/`
- Organize by domain/feature, not technical type
- Centralized test utilities in `src/test-utils/`

### Quality Requirements

- **WCAG 2.1 AA compliance**: 44px touch targets, proper contrast ratios
- **TypeScript strict mode**: No implicit any, proper interfaces
- **Mobile-first responsive design**: 3-column desktop, stacked mobile
- **LocalStorage persistence**: All user data stored locally

### Testing Standards

- Unit tests with React Testing Library
- Integration tests for user workflows
- E2E tests with Playwright + accessibility checks
- Target testing over full test suite for quick validation

### Documentation Protocol

- **DEVLOG.md**: Add entries at TOP (reverse chronological)
- **TROUBLESHOOTING.md**: Symptom → Root Cause → Solution → Prevention
- **CHECKLIST.md**: Track progress, mirror ROADMAP.md structure

## AI Assistant Guidelines

- **Documentation First**: Reference current official docs before implementation
- **Error Analysis**: Always categorize test failures (NEW/PRE-EXISTING/ENVIRONMENTAL)
- **Incremental Development**: Use targeted testing and validation
- **Context Preservation**: Document decisions with sufficient detail for future maintenance

## Common Commands

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Production build
npm run lint                   # ESLint checking

# Testing (prefer targeted over full suite)
npm test -- --run ComponentName.test.tsx
npm run test:unit             # Unit tests only
npm run test:e2e              # Playwright E2E

# Backend
npm run lambda:dev            # Start backend server
```
