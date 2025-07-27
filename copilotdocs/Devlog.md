<!--
This file logs major changes, troubleshooting, and development notes for SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

How to update: Add a new dated entry for each major change, bugfix, or troubleshooting session. Review after every sprint, release, or significant refactor.
-->

# DEVLOG for SmartPack

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
