# Fix Issue Template

**Diagnose and Fix Issue: <ISSUE_DESCRIPTION>**

Systematically diagnose, resolve, and prevent application issues using root cause analysis and SmartPack architecture expertise.

## 1. Issue Analysis and Context Gathering

- Document the specific issue symptoms, error messages, and unexpected behaviors
- Analyze provided screenshots, error logs, stack traces, or user descriptions
- Determine issue scope: runtime errors, development/build issues, performance problems, or UI/UX issues
- Identify when the issue first occurred and any recent changes that might be related
- Review `copilotdocs/DEVLOG.md` for recent significant changes that could impact the issue
- Assess issue severity and impact on user experience and application functionality

## 2. SmartPack Architecture Context Analysis

- Review how the issue relates to SmartPack's React + TypeScript + Vite + Tailwind CSS + Headless UI stack
- Assess impact on AWS Lambda (Express/Node) + Ollama AI integration if backend-related
- Check weather API integration using Open-Meteo if data-related issues
- Evaluate localStorage persistence patterns and single-user data integrity
- Reference `copilotdocs/ARCHITECTURE.md` for component relationships and data flow that might be affected
- Consider mobile-first responsive design implications and cross-device compatibility

## 3. Root Cause Analysis and Investigation

- **For Runtime/Application Errors:**

  - Trace error origins through component hierarchy and data flow
  - Analyze state management issues and React lifecycle problems
  - Check for memory leaks, infinite loops, or performance bottlenecks
  - Validate prop types, API responses, and data transformation logic

- **For Development/Build Issues:**

  - Check `copilotdocs/ENVIRONMENT.md` for proper development environment setup
  - Validate dependencies, versions, and configuration files
  - Review TypeScript compilation errors and module resolution issues
  - Check Vite configuration and build pipeline problems

- **For Performance Issues:**

  - Analyze component rendering patterns and unnecessary re-renders
  - Check bundle size, lazy loading implementation, and memory usage
  - Evaluate API call efficiency and caching strategies
  - Review localStorage usage patterns and data storage optimization

- **For UI/UX Issues:**
  - Check Tailwind CSS classes and responsive design implementation
  - Validate Headless UI component usage and accessibility compliance
  - Review dark mode implementation and theme consistency
  - Test mobile-first design across different screen sizes

## 4. Diagnostic Tools and Debugging Strategy

- Use React DevTools for component state and props analysis
- Implement browser debugging tools for network, performance, and console analysis
- Add temporary logging and breakpoints to trace execution flow
- Check `copilotdocs/COMMANDS.md` for available debugging and development commands
- Utilize TypeScript compiler for type checking and error detection
- Review `copilotdocs/TROUBLESHOOTING.md` for known issues and established solutions

## 5. Solution Implementation and Testing

- Apply targeted fixes based on root cause analysis findings
- Ensure solutions maintain SmartPack architecture principles and patterns
- Test fixes across different scenarios: mobile/desktop, different data states, edge cases
- Validate that localStorage data integrity is maintained
- Ensure accessibility and responsive design standards are preserved
- **Follow Testing Protocol**: Reference `.github/prompts/testing-protocol.prompt.md` for systematic test execution
- **Validate Incrementally**: Test changes step-by-step rather than batch testing

## 6. Comprehensive Test Coverage Enhancement

### **Test Execution Best Practices**

Before running any tests, follow the established protocol:

1. **Pre-Test Checklist:**

   - Check for hanging Node processes: `tasklist | find "node.exe"`
   - Kill if needed: `taskkill /F /IM node.exe`
   - Verify build: `npm run build`
   - Check lint: `npm run lint`

2. **Targeted Testing Strategy:**

   ```bash
   # For component changes
   npm test -- --run ComponentName.test.tsx

   # For API/service changes
   npm test -- --run src/__tests__/services/

   # For state management changes
   npm test -- --run src/__tests__/useTripForm.test.tsx
   ```

3. **Test Monitoring Protocol:**
   - Unit tests should complete <5 seconds
   - Integration tests should complete <30 seconds
   - Watch for "queued" status lasting >30 seconds (indicates hanging)
   - Always read full error messages and stack traces
   - Categorize failures: NEW (must fix), PRE-EXISTING (document), ENVIRONMENTAL (fix setup)

### **Test Coverage Enhancement**

- **Unit Tests (Vitest + React Testing Library):**

  - Add or update tests in `src/__tests__/` to cover the specific issue scenario
  - Test component behavior, state management, and prop handling that caused the issue
  - Include edge cases and error conditions that led to the problem
  - Validate fix effectiveness with targeted test cases

- **Integration Tests:**

  - Create tests for component interactions and data flow that were problematic
  - Test API integrations and localStorage persistence patterns
  - Validate cross-component communication and state sharing
  - **WARNING**: Integration tests may hang - use timeouts and monitor completion

- **End-to-End Tests (Playwright):**
  - Add E2E tests that reproduce the original user workflow that caused the issue
  - Test complete user journeys to ensure the issue doesn't reoccur
  - Include accessibility validation with axe-core for UI-related fixes
  - Test across different devices and browsers for comprehensive coverage

### **Error Analysis Protocol**

When tests fail:

1. **Stop and Analyze** - Never proceed with hanging or failing tests without investigation
2. **Classify Errors:**
   - NEW: Related to recent changes (MUST FIX)
   - PRE-EXISTING: Document in TROUBLESHOOTING.md
   - ENVIRONMENTAL: Fix test setup
3. **Common Patterns:**
   - API expectation mismatches (case sensitivity, missing fields)
   - Component evolution (renamed functions, updated UI text)
   - Timeout/hanging issues (unresolved promises, infinite loops)

## 7. Prevention Strategy and Quality Assurance

- Update `copilotdocs/TROUBLESHOOTING.md` with new issue patterns and solutions
- Enhance development processes to catch similar issues earlier
- Implement additional TypeScript strict mode checks if type-related
- Add ESLint rules or configuration to prevent similar code patterns
- Update `copilotdocs/TESTING_GUIDELINES.md` with new testing patterns discovered
- Consider architectural improvements to prevent entire classes of similar issues

## 8. Documentation and Knowledge Sharing

- Document the issue, root cause, and solution in `copilotdocs/DEVLOG.md`
- Update `copilotdocs/ARCHITECTURE.md` if architectural patterns were involved
- Enhance code comments in affected files to explain complex logic or edge cases
- Update `copilotdocs/CHECKLIST.md` if this relates to planned features or improvements
- Create or update troubleshooting guides for future reference
- Share lessons learned and prevention strategies with the development process

## Resolution Validation Checklist

- [ ] Issue root cause clearly identified and documented
- [ ] Fix implemented following SmartPack architecture principles
- [ ] All existing tests continue to pass
- [ ] New unit tests added to cover the specific issue scenario
- [ ] Integration tests updated to prevent similar cross-component issues
- [ ] E2E tests enhanced to catch the issue in user workflows
- [ ] Accessibility and responsive design validated
- [ ] Performance impact assessed and optimized
- [ ] Documentation updated with issue details and solutions
- [ ] Prevention strategies implemented to avoid recurrence

## Escalation Guidance

**Quick Fixes:** For simple issues, implement immediate solutions with basic test coverage.

**Complex Issues:** For architectural problems, consider refactoring approaches and comprehensive test strategy updates.

**External Dependencies:** For library or framework issues, evaluate alternatives, version updates, or workarounds with thorough impact analysis.

**If Issue Persists:** Gather additional context, consider broader architectural review, or seek external expertise while documenting investigation progress.

## Usage

Use this prompt when experiencing any application issues. Provide detailed descriptions, screenshots, error messages, or logs, and Copilot will systematically diagnose the root cause, implement fixes, and establish prevention measures following SmartPack architecture principles.
