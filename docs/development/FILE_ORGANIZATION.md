# SmartPack File Organization Standards

## 📁 Directory Structure

```
SmartPack/
├── docs/                       # All documentation
│   ├── development/           # Developer guides
│   ├── testing/              # Testing documentation
│   └── api/                  # API documentation
├── src/
│   ├── components/           # React components
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types
│   ├── assets/              # Static assets
│   ├── test-utils/          # Centralized test utilities
│   └── __tests__/           # All test files
├── .github/
│   ├── prompts/             # AI prompts (GitHub convention)
│   └── workflows/           # GitHub Actions
├── lambda/                  # Backend functions
├── playwright/              # E2E tests
└── tests/                   # Legacy (to be deprecated)
```

## 🎯 Configuration Standards

### Single Configuration Files

- **Use `vite.config.ts`** for both Vite and Vitest (not separate configs)
- **Use `playwright.config.ts`** for E2E testing only
- **Avoid** `vitest.config.ts`, `jest.config.js` when Vite handles testing

### Path Aliases

Always use path aliases for internal imports:

```typescript
// ✅ Preferred
import { Button } from '@components/Button';
import { useTripForm } from '@hooks/useTripForm';
import { renderWithProviders } from '@test-utils';

// ❌ Avoid
import { Button } from '../../components/Button';
import { useTripForm } from '../../../hooks/useTripForm';
```

## 🧪 Test Organization

### Centralized Test Utilities

- **Location**: `src/test-utils/`
- **Import**: `import { renderWithProviders } from '@test-utils';`
- **No deep relative paths**: Max 2 levels (`../`)

### Test File Structure

```
src/__tests__/
├── unit/                    # Component/hook unit tests
├── integration/             # Feature integration tests
└── utils/                   # Utility function tests
```

## 📝 Documentation Standards

### Unified Documentation

- **All docs** go in `docs/` directory
- **Development guides** in `docs/development/`
- **Testing docs** in `docs/testing/` (consolidated comprehensive testing guide)
- **API docs** in `docs/api/`
- **AI prompts** in `.github/prompts/` (GitHub convention)

### Documentation Types

- **ARCHITECTURE.md**: System design and component relationships
- **ONBOARDING.md**: Developer setup and getting started
- **TESTING_GUIDE.md**: Comprehensive testing documentation (consolidated)
- **TEST_UTILITIES.md**: Testing utility documentation
- **OLLAMA_SETUP.md**: AI integration setup guide
- **OLLAMA_IMPLEMENTATION.md**: AI implementation details
- **HEROICONS_IMPLEMENTATION.md**: UI icon implementation guide
- **TROUBLESHOOTING.md**: Common issues and solutions

## 🚀 Lambda Functions

### Server Consolidation

- **Use TypeScript**: `app.ts` + `server.ts` pattern
- **Avoid duplication**: One server per environment, not per feature
- **Environment-based switching**: Use env vars instead of separate files

## 🔍 Import Conventions

### Import Order

1. External libraries
2. Internal utilities (with aliases)
3. Relative imports (max 2 levels)

```typescript
// External
import React from 'react';
import { render } from '@testing-library/react';

// Internal with aliases
import { TripForm } from '@components/TripForm';
import { useTripForm } from '@hooks/useTripForm';

// Relative (limited)
import './Component.css';
```

## ⚙️ Enforcement

### ESLint Rules

```javascript
rules: {
  'import/no-relative-parent-imports': 'error',
  'import/order': ['error', { 'newlines-between': 'always' }]
}
```

### Pre-commit Hooks

- Validate file organization
- Check import patterns
- Enforce documentation standards

## 🎯 Benefits

1. **Simplified Imports**: `@test-utils` vs `../../../tests/testing-utils`
2. **Consistent Structure**: Always know where to find things
3. **Easier Maintenance**: Less duplication, centralized utilities
4. **Better DX**: Faster navigation, clearer organization
5. **Standards Compliance**: Modern React/TypeScript practices

## 8. Enforcement & Automation

### ESLint Configuration

The project includes ESLint rules to enforce import standards:

```bash
# Install required dependencies (if not already installed)
npm install --save-dev eslint-plugin-import eslint-import-resolver-typescript
```

**Configured Rules:**

- `import/order`: Enforces consistent import ordering
- `import/no-relative-parent-imports`: Prevents `../` imports
- `import/no-useless-path-segments`: Removes unnecessary path segments

**Usage:**

```bash
npm run lint         # Check for violations
npm run lint:fix     # Auto-fix violations where possible
```

### VSCode Settings

Add to `.vscode/settings.json` for better TypeScript path support:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "typescript.suggest.paths": true
}
```

---

**Last Updated**: January 2025  
**Applies To**: SmartPack v2024/2025
