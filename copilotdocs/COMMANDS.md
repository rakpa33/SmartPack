# COMMANDS for SmartPack

Keep this file up-to-date with all frequently used command line prompts and scripts relevant to development, testing, and deployment.

## Development
- Start development server: `npm run dev`
- Build for production: `npm run build`
- Lint code: `npm run lint`

## Testing
- Run unit/integration/accessibility tests: `npx vitest run`
- Run E2E tests: `npx playwright test`
- Run accessibility (axe) tests: `npx vitest run src/__tests__/*.a11y.test.tsx`

## Backend/Serverless
- Deploy backend to AWS Lambda: `npx serverless deploy`

## Other
- (Add any other project-specific commands here)

---

**Note:**
- Update this file whenever you add, remove, or change a commonly used command or script.
- Reference this file in onboarding, instructions, and prompts to ensure all contributors and AI agents use the correct commands.
