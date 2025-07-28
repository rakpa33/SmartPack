<!--
Prompt command for Copilot/AI:

When - **Assertion Messages:** Custom assertion messages should be concise and explain the intent, e.g., `expect(x).toBe(y) /* explains why */`. Use a consistent, descriptive style.
- **Test Review:** PRs that make major changes to test structure/utilities must be reviewed by a designated "test lead" or equivalent.
- **Test Audit:** The quarterly "test hygiene" audit must be tracked in GitHub Projects and use a dedicated issue template for documentation.

---

## 2. Integration Testing Best Practices

### Handling Navigation and Async UI Updates

When testing navigation between components (e.g., TripForm → MainLayout):

1. **Use proper query methods:**
   - Use `findByTestId` instead of `waitFor` + `getByTestId` for elements that appear asynchronously
   - Use `findBy*` queries over `waitFor` + `getBy*` for async elements
   - Use data-testid attributes for reliable element selection

2. **Configure waitFor properly:**
   ```tsx
   await waitFor(
     () => {
       expect(screen.queryByTestId('element-id')).not.toBeInTheDocument();
     },
     {
       timeout: 5000,  // Increase timeout for slower transitions
       onTimeout: (error) => {
         console.error('Timeout error details:', error);
         console.log('Current DOM:', document.body.innerHTML);
         return error;
       }
     }
   );
   ```

3. **Form interaction best practices:**
   - Add explicit waits between form interactions (`await userEvent.clear/type/click`)
   - Wrap test logic in try/catch for better error messages
   - Verify input values after typing with console.log
   - Tab out after typing to trigger blur events (important for geocoding)
   - Use proper element type casting (e.g., `as HTMLInputElement`)

4. **Test setup and environment:**
   - Initialize localStorage with mock data in `beforeEach` for consistent test behavior
   - Mock browser APIs like console.error to filter irrelevant warnings
   - Add cleanup in the return function of `beforeEach`

5. **Debugging techniques:**
   - Add strategic console.log statements at critical points
   - Log the entire DOM at key transitions
   - Log specific element states before assertions
   - Use more descriptive test names that explain the expected behavior

### React Testing Library Query Priority

Follow this order for element queries (best to worst):
1. `getByRole` / `findByRole` (with name option)
2. `getByLabelText` (for form controls)
3. `getByText` (for non-interactive elements)
4. `getByTestId` (when semantic queries aren't possible)

Avoid using:
- `container.querySelector` (breaks accessibility testing)
- `queryBy*` variants except for checking non-existence

--- "run tests":
- Run unit tests (using the appropriate npm scripts).
- Keep running the last test and automatically fix errors until all tests pass.
- If all unit tests pass, run integration tests (using the appropriate npm scripts).
- Keep running the last test and automatically fix errors until all tests pass.
- IF all integration tests pass, run e2e tests (using the appropriate npm scripts).
-->

# SmartPack Testing Cheatsheet

A quick reference for creating, organizing, and running tests in SmartPack. Applies to Vitest + React Testing Library, Supertest, and Playwright.

---

## 0. Testing Protocol & Best Practices

- When a test fails, always validate the behavior live in the app (via `npm run dev`) before assuming the test is incorrect.
- Cross-check test and implementation against external best practices (React Testing Library, accessibility, E2E patterns, etc.).
- Only update or relax tests if the live UI matches the intended acceptance criteria and best practices.
- Checklist features (add, check, uncheck, remove, persist) are fully covered by E2E/integration tests.

---

## 1. Test Types & Tools

| Layer           | Purpose                                | Tools/Notes                            |
| --------------- | -------------------------------------- | -------------------------------------- |
| **Unit**        | Test a single function/component       | Vitest, React Testing Library (RTL)    |
| **Integration** | Test collaboration of multiple units   | Supertest, nock/msw, in-process server |
| **E2E**         | Simulate real user flows (browser→API) | Playwright                             |

---

## 1a. Additional Standards & Clarifications

- **Integration/E2E Placement:** All Supertest and Playwright tests should live in `__tests__/api/` and `__tests__/e2e/` respectively. Colocation with source code is not allowed for these layers.
- **Factories & Utilities:** All factory functions and test utilities (e.g., `renderWithProviders`) must be imported from `tests/factories/` and `tests/testing-utils.tsx`. Local helpers within test files are allowed only for one-off, file-specific logic; reusable helpers must be promoted and documented.
- **Accessibility Checks:** For page-level components, at least one axe-core check is required per component (not per test file). Additional checks are encouraged for complex flows.
- **Coverage Enforcement:** The 80% threshold is enforced globally and per-PR. PRs should not drop coverage below 80% for any file touched, unless explicitly approved.
- **Test Data Consistency:** Factories should generate valid, production-like data by default. Edge-case/minimal data is allowed for negative/edge-case tests, but must be clearly documented in the test.
- **Skipped/Quarantined Tests:** Skipped tests must be reviewed during the quarterly audit and re-enabled or removed as appropriate. All skips must reference a GitHub issue ID.
- **E2E Canonical Journeys:** Any new critical user journey must be added to `__tests__/e2e/README.md` via PR and reviewed by at least one test lead.
- **Assertion Messages:** Custom assertion messages should be concise and explain the intent, e.g., `expect(x).toBe(y) /* explains why */`. Use a consistent, descriptive style.
- **Test Review:** PRs that make major changes to test structure/utilities must be reviewed by a designated "test lead" or equivalent.
- **Test Audit:** The quarterly “test hygiene” audit must be tracked in GitHub Projects and use a dedicated issue template for documentation.

---

## 2. General Principles

- **Test Pyramid:** Many unit, some integration, few E2E.
- **AAA Pattern:** Arrange → Act → Assert.
- **Isolation:** No network/time dependencies in unit tests.
- **Descriptive Names:** One logical assertion per test.
- **Fail Fast:** Run unit/integration on every push; E2E on PR/nightly.
- **Naming:** Name test files with `.test.ts(x)` or `.spec.ts(x)` suffixes.
- **Test Location:**
  - Unit tests should be placed in `src/__tests__/` directory
  - Integration tests belong in `src/__tests__/integration/`
  - E2E tests belong in the `playwright/` directory
- **Test Data:** Use fixtures or factories for test data. Mock external services (APIs, network calls) using MSW, nock, or vi.mock.
- **Accessibility:** Prefer accessible queries and check for a11y issues in UI tests.

---

## 3. Unit Test Best Practices (Vitest + RTL)

- Use `describe` blocks per component or util.
- Mock fetches with `vi.mock` or `msw`.
- Prefer RTL queries (`getByRole`, `findByText`).
- Use `data-testid` for critical elements that need reliable selection in tests.
- Keep tests under 100 ms each.
- Keep tests colocated with the code they test when possible.
- For components that use context, ensure the test provides the necessary context wrapper.
- For asynchronous operations, use appropriate waiting mechanisms with reasonable timeouts.

**Example:**

```ts
import { render, screen, waitFor } from '@testing-library/react';
import { TripFormProvider } from '../hooks/TripFormContext';
import TripForm from './TripForm';

describe('TripForm', () => {
  it('prefills default dates', () => {
    render(
      <TripFormProvider>
        <TripForm />
      </TripFormProvider>
    );
    expect(screen.getByLabelText(/start date/i)).toHaveValue(/*…*/);
  });

  it('displays weather data after submission', async () => {
    render(
      <TripFormProvider>
        <TripForm />
      </TripFormProvider>
    );
    // Fill and submit form...

    await waitFor(
      () => {
        const weatherElement = screen.getByTestId('weather-display');
        expect(weatherElement).toBeInTheDocument();
      },
      { timeout: 3000 }
    ); // Use appropriate timeout
  });
});
```

---

## 4. Integration Test Best Practices (Supertest)

- Spin up app with `app.listen()` or in-process serverless wrapper.
- Stub LLM/weather calls with `nock` or `msw-node`.
- Use `beforeEach/afterEach` to reset mocks.
- Test auth headers and error cases.
- Place integration tests in `__tests__/integration` or similar.

**Example:**

```ts
import request from 'supertest';
import app from '../app';

describe('/generate route', () => {
  it('returns 200 and list JSON', async () => {
    const res = await request(app)
      .post('/generate')
      .send({ prompt: 'test' })
      .expect(200);
    expect(res.body.items.length).toBeGreaterThan(0);
  });
});
```

---

## 5. E2E Test Best Practices (Playwright)

- Keep under 5–10 critical user journeys. List and review these regularly.
- Use test IDs or ARIA roles for selectors.
- Run headless in CI, headed locally.
- Record videos only on failure.
- Clear localStorage and reset state between specs.
- Place E2E tests in `__tests__/e2e` or similar.
- **Critical user journeys must include:**
  - Form completion flows that involve API calls (like geocoding)
  - Validation flows that depend on transformed data
  - Multi-step processes where state changes across screens

**Example:**

```ts
test('user completes trip wizard with geocoded city', async ({ page }) => {
  await page.goto(process.env.APP_URL);
  await page.getByRole('textbox', { name: /name/i }).fill('Alice');
  // Type a simple city name and ensure it gets geocoded properly
  await page.getByTestId('destination-input-0').fill('paris');
  await page.getByTestId('destination-input-0').blur();
  // Verify the geocoded format appears
  await expect(page.getByTestId('destination-input-0')).toHaveValue(
    /Paris.*France/
  );
  // Continue flow and verify navigation succeeds
  await page.getByText('Next').click();
  await expect(page.getByText('Packing Checklist')).toBeVisible();
});
```

---

## 6. Running Tests in CI

- **Unit:** `npm run test:unit` (Vitest)
- **Integration:** `npm run test:int` (Supertest)
- **E2E:** `npm run test:e2e` (Playwright)
- Run unit/integration on every push; E2E on PRs or nightly.
- Fail builds on test or lint errors.

**GitHub Actions Example:**

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:int
      - run: npm run test:e2e
```

---

## 7. Coverage & Quality Gates

- Vitest coverage (`--coverage`) ≥ 80% lines/branches. Exceptions must be documented.
- Lint: `eslint . --max-warnings=0` on every PR.
- Review and update tests regularly; remove obsolete tests.
- Fail CI if thresholds not met.

---

## 8. Debugging & Maintenance

- Reproduce failures locally with `--watch` before debugging.
- Use clear assertion messages.
- Check mocks (did you override?).
- Isolate: comment out unrelated tests.
- Document tricky bugs/fixes in `DEVLOG.md`.
- Remove or update flaky/obsolete tests as needed.

---

## 9. Bottom Line

- Fast, focused unit tests catch most regressions.
- Selective integration tests ensure routes/services work together.
- Lean E2E tests prove the happy path in production-like conditions.
- Automate everything in CI, use clear fail messages, and log major issues in `DEVLOG.md`.
- Prioritize accessibility and maintainability in all tests.

---

## localStorage and State Management in Tests

**Critical for SmartPack:** Components depend heavily on localStorage for state persistence.

1. **Comprehensive cleanup in beforeEach:**

   ```tsx
   beforeEach(() => {
     // Clear ALL localStorage - critical for preventing test contamination
     window.localStorage.clear();

     // Explicitly remove known keys for extra safety
     window.localStorage.removeItem('tripForm');
     window.localStorage.removeItem('smartpack_checklist');
     window.localStorage.removeItem('smartpack_categories');
     window.localStorage.removeItem('theme');
   });
   ```

2. **Set up required state before component initialization:**

   ```tsx
   beforeEach(() => {
     // Set up trip form data for MainLayout tests (required for conditional rendering)
     const tripData = {
       tripName: 'Test Trip',
       destinations: ['Paris'],
       travelModes: ['Car'],
       preferences: ['No special needs'],
       startDate: '2025-08-01',
       endDate: '2025-08-10',
       step: 2, // Critical: MainLayout only renders when step === 2
     };
     window.localStorage.setItem('tripForm', JSON.stringify(tripData));
   });
   ```

3. **Understanding component conditional rendering:**
   - `TripForm`: Automatically navigates to `/MainLayout` when `state.step === 2`
   - `MainLayout`: Only renders content when `state.step >= 2`, otherwise shows loading
   - **Test Impact**: Set up proper state before rendering to avoid unexpected behavior

### Direct Route Testing vs Full Navigation

**Prefer targeted testing over complex navigation flows:**

```tsx
// ❌ Complex - requires full form flow
render(
  <MemoryRouter initialEntries={['/']}>
    <App />
  </MemoryRouter>
);
await fillOutComplexForm(); // Flaky, hard to debug

// ✅ Direct - test specific functionality
render(
  <MemoryRouter initialEntries={['/MainLayout']}>
    <App />
  </MemoryRouter>
);
// Component renders immediately with proper localStorage setup
```

**When to use each approach:**

- **Direct Route Testing**: For testing specific page/component functionality
- **Full Navigation Testing**: For critical user journey validation (fewer tests, more comprehensive)

### Async Element Handling Best Practices

**Updated patterns based on SmartPack findings:**

```tsx
// ❌ Unreliable
const element = await waitFor(() => screen.getByTestId('element'));

// ✅ More reliable for async elements
const element = await screen.findByTestId('element', {}, { timeout: 5000 });

// ✅ Best for checking element removal
await waitFor(
  () => {
    expect(screen.queryByText('Item')).not.toBeInTheDocument();
  },
  { timeout: 2000 }
);

// ❌ Problematic - requires element to exist first
await waitForElementToBeRemoved(() => screen.queryByText('Item'));
```
