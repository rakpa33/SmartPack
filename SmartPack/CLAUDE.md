# SmartPack - Claude Development Context

## Project Overview

SmartPack is a mobile-first, single-user travel packing application that provides AI-powered packing recommendations based on trip details and weather forecasts. Built with React + TypeScript + Vite + Tailwind CSS + Headless UI, featuring local AI integration via Ollama and localStorage persistence.

## Development Context

**Working Directory**: Always work from `SmartPack/SmartPack`
```bash
cd SmartPack\SmartPack
```

**Prerequisites**:
- Node.js 18+ (LTS version)
- npm package manager
- Ollama service (for AI functionality)
- Modern browser with ES2020+ support
- Git with proper line ending configuration (see below)

**Git Configuration for Windows**:
```bash
# Set Git to preserve LF in repository
git config core.autocrlf input

# Ensure .gitattributes exists for consistent line endings
# Project includes .gitattributes with LF enforcement
```

## Development Workflow Standards

- **Check CHECKLIST.md** for current step and completion status
- **Update DEVLOG.md** with significant changes (ALWAYS add entries at TOP, never append)
- **Reference ROADMAP.md** for feature priorities and development phases
- **Follow testing protocols** in TESTING_GUIDELINES.md
- **Use TROUBLESHOOTING.md** for known issues and solutions

## Quick Start Commands

### Development Servers
```bash
# Frontend development server
npm run dev              # → localhost:5173

# Backend development server  
npm run lambda:dev       # → localhost:3000

# Both servers concurrently
npm run dev:all         # Recommended for full development
```

### Testing
```bash
# Unit and integration tests
npm run test            # Vitest run
npm run test:watch      # Vitest watch mode
npm run test:coverage   # Coverage report
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests

# E2E testing
npm run test:e2e        # Playwright tests
npm run test:e2e:ui     # Playwright with UI

# Targeted testing (recommended for focused work)
npm test -- --run ComponentName.test.tsx
```

### Backend Development
```bash
# Backend development
npm run lambda:dev      # Start backend server
npm run lambda:test     # Test backend functions
npm run lambda:build    # Build Lambda function
```

### Code Quality
```bash
# Linting and type checking
npm run lint            # ESLint check
npm run lint:fix        # ESLint with auto-fix
npm run type-check      # TypeScript check

# Build verification
npm run build           # Production build
```

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript (strict mode) + Vite
- **Styling**: Tailwind CSS utilities + Headless UI components
- **State Management**: Context providers + custom hooks pattern
- **Testing**: Vitest + React Testing Library + Playwright + Jest-axe
- **Backend**: Express.js on AWS Lambda + Ollama AI client
- **Storage**: Browser localStorage (no external database)
- **AI**: Local Ollama instance running llama3.1:8b model

### Key Components
- **TripForm**: Multi-step trip planning with real-time validation
- **MainLayout**: Three-column responsive layout system
- **PackingList**: Dynamic checklist with CRUD operations
- **SuggestionsPanel**: AI-powered recommendation interface
- **TripDetails**: Trip information display with inline editing
- **TripWeatherPanel**: Weather data visualization

### File Organization
```
src/
├── components/          # React components
├── hooks/              # Custom hooks (usePackingList, useTripForm, etc.)
├── utils/              # Helper functions and validation
├── types/              # TypeScript interfaces
├── services/           # API services (Ollama, weather)
├── __tests__/          # Test files (co-located)
└── test-utils/         # Shared testing utilities
```

**Path Aliases**: Use @components/, @hooks/, @utils/, @types/, @assets/, @pages/
**Organization Pattern**: Organize by domain/feature, not technical type
**Documentation Structure**: docs/ with development/, testing/, api/ subdirectories

## Development Patterns

### Component Standards
- **Functional components only** with TypeScript strict mode
- **Props interfaces** defined explicitly for each component
- **Mobile-first responsive design** with Tailwind utilities
- **Accessibility-first** with WCAG 2.1 AA compliance
- **Real-time validation** with 750ms debounced feedback

### TypeScript Standards
- **Strict mode enabled** (no implicit any types)
- **Proper type definitions** for all props and functions
- **Use interfaces** for object types
- **Comprehensive type coverage** for all components

### React Patterns
- **Functional components with hooks** (no class components)
- **Custom hooks for shared logic** (business logic extraction)
- **React.memo for expensive components** (performance optimization)
- **Proper error boundaries** (graceful error handling)

### State Management
- **Context providers** for global state (TripFormContext, PackingListContext)
- **Custom hooks** for complex logic (useTripForm, usePackingList, useWeather)
- **localStorage persistence** for all user data
- **No external state management libraries** (keep it simple)
- **Optimistic updates** with error handling and rollback

### Testing Approach
- **Unit tests**: Business logic and component behavior (React Testing Library)
- **Integration tests**: Component interactions and workflows
- **E2E tests**: Complete user journeys (Playwright)
- **Accessibility tests**: jest-axe integration with all components
- **Target 80%+ coverage** with meaningful test cases

## Quality Standards

### Accessibility (WCAG 2.1 AA)
- **44px minimum touch targets** for mobile
- **4.5:1 color contrast ratio** minimum (3:1 for UI components)
- **Keyboard navigation support** for all interactive elements
- **Screen reader compatibility** with proper ARIA labels
- **Focus management and visual indicators** for navigation
- **Automated testing** with jest-axe (0 critical issues tolerance)

### Performance Requirements
- **Largest Contentful Paint (LCP) ≤ 2.5s** at 75th percentile
- **Bundle optimization** with code splitting and tree shaking
- **Mobile-first optimization** with progressive enhancement
- **React.memo for expensive renders** (performance optimization)
- **Lazy loading for route components** (bundle size management)
- **Debounced inputs** for search/validation (750ms)
- **Optimized bundle size** with tree shaking

### Security & Privacy
- **Local-only data storage** (no cloud sync)
- **No third-party analytics** or tracking
- **Input sanitization** on client and server
- **Content Security Policy** headers

## UI/UX Standards

### Design System
- **Heroicons for all icons** (no emojis in UI)
- **Mobile-first responsive design** with progressive enhancement
- **3-column desktop layout**: Trip Details | Packing List | AI Suggestions
- **Dark mode support required** for all components
- **Consistent spacing** using Tailwind scale

### Component Patterns
- **Card-style selections** with proper interactive states
- **Button hierarchy**: Primary (blue-50), Secondary (white), Utility (gray-50)
- **Form patterns** with debounced validation (750ms)
- **Loading states and error handling** for all async operations
- **Visual hierarchy** with proper typography scale

### Testing Standards

#### Test Organization
- **Unit tests**: src/__tests__/
- **Integration tests**: src/__tests__/integration/
- **E2E tests**: playwright/
- **Test utilities**: src/test-utils/ (centralized)

#### Quality Gates
- **All new features require comprehensive tests**
- **Accessibility validation** with axe-core
- **Mobile and desktop viewport testing**
- **Error boundary and edge case coverage**
- **LocalStorage persistence testing**

## AI Integration

### Ollama Service
- **Local instance required**: localhost:11434
- **Model**: llama3.1:8b (8-billion parameter)
- **Fallback behavior**: Mock data when AI unavailable
- **Context-aware prompts**: Trip details + weather + user preferences

### Setup Commands
```bash
# Install and run Ollama (see OLLAMA_SETUP.md for details)
ollama pull llama3.1:8b
ollama serve
```

## Common Workflows

### Adding New Components
1. Create component in `src/components/`
2. Add TypeScript interface for props
3. Implement with Tailwind CSS utilities
4. Add accessibility attributes (ARIA, semantic HTML)
5. Create test file with RTL and jest-axe
6. Update related context/hooks if needed

### Debugging Issues
1. Check `docs/development/TROUBLESHOOTING.md` for known issues
2. Run `npm run lint` and `npm run type-check`
3. Test with `npm test -- --run AffectedComponent.test.tsx`
4. Check browser console and network tab
5. Verify Ollama service status if AI-related

### Making API Changes
1. Update Express routes in `lambda/app.ts`
2. Modify API service in `src/services/apiService.ts`
3. Update TypeScript interfaces in `src/types/`
4. Add integration tests
5. Test both success and error scenarios

## Documentation References

### Primary Documentation
- **ARCHITECTURE.md**: Comprehensive system architecture (arc42 template)
- **DEVLOG.md**: Chronological development history (newest entries at top)
- **TROUBLESHOOTING.md**: Problem resolution tracking
- **ROADMAP.md**: Development phases and milestones

### Testing Documentation
- **TESTING_GUIDE.md**: Testing strategies and standards
- **TESTING_STANDARDS.md**: Quality requirements and implementation

### UX/UI Documentation
- **UX_UI_DESIGN_SYSTEM.md**: Design patterns and component standards
- **UX_UI_ASSESSMENT_GUIDE.md**: Quality assurance guidelines

## Documentation Maintenance

### Documentation Standards
- **DEVLOG.md**: Reverse chronological order (newest entries at TOP)
- **CHECKLIST.md**: Mirror ROADMAP.md structure, track completion
- **TROUBLESHOOTING.md**: Symptom → Root Cause → Solution → Prevention
- **ARCHITECTURE.md**: Follow arc42 template, update ADRs for decisions

## Error Handling & Debugging

### Common Issues
- **Ollama connection failed**: Check service status, restart if needed
- **localStorage quota exceeded**: Implement data cleanup strategies
- **TypeScript errors**: Run `npm run type-check` for detailed diagnostics
- **Test failures**: Check terminal output, categorize as NEW/PRE-EXISTING/ENVIRONMENTAL
- **Hanging Node.js processes**: Always check before testing
- **Build failures**: Clear node_modules, npm install

### Recovery Procedures
- **TypeScript errors**: Check tsconfig and dependency versions
- **Test hanging**: Kill processes, restart environment, use unit tests
- **Build failures**: Clear node_modules, npm install --legacy-peer-deps
- **Integration issues**: Check API endpoints and service connectivity

### Debugging Commands
```bash
# Check for hanging processes
tasklist | find "node.exe"

# Kill hanging processes (Windows)
taskkill /F /IM node.exe

# Restart development servers
# Ctrl+C to stop, then npm run dev:all

# Clear browser storage (if localStorage issues)
# Developer Tools → Application → Storage → Clear Storage

# Use targeted testing for quick validation
npm test -- --run ComponentName.test.tsx
```

### Error Analysis Protocol
- **Categorize failures**: NEW (recent changes) / PRE-EXISTING (known issues) / ENVIRONMENTAL (setup)
- **Check TROUBLESHOOTING.md** for specific error patterns and solutions
- **Document new issues** with Symptom → Root Cause → Solution → Prevention

## Development Best Practices

### Code Quality
- **TypeScript strict mode**: No implicit any allowed
- **ESLint + Prettier**: Auto-format on save enabled
- **Consistent patterns**: Follow existing component structure
- **Documentation**: Update DEVLOG.md for significant changes

### Testing Strategy
- **Write tests first** for new features when possible
- **Test user workflows**, not implementation details
- **Include accessibility tests** for all interactive components
- **Prefer targeted testing** over full test suite for speed

### Performance
- **Mobile-first development**: Test on mobile devices regularly
- **Bundle analysis**: Monitor build output for size increases
- **Lazy loading**: Implement for non-critical components
- **Optimistic UI updates**: Immediate feedback with error handling

## AI Assistant Guidelines

When working with Claude on this project:

1. **Reference documentation first**: Check ARCHITECTURE.md, DEVLOG.md, and TROUBLESHOOTING.md
2. **Follow established patterns**: Maintain consistency with existing components
3. **Test thoroughly**: Run targeted tests and verify output
4. **Document changes**: Update DEVLOG.md with technical context
5. **Accessibility focus**: Ensure WCAG 2.1 AA compliance
6. **Mobile-first**: Test responsive design at different breakpoints

## Recent Development Context

Check `docs/development/DEVLOG.md` for the most recent development history, including:
- Recent bug fixes and solutions
- Feature implementations
- Testing improvements
- Performance optimizations
- Technical decisions and their rationale

**Always add new DEVLOG entries at the top** to maintain reverse chronological order.