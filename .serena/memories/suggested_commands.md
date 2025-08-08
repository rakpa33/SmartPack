# SmartPack Development Commands

## Essential Development Commands

### Quick Start
```bash
# Navigate to project directory
cd SmartPack\SmartPack

# Install dependencies
npm install

# Start both frontend and backend servers (recommended)
npm run dev:all

# Or start servers individually:
npm run dev          # Frontend only (localhost:5173)
npm run lambda:dev   # Backend only (localhost:3000)
```

### Testing Commands
```bash
# Run all tests
npm test

# Test watching mode
npm run test:watch

# Coverage report
npm run test:coverage

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests with Playwright
npm run test:e2e
npm run test:e2e:ui      # With UI
npm run test:e2e:headed  # In browser

# Run specific test file
npm test -- --run ComponentName.test.tsx
```

### Code Quality
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Format with Prettier (manual - no npm script)
npx prettier --write .
```

### Build & Production
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Start backend server
npm run lambda:dev

# Test Ollama connection
npm run ollama:test

# Build Lambda function
npm run lambda:build

# Deploy to AWS (requires setup)
npm run lambda:deploy
```

### Utility Commands
```bash
# Clean up hanging Node processes (Windows)
npm run cleanup
npm run cleanup:verbose

# Install/update Playwright browsers
npm run playwright:install
npm run playwright:update
```

## Windows-Specific Commands

### Process Management
```bash
# Check for Node processes
tasklist | find "node.exe"

# Kill all Node processes
taskkill /F /IM node.exe

# PowerShell alternative
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Git Commands
```bash
# Configure line endings for Windows
git config core.autocrlf input

# Common git operations
git status
git add .
git commit -m "message"
git push
git pull
```

### Directory Navigation
```bash
# Navigate to project
cd C:\Users\Rachel\Desktop\SmartPack\SmartPack

# List directory contents
dir
# or PowerShell
ls
```

## Development Workflow

### Standard Development Flow
1. `npm run dev:all` - Start both servers
2. Make changes to code
3. `npm run lint:fix` - Fix linting issues
4. `npm run type-check` - Verify TypeScript
5. `npm test -- --run affected.test.tsx` - Test changes
6. `git add . && git commit -m "message"` - Commit

### Before Committing
```bash
npm run lint
npm run type-check
npm test
npm run build
```

### Debugging Issues
```bash
# Clear Node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear browser storage (in DevTools Console)
localStorage.clear()

# Restart Ollama service
# Check if running: curl http://localhost:11434
# Restart if needed
```

## Environment Setup

### Required Services
```bash
# Ollama AI service (must be running)
ollama serve
ollama pull llama3.1:8b

# Verify Ollama is running
curl http://localhost:11434
```

### Port Usage
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Ollama: http://localhost:11434