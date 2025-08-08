# SmartPack Project Structure

## Root Directory Structure
```
SmartPack/
├── .claude/               # Claude AI assistant configuration
│   ├── agents/           # Specialized agent definitions
│   └── scratchpad.md     # Session context sharing
├── .github/              # GitHub configuration
├── .vscode/              # VS Code settings
├── docs/                 # Project documentation
│   ├── development/      # Development docs (DEVLOG, TROUBLESHOOTING)
│   ├── testing/         # Testing documentation
│   └── api/             # API documentation
├── scripts/              # Utility scripts
├── SmartPack/           # Main application directory
└── Project docs (CLAUDE.md, README.md, etc.)
```

## SmartPack Application Directory
```
SmartPack/SmartPack/
├── src/                  # Source code
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript type definitions
│   ├── services/        # API and external services
│   ├── assets/          # Static assets
│   ├── pages/           # Page components
│   ├── __tests__/       # Test files
│   └── test-utils/      # Testing utilities
├── lambda/              # Backend AWS Lambda functions
│   ├── app.ts          # Express server application
│   ├── server.js       # Local development server
│   └── test-ollama.js  # Ollama connection tester
├── public/              # Static public files
├── playwright/          # E2E test configurations
├── tests/              # Additional test files
└── Configuration files (package.json, tsconfig.json, etc.)
```

## Key Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - App-specific TypeScript config
- `vite.config.ts` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Code formatting rules
- `playwright.config.ts` - E2E test configuration
- `vitest.config.ts` - Unit test configuration

## Important Source Files

### Components (`src/components/`)
- `TripForm.tsx` - Multi-step trip planning form
- `PackingList.tsx` - Main packing list component
- `TripDetails.tsx` - Trip information display
- `SuggestionsPanel.tsx` - AI suggestions interface
- `MainLayout.tsx` - Three-column layout system
- `TripWeatherPanel.tsx` - Weather display

### Hooks (`src/hooks/`)
- `useTripForm.ts` - Trip form state management
- `usePackingList.ts` - Packing list operations
- `useWeather.ts` - Weather data fetching
- `useOllama.ts` - AI integration hook

### Services (`src/services/`)
- `apiService.ts` - Backend API client
- `ollamaService.ts` - Ollama AI service
- `weatherService.ts` - Weather API integration

### Types (`src/types/`)
- TypeScript interfaces and type definitions
- Shared types across the application

## Backend Structure (`lambda/`)
- Express.js server for local development
- AWS Lambda function handlers
- Ollama AI integration
- CORS and error handling middleware

## Testing Structure
- Unit tests: Co-located with components (`.test.tsx`)
- Integration tests: `src/__tests__/integration/`
- E2E tests: `playwright/` directory
- Test utilities: `src/test-utils/`

## Documentation Hierarchy
1. **Root CLAUDE.md** - Project memory and guidelines
2. **SmartPack/CLAUDE.md** - Development context
3. **docs/development/DEVLOG.md** - Development history
4. **docs/development/TROUBLESHOOTING.md** - Issue tracking
5. **Component-level docs** - In-code documentation

## Build Output
- `dist/` - Production build output (gitignored)
- `node_modules/` - Dependencies (gitignored)
- `coverage/` - Test coverage reports (gitignored)

## Temporary Files
- `.vscode/` - IDE settings
- `test-results*/` - Test output directories
- `*.log` - Log files (gitignored)

## Git Workflow Files
- `.gitignore` - Files to ignore
- `.gitattributes` - Line ending configuration
- Branch structure follows feature/fix/chore pattern