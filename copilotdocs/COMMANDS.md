<!--
This file lists all frequently used commands and scripts for SmartPack development, testing, and deployment.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Add or update commands whenever you add, remove, or change scripts, workflows, or dev/test/deploy steps. Review after adding new tools or scripts.
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

### Test Execution

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
