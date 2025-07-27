<!--
This file documents common issues, solutions, and debugging tips for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Add a new entry whenever you encounter, fix, or learn about a new issue or solution. Review after major bugfixes or dependency changes.
-->

# Troubleshooting Guide for SmartPack

Document common issues and their solutions here. Update this file as you encounter new problems.

## Common Issues

### TripForm state not persisting or updating

- **Symptom:** Trip details form state does not persist across reloads, or updates are not reflected in the UI.
- **Solution:**
  - Ensure the TripFormProvider is wrapping your app or relevant component tree.
  - Check that localStorage is available and not blocked by browser settings.
  - Verify that the reducer and dispatch actions are used correctly in the form logic.

### Playwright E2E tests fail due to test runner conflicts

- **Symptom:** Playwright E2E tests fail with errors like `expect is not defined`, or try to run unit/integration tests.
- **Solution:** Ensure Playwright E2E tests are in a separate folder (e.g., `playwright/`) and not mixed with unit/integration tests. Update `playwright.config.ts` to only include E2E tests.

### Ollama not running

- **Symptom:** AI suggestions fail or timeout.
- **Solution:** Ensure Ollama is installed and running locally. See project README or onboarding for setup.

### AWS CLI authentication error

- **Symptom:** Lambda deploys or S3 uploads fail.
- **Solution:** Run `aws configure` and check your credentials/profile.

### Playwright test fails on Windows

- **Symptom:** E2E tests fail with OS-specific errors.
- **Solution:** Check Playwright docs for Windows setup. Try `npx playwright install`.

### Tailwind or Vite build errors

- **Symptom:** Frontend fails to build or hot reload.
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again.

### TypeScript: Cannot find type definition file for 'minimatch'

- **Symptom:** TypeScript error: `Cannot find type definition file for 'minimatch'` at the top of your project files.
- **Solutions:**
  1. Ensure no `"types": ["minimatch"]` entry exists in any `tsconfig*.json` file (including global/user-level configs).
  2. Add the following to your `package.json` to force a compatible version:
     ```json
     "overrides": {
       "@types/minimatch": "5.1.2"
     }
     ```
  3. Delete `node_modules` and all lockfiles, then run `npm install` again.
  4. Restart your editor/IDE and the TypeScript server.
  5. Check for global `@types/minimatch` with `npm ls -g @types/minimatch` and uninstall if found.
  6. Search for global/user-level `tsconfig.json` files and remove any `types` array referencing `minimatch`.
  7. Disable all non-essential editor extensions and check for workspace `.vscode/settings.json` overrides.
  8. Try a different editor or machine to rule out local config issues.
  9. **If all else fails, install minimatch as a direct dependency:**
     ```bash
     npm install minimatch
     ```
     This resolved the error in some cases, even if minimatch was not directly required in code.
- **Reference:** See [strapi/strapi#23906](https://github.com/strapi/strapi/pull/23906) for upstream fix status.

### Integration Test Flakiness: Form, Context, and LocalStorage

- **Symptom:** Integration tests for TripForm or MainLayout fail to advance steps, or UI does not update as expected after clicking Next.
- **Solutions:**

  1. **Clear localStorage before each test** to avoid state pollution from previous runs:
     ```js
     beforeEach(() => {
       localStorage.clear();
     });
     ```
  2. **Use async queries** (e.g., `await screen.findByText(...)`) to wait for UI updates after advancing steps.
  3. **Context/localStorage state not resetting:** If issues persist, consider mocking the provider or `useTripForm` hook to ensure a clean state for every test.
  4. **Avoid relying on synchronous state updates** after dispatching actions or setting touched state; always use async waits for UI assertions.
  5. **Check for per-field error display:** Errors are shown per-field, not as a summary, and do not block advancing the form.

- **Reference:** See `src/__tests__/App.integration.test.tsx` for current best practices.

### TripForm Double-Click/Context Sync Issue (2025-07-27)

- **Symptom:** Packing Checklist only appears after clicking Next twice in integration tests and manual testing.
- **Root Cause:** Multiple context dispatches for each field are batched and not reflected in context state before navigation. The checklist UI reads from context, so it sees stale data after the first click.
- **Best Practice:**
  - Use local useState for all form fields, sync to context only on submit or blur.
  - If context must be updated, batch all field updates into a single dispatch (SET_FORM_STATE) before navigation.
- **Actions:**
  - Refactored TripForm to use local state for all fields.
  - Will refactor to use a single SET_FORM_STATE dispatch before navigation to guarantee atomic context update.
- **References:**
  - [React Docs: Forms](https://react.dev/reference/react/useState#controlling-an-input-with-a-state-variable)
  - [Kent C. Dodds: Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react)

### MemoryRouter Navigation Assertion Issue in Integration Tests (2025-07-27)

- **Symptom:** Integration tests for navigation to `/MainLayout` fail when asserting on `window.location.pathname` in MemoryRouter tests, even though the app works in the browser.
- **Root Cause:** React Router's MemoryRouter does not update `window.location.pathname` in tests. Navigation is managed in-memory and not reflected in the global location object.
- **Best Practice:**
  - Do not assert on `window.location.pathname` in MemoryRouter tests.
  - Instead, assert on UI elements unique to the route (e.g., headings or sections that only appear on `/MainLayout`).
- **Actions:**
  - Updated all integration tests to assert on UI elements unique to the route instead of `window.location.pathname`.
- **References:**
  - [Kent C. Dodds: Testing React Router](https://kentcdodds.com/blog/testing-react-router)
  - [React Router Testing Docs](https://reactrouter.com/en/main/guides/testing)

## Add more issues as you encounter them!
