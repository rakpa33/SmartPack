# Test Standards Prompt for SmartPack

## Context

When creating, modifying, or reviewing tests in the SmartPack project, always follow these 2024/2025 industry standards.

## File Naming Standards

- Component tests: `ComponentName.test.tsx` (co-located)
- Utility tests: `functionName.test.ts` (co-located)
- Integration tests: `featureName.integration.test.ts` (in `__tests__/integration/`)
- E2E tests: `userJourney.e2e.test.ts` (in `playwright/`)

## Required Imports & Setup

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);
```

## Test Structure Template

```tsx
describe('ComponentName', () => {
  function renderComponent(props = {}) {
    const user = userEvent.setup();
    render(<ComponentName {...props} />);
    return { user };
  }

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('when rendering', () => {
    it('should display required elements', () => {
      renderComponent();
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('should be accessible', async () => {
      const { container } = render(<ComponentName />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('when user interacts', () => {
    it('should handle user input', async () => {
      const { user } = renderComponent();

      await user.type(screen.getByRole('textbox', { name: /input/i }), 'test');
      expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });
  });
});
```

## Required Patterns

1. **Always use `screen` API** - Never destructure render
2. **Use userEvent** - Never use fireEvent for user interactions
3. **Include accessibility test** - Every component needs axe testing
4. **Proper async handling** - Use findBy\* and waitFor correctly
5. **Jest-DOM matchers** - Use toBeDisabled(), toHaveValue(), etc.

## Query Priority (in order)

1. `getByRole()` - Preferred for semantic elements
2. `getByLabelText()` - Form inputs
3. `getByText()` - Content verification
4. `getByTestId()` - Last resort only

## Anti-Patterns to Avoid

- ❌ `const { getByRole } = render()` - Use screen instead
- ❌ `expect(button.disabled).toBe(true)` - Use toBeDisabled()
- ❌ `fireEvent.click()` - Use user.click()
- ❌ `act(() => render())` - Unnecessary wrapping
- ❌ `await waitFor(() => {})` - Empty callbacks
- ❌ Separate `.accessibility.test.tsx` files - Integrate into main tests

## Context/Provider Testing

```tsx
import { renderWithProviders } from '../../tests/test-utils';

// Use project's standard test utility for provider-dependent components
renderWithProviders(<Component />, {
  initialTripState: { tripName: 'Test' },
});
```

## Quick Checklist

- [ ] File named correctly (.test.tsx/.test.ts)
- [ ] Uses screen API throughout
- [ ] Uses userEvent for interactions
- [ ] Includes accessibility test
- [ ] Proper describe/it structure
- [ ] Jest-DOM matchers used
- [ ] No anti-patterns present
- [ ] Tests user behavior, not implementation

## Reference

See `copilotdocs/TESTING_STANDARDS.md` for complete guidelines and examples.
