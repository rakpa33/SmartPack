<!--
This file provides quick reference for SmartPack test utilities and helper functions.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Quick start guide for test utilities
- Centralized test helper function reference
- Mock patterns and common testing scenarios
- Integration with @test-utils path alias
-->

# SmartPack Test Utilities

## Quick Start

```tsx
import { renderWithProviders } from '@test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Standard component test
const user = userEvent.setup();
renderWithProviders(<Component />);
await user.click(screen.getByRole('button', { name: /submit/i }));
```

## 📋 **Testing Standards**

**IMPORTANT**: Always follow the current standards in `TESTING_STANDARDS.md` and `TESTING_GUIDE.md`

## 🔧 **Available Utilities**

### Accessibility Testing with Jest-Axe

**Vitest-Compatible Pattern** (Resolved 2025-07-29):

```tsx
import { axe } from 'jest-axe';

// Use this pattern instead of expect.extend({ toHaveNoViolations })
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};

// In your tests:
test('should be accessible', async () => {
  renderWithProviders(<Component />);
  await expectNoA11yViolations(document.body);
});
```

**Why This Pattern:**

- ✅ Full TypeScript compatibility with Vitest
- ✅ Same accessibility validation as jest-axe
- ✅ Clear error messages showing specific violations
- ✅ Avoids MatcherFunction vs RawMatcherFn type conflicts

**Implementation Status:** Applied to all component tests (TripForm, TripDetails, SuggestionsPanel, MainLayout, integration tests)

### `renderWithProviders(ui, options)`

Renders components with all necessary providers (TripForm, PackingList, Router).

```tsx
import { renderWithProviders } from '@test-utils';

// Basic usage
renderWithProviders(<Component />);

// With initial state
renderWithProviders(<Component />, {
  initialEntries: ['/specific-route'],
  tripState: { tripName: 'Test Trip' },
});
```

### Test Data Factories

Located in `src/test-utils/` - use for consistent test data generation.

```tsx
import { createMockTrip, createMockWeather } from '@test-utils';

const mockTrip = createMockTrip({
  name: 'Paris Adventure',
  destinations: ['Paris, France'],
  startDate: '2025-06-01',
  endDate: '2025-06-07',
});
```

## 🚨 **Migration Status**

This project uses modern 2024/2025 testing standards:

- ✅ **Path Aliases**: Use `@test-utils`, `@components` instead of relative paths
- ✅ **Centralized Utilities**: All test helpers in `src/test-utils/`
- ✅ **Modern Patterns**: Vitest + React Testing Library + Playwright
- ✅ **Type Safety**: Full TypeScript support in all test files

## 📍 **File Locations**

- **Test Utilities**: `src/test-utils/` (use path alias `@test-utils`)
- **Unit Tests**: `src/__tests__/unit/`
- **Integration Tests**: `src/__tests__/integration/`
- **E2E Tests**: `playwright/`
- **Documentation**: `docs/testing/`

## 🔗 **Related Documentation**

- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing documentation
- [TESTING_STANDARDS.md](./TESTING_STANDARDS.md) - Testing standards and patterns
- [FILE_ORGANIZATION.md](../development/FILE_ORGANIZATION.md) - Project file structure

---

**Note**: This replaces the legacy `tests/README.md` file with modern path alias patterns.
