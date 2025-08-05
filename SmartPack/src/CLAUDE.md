# SmartPack Source Directory Navigation

**⚠️ NAVIGATION GUIDE - DO NOT DELETE**  
This file is a critical navigation aid that reduces token usage and improves agent efficiency.  
It provides quick directory structure understanding without deep exploration.  
**Purpose**: Directory inventory, file locations, architectural overview  
**Status**: Protected file per `.claude/agents/smartpack-integrity-auditor.md`

## Directory Purpose
The `src/` directory contains the complete React application source code, organized by feature and functionality rather than technical file type.

## Key Files in This Directory

### Main Application Files
- `App.tsx` - Root application component with routing and global providers
- `AppWithProvider.tsx` - Application wrapper with context providers
- `AppHeader.tsx` - Main navigation header component
- `main.tsx` - React application entry point and DOM mounting
- `index.css` - Global CSS styles and Tailwind imports

### Configuration Files
- `vite-env.d.ts` - Vite environment type definitions
- `declarations.d.ts` - Custom TypeScript declarations for imports
- `env.d.ts` - Environment variable type definitions

## Directory Structure

### `/components/` - React Components
UI components organized by functionality:
- Layout components (MainLayout, BottomNavigation)
- Form components (TripDetails, TripDetailsEditForm)
- List components (PackingList, ChecklistItem)
- Panel components (SuggestionsPanel, TripWeatherPanel)
- Utility components (DarkModeToggle, DragHandle)

### `/hooks/` - Custom React Hooks
Business logic and state management hooks:
- Context providers (TripFormContext, PackingListContext)
- Data hooks (useTripForm, usePackingList, useWeather)
- UI hooks (useColumnLayout, useResizable, useHapticFeedback)
- Service hooks (useGeocode, usePerformance)

### `/utils/` - Utility Functions
Pure functions and helper utilities:
- Validation (tripFormValidation.ts, validation.ts)
- Data processing (categoryUtils.ts, itemQuantities.ts)
- API helpers (geocode.ts, weather.ts, weatherIcons.ts)

### `/types/` - TypeScript Definitions
Type definitions and interfaces:
- Core types (index.ts, tripForm.ts)
- Layout types (ColumnLayout.ts)
- Mock types (express-mock.d.ts, serverless-http.d.ts)

### `/services/` - API Services
External service integrations:
- `apiService.ts` - Main API client for Ollama and weather services
- `apiService.test.ts` - API service unit tests

### `/pages/` - Page Components
Route-level components:
- `TestFrameworks.tsx` - Testing framework demonstration page

### `/assets/` - Static Assets
Static files and resources:
- `react.svg` - React logo for development

### `/__tests__/` - Test Files
Comprehensive test suite:
- Unit tests for components and hooks
- Integration tests for workflows
- Accessibility tests with jest-axe
- Mock data and test utilities

### `/test-utils/` - Shared Testing Utilities
Centralized testing helpers:
- `index.ts` - Main test utility exports
- `mock-utils.ts` - Mock data generators
- `render-utils.tsx` - Custom render functions with providers

### `/test/` - Test Configuration
Test setup and configuration:
- `setup.ts` - Vitest global test setup
- `jest-dom.d.ts` - Jest DOM type definitions

## Development Patterns

### Component Organization
- Each component has corresponding test files
- Complex components split into sub-components
- Accessibility tests included for all interactive components

### Hook Organization
- Context providers separate from hook implementations
- Custom hooks encapsulate complex business logic
- Performance hooks for optimization features

### Type Organization
- Types organized by domain/feature
- Interfaces preferred over type aliases
- Strict TypeScript mode enabled

## Quick Navigation Tips

### Finding Components
```bash
# List all components
ls src/components/

# Find specific component tests
ls src/__tests__/*ComponentName*
```

### Finding Hooks
```bash
# List all hooks
ls src/hooks/

# Find hook usage in components
grep -r "useHookName" src/components/
```

### Finding Types
```bash
# List all type definitions
ls src/types/

# Find interface usage
grep -r "InterfaceName" src/
```

## Agent Usage Guidelines

### When Working in src/
1. **Always check existing patterns** before creating new files
2. **Follow the established directory structure** for consistency
3. **Add tests for any new components or hooks** you create
4. **Update type definitions** when adding new data structures
5. **Run `npm run type-check` frequently** to catch TypeScript errors early

### Common Tasks
- **Adding Components**: Place in `/components/`, add tests in `/__tests__/`
- **Creating Hooks**: Place in `/hooks/`, test in `/__tests__/`
- **Adding Utilities**: Place in `/utils/`, test in `/__tests__/utils/`
- **Updating Types**: Edit files in `/types/`, verify usage across codebase

### Testing Strategy
- **Component tests**: Focus on user interactions and accessibility
- **Hook tests**: Test state changes and side effects
- **Integration tests**: Test component composition and workflows
- **Unit tests**: Test pure functions and utilities