<!--
Prompt command for Copilot/AI:

When I say "run tests":
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
- **Naming:** Name test files with `.test.ts(x)` or `.spec.ts(x)` suffixes. Place unit tests close to code; integration/E2E in dedicated folders.
- **Test Data:** Use fixtures or factories for test data. Mock external services (APIs, network calls) using MSW, nock, or vi.mock.
- **Accessibility:** Prefer accessible queries and check for a11y issues in UI tests.

---

## 3. Unit Test Best Practices (Vitest + RTL)

- Use `describe` blocks per component or util.
- Mock fetches with `vi.mock` or `msw`.
- Prefer RTL queries (`getByRole`, `findByText`).
- Use `data-testid` only when necessary.
- Keep tests under 100 ms each.
- Keep tests colocated with the code they test when possible.

**Example:**

```ts
import { render, screen } from '@testing-library/react';
import TripForm from './TripForm';

describe('TripForm', () => {
  it('prefills default dates', () => {
    render(<TripForm />);
    expect(screen.getByLabelText(/start date/i)).toHaveValue(/*…*/);
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

**Example:**

```ts
test('user completes trip wizard', async ({ page }) => {
  await page.goto(process.env.APP_URL);
  await page.getByRole('textbox', { name: /name/i }).fill('Alice');
  // ...continue flow…
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
