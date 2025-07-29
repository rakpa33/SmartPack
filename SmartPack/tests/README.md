# SmartPack Test Utilities

## Quick Start

```tsx
import { renderWithProviders } from './test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Standard component test
const user = userEvent.setup();
renderWithProviders(<Component />);
await user.click(screen.getByRole('button', { name: /submit/i }));
```

## 📋 **Testing Standards**

**IMPORTANT**: Always follow the current standards in `../copilotdocs/TESTING_STANDARDS.md`

## 🔧 **Available Utilities**

### `renderWithProviders(ui, options)`

Renders components with all necessary providers (TripForm, PackingList, Router).

```tsx
import { renderWithProviders } from './test-utils';

// Basic usage
renderWithProviders(<Component />);

// With initial state
renderWithProviders(<Component />, {
  initialEntries: ['/specific-route'],
  tripState: { tripName: 'Test Trip' },
});
```

### Test Data Factories

Located in `./factories/` - use for consistent test data generation.

## 🚨 **Migration Status**

This project is currently migrating to 2024/2025 testing standards:

- ✅ **New tests**: Must follow `TESTING_STANDARDS.md`
- ⚠️ **Existing tests**: Being gradually updated
- ❌ **Legacy patterns**: Being phased out

## 🔗 **Quick Links**

- [Complete Testing Standards](../copilotdocs/TESTING_STANDARDS.md)
- [AI Assistant Reference](../.github/prompts/test-standards.prompt.md)
- [Legacy Guidelines](../copilotdocs/TESTING_GUIDELINES.md)
- [Troubleshooting](../copilotdocs/TROUBLESHOOTING.md)
