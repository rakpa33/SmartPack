<!--
This file logs major changes, troubleshooting, and development notes for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Add a new dated entry for each major change, bugfix, or troubleshooting session. Review after every sprint, release, or significant refactor.
-->

# DEVLOG for SmartPack

## 2025-07-27

### Integration Test Navigation Assertion Fix

- **Problem:** Integration tests for navigation to `/MainLayout` failed when asserting on `window.location.pathname` in MemoryRouter tests, even though the app worked in the browser.
- **Root Cause:** React Router's MemoryRouter does not update `window.location.pathname` in tests. Navigation is managed in-memory.
- **Solution:** Updated all integration tests to assert on UI elements unique to the route (e.g., "Packing Checklist", "Trip Details", "AI Suggestions") instead of `window.location.pathname`.
- **References:**
  - [Kent C. Dodds: Testing React Router](https://kentcdodds.com/blog/testing-react-router)
  - [React Router Testing Docs](https://reactrouter.com/en/main/guides/testing)
  - See TROUBLESHOOTING.md for details and best practices.

### TripForm, Context, and Integration Test Troubleshooting (Double-Click Issue)

- **Problem:** Packing Checklist only appears after clicking Next twice in integration tests and manual testing.
- **Root Cause:** Context/reducer state updates (multiple dispatches for each field) are asynchronous and batched. The checklist UI reads from context, which is not updated in time for the next render after a single click.
- **Research:**
  - React context/reducer is not suitable for rapidly changing form state (see Kent C. Dodds, React docs).
  - setTimeout, useEffect, and blurring do not guarantee context state is up-to-date for navigation.
  - Best practice: Use local useState for all form fields, sync to context only on submit or blur.
  - If context must be updated, batch all field updates into a single dispatch (e.g., SET_FORM_STATE) before navigation.
- **Actions Taken:**
  - Refactored TripForm to use local useState for all fields.
  - Added step inference for validation.
  - Still observed double-click issue due to multiple context dispatches.
  - Next: Refactor to use a single SET_FORM_STATE dispatch before navigation.
- **Best Practices Identified:**
  - Use local state for form fields, context for persistence/navigation only.
  - Batch context updates for atomic state changes.
  - Always clear localStorage before each test to avoid state pollution.
  - Use async queries and avoid relying on synchronous state after dispatch.
  - Document all troubleshooting and research in copilotdocs to avoid regressions.
- **References:**
  - [React Docs: Forms](https://react.dev/reference/react/useState#controlling-an-input-with-a-state-variable)
  - [Kent C. Dodds: Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react)
  - See TROUBLESHOOTING.md for integration test flakiness and context issues.

## 2025-07-26

- Completed all deliverables for Phase 2 Step 3: Main Layout & Responsive Design.
- Implemented mobile-first, responsive 3-column layout with Tailwind.
- Added global navigation/header and dark mode toggle (Tailwind dark variant).
- Added placeholder content and Headless UI modal for layout testing.
- Created and used MainLayout.tsx, DarkModeToggle.tsx, AppHeader.tsx.
- Updated App.tsx to use new layout and header.
- Added and validated unit, integration, accessibility (axe/jest-axe), and E2E (Playwright) tests.
- Separated Playwright E2E tests from unit/integration tests and updated Playwright config for correct test discovery.
- Improved color contrast and accessibility for both light and dark mode.
- Updated CHECKLIST.md to reflect all completed items for this phase.
- Added TripForm context/state hook with reducer for app-wide state
- Supports multiple destinations (dynamic list) and multiple travel modes (multi-select)
- State persists to localStorage and loads on mount
- All state logic is unit tested (add, update, remove, step navigation, persistence)
- Updated checklist for Phase 2 Step 4 to reflect new requirements and progress

## 2025-07-24

- Fixed Tailwind CSS not applying by updating `tailwind.config.js` content array
- Documented minimatch type error fix in TROUBLESHOOTING.md
- Compared SmartPack and packing-app for type error diagnosis
- Updated troubleshooting steps to recommend installing minimatch
- Completed and validated all items in Phase 1 Step 2 of the project checklist

## [2025-07-24] TypeScript minimatch type error troubleshooting

- Encountered persistent error: `Cannot find type definition file for 'minimatch'`.
- Steps attempted:
  - Verified all local and workspace tsconfig files for 'types' arrays (none found).
  - Added package.json override for @types/minimatch to 5.1.2 and reinstalled.
  - Deleted node_modules and lockfiles, reinstalled dependencies.
  - Checked for global @types/minimatch (none found).
  - Searched for global/user tsconfig.json files (none found).
  - Disabled all non-essential VS Code extensions and checked settings (no effect).
  - Restarted TypeScript server and editor.
  - Opened project in a clean environment/editor (recommended if error persists).
  - Installing minimatch as a direct dependency resolved the error.
- See TROUBLESHOOTING.md for full checklist and solutions.
