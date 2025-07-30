<!--
This file provides a comprehensive reference of all commands, scripts, and CLI operations for SmartPack development, testing, and deployment.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Central command reference for development workflow
- Testing commands for unit, integration, and E2E test suites
- AI/Ollama integration and troubleshooting commands
- Backend/serverless deployment and debugging commands
- Environment setup and dependency management
- Troubleshooting guide for common development issues

WHEN TO UPDATE:
1. NEW SCRIPTS: Package.json script additions or modifications
2. TOOL CHANGES: New testing frameworks, build tools, or CLI utilities
3. DEPLOYMENT UPDATES: New deployment targets, environment configurations
4. AI INTEGRATION: Ollama model updates, API endpoint changes
5. TROUBLESHOOTING: New common issues and their resolution commands
6. ENVIRONMENT CHANGES: Node.js version updates, dependency changes

UPDATE GUIDELINES:
- Organize by logical workflow: Development → Testing → Deployment → Troubleshooting
- Include both basic and advanced usage examples for each command
- Provide context for when to use specific commands (development vs. production)
- Add curl examples for API testing with realistic payload data
- Include expected outputs or success indicators where helpful
- Cross-reference with TROUBLESHOOTING.md for complex issues

COMMAND CATEGORIES:
- **Development**: Setup, servers, build processes
- **Testing**: Unit, integration, E2E, coverage, debugging
- **AI Integration**: Ollama setup, model management, API testing
- **Backend**: Lambda development, serverless deployment
- **Troubleshooting**: Common issues, port conflicts, dependency problems

MAINTENANCE NOTES:
- Verify commands actually work before documenting them
- Update version numbers and compatibility requirements when dependencies change
- Remove deprecated commands and mark legacy approaches clearly
- Keep troubleshooting section current with recently discovered issues
- Reference specific file paths and configuration for context

HOW TO USE FOR AI ASSISTANCE:
- Reference this document before suggesting commands to ensure accuracy
- Use established patterns for new command documentation
- Check troubleshooting section before proposing solutions to common issues
- Validate that suggested commands align with current project setup and dependencies
-->

# COMMANDS for SmartPack

Keep this file up-to-date with all frequently used command line prompts and scripts relevant to development, testing, and deployment.

## Development

### Installation & Setup

- **Install dependencies**: `npm install --legacy-peer-deps`
- **Verify Node version**: `node --version` (should be v20.14.0+)
- **Check npm version**: `npm --version` (should be 10.7.0+)

### Development Servers

- **Start backend with AI**: `npm run lambda:dev`
- **Start frontend**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`

## Ollama AI Integration

### Ollama Setup

- **Install Ollama**: Download from https://ollama.ai/
- **Pull AI model**: `ollama pull llama3.1:8b`
- **Start Ollama service**: `ollama serve`
- **List available models**: `ollama list`
- **Test AI directly**: `ollama run llama3.1:8b "test prompt"`

### AI Integration Testing

- **Test AI connection**: `curl http://localhost:11434/api/version`
- **Test backend health**: `curl http://localhost:3000/health`
- **Test AI checklist generation**:
  ```bash
  curl -X POST http://localhost:3000/generate \
    -H "Content-Type: application/json" \
    -d '{"trip":{"name":"Test","startDate":"2024-01-15","endDate":"2024-01-18","destinations":["Tokyo"],"travelModes":["walking"],"tripDetails":"test"},"weather":[{"location":"Tokyo","temperature":15,"conditions":"clear","precipitation":0}]}'
  ```
- **Test AI suggestions**:
  ```bash
  curl -X POST http://localhost:3000/suggestions \
    -H "Content-Type: application-json" \
    -d '{"customPrompt":"What to pack for photography?","trip":{"name":"Test","startDate":"2024-01-15","endDate":"2024-01-18","destinations":["Tokyo"],"travelModes":["walking"],"tripDetails":"test"},"weather":[{"location":"Tokyo","temperature":15,"conditions":"clear","precipitation":0}]}'
  ```

### Category Optimization Testing

- **Test category naming fix**: `node test-category-fix.js`
- **Test enhanced categories**: `node test-enhanced-categories.js`
- **Validate concise categories**: Categories should be like "Photography", "Winter", "Business" (not verbose phrases)
- **Category testing scenarios**:
  - Business trip: Should generate "Business", "Documents", "Electronics"
  - Photography trip: Should generate "Photography", "Electronics", "Winter" (if cold)
  - Beach vacation: Should generate "Beach", "Swimming", "Sun Protection"

## Testing

### Test Execution Best Practices

#### **Jest-Axe Accessibility Testing Pattern (Updated 2025-07-29)**

**Problem:** Jest-axe `expect.extend({ toHaveNoViolations })` causes type conflicts with Vitest

**Solution:** Use inline accessibility validation:

```typescript
import { axe } from 'jest-axe';

// Use this pattern instead of expect.extend()
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};

// In tests:
await expectNoA11yViolations(document.body);
```

**Status:** Applied to all component tests for TypeScript compatibility

#### **Safe Testing Protocol**

- **Check for hanging processes first**: `tasklist | find "node.exe"` (Windows) or `ps aux | grep node` (macOS/Linux)
- **Kill hanging processes if needed**: `taskkill /F /IM node.exe` (Windows) or `pkill node` (macOS/Linux)
- **Start with build verification**: `npm run build` (ensures no compilation errors)

#### **Recommended Testing Commands**

**Quick Development Testing (Preferred):**

```bash
# Unit tests only - Fast feedback
npm test -- --run src/__tests__/unit

# Specific component test
npm test -- --run ComponentName.test.tsx

# Build check (no hanging risk)
npm run build

# ESLint check (no hanging risk)
npm run lint
```

**Targeted Integration Testing:**

```bash
# Single integration test with timeout
npm test -- --run --timeout=30000 src/__tests__/integration/specific-test.tsx

# Integration tests with verbose output and timeout
npm test -- --run --reporter=verbose --timeout=30000 src/__tests__/integration
```

**Full Test Suite (Use with Caution):**

```bash
# Full suite with timeout protection
npm test -- --run --reporter=verbose --timeout=30000

# With coverage (longer execution time)
npm test -- --run --coverage --timeout=30000
```

#### **Test Monitoring Protocol**

1. **Watch for Completion**: Tests should show clear completion status ("X passed | Y failed")
2. **Timeout Limits**: Unit tests <5 seconds, Integration tests <30 seconds
3. **Hanging Indicators**: "queued" status lasting >30 seconds indicates a problem
4. **Error Analysis**: Always read full error messages and stack traces before proceeding

#### **Test Debugging Commands**

```bash
# Verbose output for debugging
npm test -- --run --reporter=verbose ComponentName.test.tsx

# Debug specific test with detailed output
npm test -- --run --reporter=verbose --timeout=10000 failing-test.tsx

# Check test file syntax before running
npx tsc --noEmit src/__tests__/specific-test.tsx
```

### Enhanced AI Testing

- **Run all tests**: `npm test` or `npx vitest run`
- **Run with coverage**: `npm test -- --coverage`
- **Run specific test file**: `npx vitest run <filepath>`
- **Watch mode**: `npm test -- --watch` (Note: use `--run` for CI/final verification)

### Enhanced AI Testing

- **Unit tests**: `npx vitest run src/__tests__/services/enhancedAI.unit.test.ts`
- **Integration tests**: `npx vitest run src/__tests__/integration/enhancedAI.integration.test.tsx`
- **E2E tests**: `npx playwright test src/__tests__/e2e/enhancedAI.e2e.test.ts`
- **Complete AI test suite**: `npx vitest run src/__tests__/**/*enhancedAI*`

### Legacy Testing

- **Run E2E tests**: `npx playwright test`
- **Run accessibility (axe) tests**: `npx vitest run src/__tests__/*.a11y.test.tsx`
- **Run TripForm state tests**: `npx vitest run src/__tests__/useTripForm.test.tsx`
- **Component tests**: `npx vitest run src/__tests__/components/`

### Test Development

- **Update snapshots**: `npm test -- --update-snapshots`
- **Debug failing tests**: `npm test -- --reporter=verbose`
- **Test coverage report**: `npm test -- --coverage --reporter=html`

## Backend/Serverless

### Enhanced AI Backend

- **Start enhanced AI backend**: `npm run lambda:dev`
- **Test backend health**: `curl http://localhost:3000/health` or visit in browser
- **Test AI generation**: `curl -X POST http://localhost:3000/generate -H "Content-Type: application/json" -d '{"trip":{"name":"Test","startDate":"2025-08-01","endDate":"2025-08-04","destinations":["Paris"],"travelModes":["plane"]},"weather":[{"location":"Paris","temperature":20,"conditions":"Clear","precipitation":0}]}'`
- **Check AI logs**: Monitor console output from `npm run lambda:dev` for debugging

### Deployment

- **Deploy backend to AWS Lambda**: `npx serverless deploy`
- **Environment configuration**: Update API URLs in `src/services/apiService.ts` for production

### Backend Development

- **Enhanced AI file**: `lambda/app.ts` (main intelligent backend)
- **Development file**: `lambda/server.js` (local development server)
- **Backend port**: 3000 (ensure no conflicts with other services)

## Troubleshooting

### Enhanced AI Issues

- **"Failed to get AI suggestions"**: Ensure backend is running with `npm run lambda:dev`
- **Repetitive suggestions**: Enhanced AI system now provides context-aware, intelligent recommendations
- **Backend connectivity**: Test with `fetch('http://localhost:3000/health')` in browser console
- **API errors**: Check backend console for detailed error messages and stack traces

### Port Configuration

- **Frontend**: http://localhost:5173 (Vite development server)
- **Backend**: http://localhost:3000 (Enhanced AI Lambda server)
- **Port conflicts**: Use `netstat -ano | findstr :3000` to check for conflicts

### Testing Issues

- **Test hanging**: Use `npm test -- --run` instead of watch mode for final verification
- **E2E test failures**: Ensure both frontend and backend are running during E2E tests
- **Coverage reports**: Check test coverage with `npm test -- --coverage`
- **Mock issues**: Clear test mocks with `vi.clearAllMocks()` in beforeEach blocks

### Development Environment

- **Node.js version**: Ensure compatible Node.js version (check package.json engines)
- **Dependency issues**: Run `npm ci` for clean dependency installation
- **TypeScript errors**: Run `npm run type-check` for TypeScript validation
- **Build issues**: Clear build cache with `rm -rf dist && npm run build`

## Other

- (Add any other project-specific commands here)

---

**Note:**

- Update this file whenever you add, remove, or change a commonly used command or script.
- Reference this file in onboarding, instructions, and prompts to ensure all contributors and AI agents use the correct commands.
