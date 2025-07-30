<!--
This file defines testing standards and conventions for SmartPack development.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Establish 2024/2025 industry-standard testing practices
- Define testing philosophy and core principles
- Provide reference patterns and anti-patterns
- Ensure consistency across testing implementations
- Document framework-specific best practices
-->

# SmartPack Testing Standards (2024/2025)

## Overview

This document establishes the testing standards for SmartPack based on current industry best practices as of July 2025. All new tests must follow these standards, and existing tests should be migrated during refactoring.

## 🎯 **Core Principles**

### Testing Philosophy

- **Test user-visible behavior** over implementation details
- **Write tests that resemble how users interact** with the application
- **Prefer integration tests** over isolated unit tests where practical
- **Ensure accessibility compliance** in all UI tests

### Sources & Authority

- [Vitest Official Guide](https://vitest.dev/guide/) - Current v3.x standards
- [React Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [Kent C. Dodds - Common Mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) (2024)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) (2024)

## 📁 **File Naming & Organization**

### ✅ **Correct Naming Conventions**

```
src/
  components/
    TripForm.tsx
    TripForm.test.tsx                    # Unit/component tests
  utils/
    validation.ts
    validation.test.ts                   # Utility function tests
  __tests__/
    integration/
      user-journey.integration.test.ts   # Integration tests
    e2e/
      critical-path.e2e.test.ts          # E2E tests (if not using Playwright directory)
```

### ❌ **Avoid These Patterns**

```
❌ TripForm.next.single.click.test.tsx     # Overly descriptive
❌ TripFormValidation.unit.test.ts         # Redundant .unit suffix
❌ MainLayout.a11y.test.tsx               # Separate accessibility files
❌ localStorage.persistence.test.tsx       # Overly descriptive
```

### **File Extension Rules**

- `.test.ts` - Pure TypeScript/JavaScript logic tests
- `.test.tsx` - React component tests
- `.integration.test.ts` - Cross-component integration tests
- `.e2e.test.ts` - End-to-end user journey tests

## 🏗️ **Test Structure & Organization**

### ✅ **Standard Test Structure**

```tsx
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ComponentName } from './ComponentName';

expect.extend(toHaveNoViolations);

describe('ComponentName', () => {
  // Setup helpers
  function renderComponent(props = {}) {
    const user = userEvent.setup();
    render(<ComponentName {...props} />);
    return { user };
  }

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
    it('should handle form submission', async () => {
      const { user } = renderComponent();

      await user.type(
        screen.getByRole('textbox', { name: /name/i }),
        'Test Value'
      );
      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

### **Describe Block Conventions**

- `describe('ComponentName', () => {})` - Main component block
- `describe('when [condition]', () => {})` - Behavioral grouping
- `describe('given [state]', () => {})` - State-based grouping

### **Test Case Naming**

- `it('should [expected behavior]', () => {})` - Behavioral expectation
- Use present tense, active voice
- Be specific about the expected outcome

## 🔍 **Query & Assertion Standards**

### ✅ **Use screen API (Required)**

```tsx
// ✅ Correct
render(<Component />);
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();

// ❌ Avoid
const { getByRole } = render(<Component />);
expect(getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

### **Query Priority Order**

1. `getByRole()` - Preferred for interactive elements
2. `getByLabelText()` - Form inputs
3. `getByPlaceholderText()` - When label isn't available
4. `getByText()` - For content verification
5. `getByDisplayValue()` - Form inputs with values
6. `getByAltText()` - Images
7. `getByTitle()` - Last resort
8. `getByTestId()` - Only when semantic queries fail

### ✅ **Use Jest-DOM Matchers**

```tsx
// ✅ Correct - Descriptive error messages
expect(button).toBeDisabled();
expect(input).toHaveValue('expected value');
expect(element).toBeVisible();

// ❌ Avoid - Poor error messages
expect(button.disabled).toBe(true);
expect(input.value).toBe('expected value');
expect(element.style.display).not.toBe('none');
```

### **Query Variants Usage**

- `get*` - Element must exist (throws if not found)
- `query*` - Only for asserting non-existence (`toBeNull()`)
- `find*` - For async elements (awaited)

## 🎭 **User Interaction Standards**

### ✅ **Use @testing-library/user-event (Required)**

```tsx
import userEvent from '@testing-library/user-event';

const { user } = renderComponent();

// ✅ Correct - Simulates real user behavior
await user.type(input, 'hello world');
await user.click(button);
await user.selectOptions(select, 'option1');

// ❌ Avoid - Low-level events
fireEvent.change(input, { target: { value: 'hello world' } });
fireEvent.click(button);
```

## 🧪 **Test Categories & When to Use**

### **Unit Tests** (`ComponentName.test.tsx`)

- **Purpose**: Test individual component behavior
- **Scope**: Single component, mocked dependencies
- **Location**: Co-located with component
- **Example**: Form validation, button states, conditional rendering

### **Integration Tests** (`__tests__/integration/`)

- **Purpose**: Test component interactions and data flow
- **Scope**: Multiple components, real context providers
- **Location**: `src/__tests__/integration/`
- **Example**: Form submission workflow, context state updates

### **E2E Tests** (`playwright/`)

- **Purpose**: Test complete user journeys
- **Scope**: Full application, real backend/APIs
- **Location**: `playwright/` directory
- **Example**: Complete trip planning flow, data persistence

## 🏢 **Context & Provider Testing**

### ✅ **Standard Provider Setup**

```tsx
// tests/test-utils.tsx
export function renderWithProviders(
  ui: ReactElement,
  options: {
    initialTripState?: Partial<TripFormState>;
    initialPackingState?: Partial<PackingListState>;
  } = {}
) {
  const AllProviders = ({ children }: { children: ReactNode }) => (
    <TripFormProvider initialState={options.initialTripState}>
      <PackingListProvider initialState={options.initialPackingState}>
        <MemoryRouter>{children}</MemoryRouter>
      </PackingListProvider>
    </TripFormProvider>
  );

  return render(ui, { wrapper: AllProviders, ...options });
}
```

## ♿ **Accessibility Testing Standards**

### ✅ **Integrated Accessibility Tests**

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Include in every component test
it('should be accessible', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### **Accessibility Test Requirements**

- Every component test must include accessibility verification
- Use semantic HTML and ARIA attributes testing
- Test keyboard navigation where applicable
- Verify color contrast in visual regression tests

## ⚡ **Async Testing Standards**

### ✅ **Proper Async Handling**

```tsx
// ✅ Correct - Use findBy* for async elements
expect(await screen.findByText(/loading complete/i)).toBeInTheDocument();

// ✅ Correct - Use waitFor for state changes
await waitFor(() => {
  expect(screen.getByText(/error message/i)).toBeInTheDocument();
});

// ❌ Avoid - Empty waitFor callbacks
await waitFor(() => {});
expect(someAssertion).toBeTruthy();
```

### **waitFor Guidelines**

- One assertion per `waitFor` callback
- No side effects inside `waitFor`
- Use `findBy*` when possible instead of `waitFor(() => getBy*)`

## 🧹 **Test Cleanup & Setup**

### ✅ **Standard Setup Pattern**

```tsx
describe('ComponentName', () => {
  beforeEach(() => {
    // Clear localStorage to prevent test contamination
    localStorage.clear();

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup is automatic with @testing-library/react
    // Only add custom cleanup if needed
  });
});
```

## 🎯 **Mocking Standards**

### ✅ **Strategic Mocking**

```tsx
// ✅ Mock external dependencies
vi.mock('../services/api', () => ({
  fetchData: vi.fn().mockResolvedValue(mockData),
}));

// ✅ Mock complex hooks for unit tests
vi.mock('../hooks/useComplexHook', () => ({
  useComplexHook: vi.fn(() => ({ data: mockData, loading: false })),
}));

// ❌ Avoid over-mocking internal logic
// Let real implementations run for integration tests
```

## 📊 **Performance & CI Standards**

### **Test Performance**

- Keep test suites under 30 seconds for unit tests
- Use `vi.useFakeTimers()` for time-dependent tests
- Minimize DOM queries by reusing elements
- Use `screen.debug()` sparingly in CI

### **CI Configuration**

```javascript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    mockReset: true,
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['playwright/**', '**/*.e2e.*'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.*', '**/*.spec.*'],
    },
  },
});
```

## 🔄 **Migration Guidelines**

### **Priority Order for Refactoring**

1. **High Priority**: Tests with anti-patterns affecting reliability
2. **Medium Priority**: Naming convention violations
3. **Low Priority**: Style and consistency improvements

### **Migration Checklist**

- [ ] Update file naming to standard conventions
- [ ] Convert to `screen` API usage
- [ ] Add accessibility testing
- [ ] Use `@testing-library/user-event` instead of `fireEvent`
- [ ] Implement proper async testing patterns
- [ ] Add proper TypeScript types

## 🚫 **Common Anti-Patterns to Avoid**

### **Query Anti-Patterns**

```tsx
// ❌ Don't destructure render
const { getByRole } = render(<Component />);

// ❌ Don't use container queries
const { container } = render(<Component />);
const button = container.querySelector('.btn');

// ❌ Don't use manual assertions
expect(button.disabled).toBe(true);

// ❌ Don't use query* for existence checks
expect(screen.queryByRole('alert')).toBeInTheDocument();
```

### **Async Anti-Patterns**

```tsx
// ❌ Don't use act() unnecessarily
act(() => {
  render(<Component />);
});

// ❌ Don't use empty waitFor
await waitFor(() => {});

// ❌ Don't put side effects in waitFor
await waitFor(() => {
  fireEvent.click(button);
  expect(element).toBeVisible();
});
```

## 📋 **Quick Reference Checklist**

### **Every Test Should Have:**

- [ ] Descriptive test name starting with "should"
- [ ] Proper describe block organization
- [ ] `screen` API usage
- [ ] Jest-DOM matchers
- [ ] User-event for interactions
- [ ] Accessibility verification
- [ ] Proper async handling
- [ ] Clean setup/teardown

### **Avoid in Tests:**

- [ ] Implementation details testing
- [ ] Overly specific test IDs
- [ ] Manual DOM manipulation
- [ ] Synchronous assertions for async behavior
- [ ] Multiple assertions in waitFor
- [ ] Hardcoded delays or timeouts

---

## 📚 **Additional Resources**

- [SmartPack Testing Guidelines](./TESTING_GUIDELINES.md) - Project-specific helpers
- [Testing Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro)
- [Vitest API Reference](https://vitest.dev/api/)
- [Jest-DOM Matchers](https://github.com/testing-library/jest-dom#custom-matchers)

**Last Updated**: July 29, 2025
**Next Review**: January 2026 (or when major framework updates occur)
