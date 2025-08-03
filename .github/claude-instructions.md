# SmartPack - Claude Development Instructions

# Recommended VS Code Extensions

To ensure a smooth and productive SmartPack development workflow, install and enable the following VS Code extensions:

- **ESLint** (`dbaeumer.vscode-eslint`): Enforces code quality and style.
- **Prettier** (`esbenp.prettier-vscode`): Auto-formats code for consistency.
- **Playwright Test for VSCode** (`ms-playwright.playwright`): E2E and integration testing.
- **Vitest Explorer** (`vitest.explorer`): Unit and integration test management.
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Tailwind utility autocompletion.
- **axe Accessibility Linter** (`dequelabs.axe-linter`): Automated accessibility checks.
- **Pretty TypeScript Errors** (`yoavbls.pretty-ts-errors`): Improved TypeScript error messages.
- **Turbo Console Log** (`ChakrounAnas.turbo-console-log`): Fast logging for debugging.
- **Quokka.js** (`WallabyJs.quokka-vscode`): Live prototyping for JS/TS code.

These extensions are recommended in `.vscode/extensions.json` and should be installed for all contributors. Remove language packs or tools not relevant to SmartPack's stack for best performance.

# Working Directory

**Always run terminal commands, scripts, and npm tasks from the `SmartPack/SmartPack` directory.**

If you open a new terminal, first run:

```cmd
cd SmartPack\SmartPack
```

This ensures all commands (e.g., `npm install`, `npm run dev`, `npm test`) execute in the correct project context.

## Project Overview

SmartPack is a mobile-first, single-user travel packing app built with React + TypeScript + Vite + Tailwind CSS + Headless UI. AI-powered suggestions via AWS Lambda + Ollama, weather integration with Open-Meteo API, and localStorage persistence.

## Primary Development Context

**🎯 Main Reference**: [CLAUDE.md](../SmartPack/CLAUDE.md) - **Start Here for All Development**

This file contains comprehensive development context including:
- Complete technology stack and architecture
- Development workflows and quality standards  
- Common commands and debugging procedures
- AI integration context and setup
- Testing strategies and accessibility requirements

## Quick Reference Links

- **Development History**: `docs/development/DEVLOG.md` (technical context, newest entries at TOP)
- **Issue Resolution**: `docs/development/TROUBLESHOOTING.md` (known issues and solutions)
- **Architecture**: `docs/development/ARCHITECTURE.md` (comprehensive system overview)
- **Testing Guidelines**: `docs/testing/TESTING_GUIDE.md` (testing strategies and standards)
- **Progress Tracking**: `docs/development/CHECKLIST.md` (current step and completion)

## Essential Quick Start

### Working Directory
**Always run commands from**: `SmartPack/SmartPack`

### Core Commands
```bash
# Development
npm run dev:all               # Both frontend + backend
npm run lint && npm run type-check  # Quality check

# Testing (targeted approach recommended)
npm test -- --run ComponentName.test.tsx

# Quick validation
npm run build                 # Ensure production readiness
```

## Claude Development Guidelines

### Context-First Approach
1. **Start with [CLAUDE.md](../SmartPack/CLAUDE.md)**: Contains all development context
2. **Check documentation**: ARCHITECTURE.md, DEVLOG.md, TROUBLESHOOTING.md
3. **Follow established patterns**: Maintain consistency with existing components
4. **Document decisions**: Add technical context to DEVLOG.md for complex changes

### Key Principles
- **Documentation-first**: Reference existing docs before implementation
- **Incremental development**: Small, testable changes
- **Quality gates**: Lint, type-check, test before completion
- **Accessibility-first**: WCAG 2.1 AA compliance mandatory

### Error Handling
- **Categorize failures**: NEW / PRE-EXISTING / ENVIRONMENTAL
- **Check TROUBLESHOOTING.md** for known solutions
- **Terminal output analysis**: Always read and analyze command output

**For complete development context, commands, and detailed guidelines, see [CLAUDE.md](../SmartPack/CLAUDE.md)**