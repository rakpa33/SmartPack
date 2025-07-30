# Test Analysis and Modernization Template

**Analyze, Modernize, and Fix Tests: <TEST_FILE_OR_SUITE_DESCRIPTION>**

Systematically analyze test files for modern compliance, identify issues, and modernize testing patterns using SmartPack's 2024/2025 testing standards and architecture expertise.

## 1. IDE Static Analysis and Pre-Execution Validation

- **IDE Error Detection (Before Running Tests):**
  - Use `get_errors` tool to identify TypeScript/ESLint/static analysis errors in test files
  - Check for compilation errors, type mismatches, and import issues
  - Identify timeout configuration problems and test setup issues
  - Detect jest-axe type compatibility issues with Vitest/Testing Library
  - Validate mock imports and service dependencies
  - Check for missing test utilities or configuration problems
- **Static Analysis Categorization:**
  - **Type Errors:** Generic type mismatches, assertion type conflicts, mock type issues
  - **Import Errors:** Missing dependencies, incorrect paths, circular dependencies
  - **Configuration Errors:** Test timeout settings, environment setup, framework conflicts
  - **Tool Compatibility:** jest-axe with Vitest, Testing Library version conflicts
- **Pre-Execution Fixes:**
  - Resolve critical IDE errors that prevent test execution
  - Fix type compatibility issues with expect.extend() and jest-axe
  - Address timeout configuration and test framework setup
  - Ensure proper mock typing and import resolution

## 2. Test File Analysis and Context Gathering

- **Test File Assessment:**
  - Analyze test file structure, organization, and location within project hierarchy
  - Review test file documentation headers against established standards
  - Identify test types: unit, integration, E2E, accessibility, performance
  - Document current testing patterns: fireEvent vs userEvent, screen API usage, mocking strategies
- **Test Execution Status (After IDE Issues Resolved):**
  - Run tests and document pass/fail status with detailed error messages
  - Identify failing tests vs passing tests that may be outdated
  - Analyze test performance and execution time patterns
  - Check for flaky tests or inconsistent behavior
- **Coverage Analysis:**
  - Assess test coverage for the target component/module/feature
  - Identify coverage gaps in functions, branches, and edge cases
  - Evaluate critical user workflows that lack test coverage
  - Review accessibility testing coverage with jest-axe patterns

## 2. SmartPack Architecture and Standards Compliance

- **Architecture Alignment:**
  - Validate tests against SmartPack's React + TypeScript + Vite + Tailwind CSS + Headless UI stack
  - Check proper mocking of AWS Lambda + Ollama AI integration for relevant tests
  - Verify weather API (Open-Meteo) and geocoding service mocking patterns
  - Assess localStorage persistence testing and single-user data integrity validation
  - Reference `copilotdocs/ARCHITECTURE.md` for component relationships and data flow testing
- **2024/2025 Testing Standards Compliance:**

  - Review against `TESTING_STANDARDS.md` for modern patterns
  - Check `TESTING_CONFIGURATION.md` for proper file organization
  - Validate testing patterns: userEvent over fireEvent, screen API usage, behavioral describe blocks
  - Assess accessibility testing integration with jest-axe and type compatibility
  - Verify mobile-first responsive testing patterns
  - Check Vitest-specific configurations and jest-axe type extensions

- **File Organization Standards:**
  - Validate test file location: `src/__tests__/`, `playwright/`, proper subdirectories
  - Check import paths and dependencies alignment
  - Verify proper test file naming conventions
  - Assess page object model usage for E2E tests

## 3. Test Quality and Pattern Analysis

- **Modern Testing Patterns:**
  - **Component Tests:** Check renderWithProviders usage, proper context setup, accessibility validation
  - **Integration Tests:** Validate realistic user workflows, proper service mocking, state management testing
  - **E2E Tests:** Review page object models, cross-browser compatibility, user journey completeness
  - **Service Tests:** Assess API mocking, error handling, data transformation testing
- **Anti-Pattern Detection:**
  - Identify deprecated fireEvent usage (should be userEvent)
  - Check for getByTestId overuse (prefer accessible queries)
  - Find missing accessibility testing (jest-axe integration)
  - Detect improper mocking patterns or external dependency issues
  - **IDE-Specific Issues:** jest-axe type conflicts with Vitest, timeout configuration problems
  - **Integration Test Issues:** Form interaction hangs, navigation failures, element finding problems
- **Documentation Standards:**
  - Validate test file headers with PURPOSE, SCOPE, DEPENDENCIES, MAINTENANCE, TESTING PATTERNS
  - Check for clear test descriptions and behavioral organization
  - Assess inline documentation and code comments for complex logic

## 4. SmartPack-Specific Testing Validation

- **Component Integration:**
  - Validate TripForm, MainLayout, DarkModeToggle testing patterns
  - Check proper context provider testing (TripFormContext, PackingListContext)
  - Assess responsive design testing across mobile/desktop breakpoints
  - Verify dark mode and theme switching test coverage
- **Service Layer Testing:**
  - Validate API service mocking for generatePackingList, checkApiHealth
  - Check weather service and geocoding utility test coverage
  - Assess localStorage persistence and data migration testing
  - Verify error handling and network failure scenarios
- **AI Integration Testing:**
  - Check proper mocking of AI service calls and responses
  - Validate context-aware recommendation testing (business, beach, adventure trips)
  - Assess weather data integration with AI suggestions
  - Verify trip duration and quantity calculation testing

## 5. Decision Framework: Update vs Fix

- **Update Test Scenarios (Desired Behavior Changed):**
  - Component API or props have changed intentionally
  - New features require additional test scenarios
  - UI/UX improvements change expected user interactions
  - Architecture changes affect component relationships
- **Fix Code/Test Scenarios (Behavior Should Stay Same):**
  - Tests fail due to regressions in implementation
  - Anti-patterns in test code (outdated testing library usage)
  - Missing dependencies or configuration issues
  - Accessibility regressions or missing a11y validation
- **Modernization Scenarios (Always Apply):**
  - Upgrade from fireEvent to userEvent
  - Add missing accessibility testing with jest-axe
  - Implement proper page object models for E2E tests
  - Add comprehensive documentation headers
  - Update file organization to current standards

## 6. Analysis and Recommendation Generation

- **Test File Assessment Report:**
  - Document current state vs desired 2024/2025 standards
  - Identify specific anti-patterns and modernization opportunities
  - List missing test coverage areas and critical scenarios
  - Assess documentation completeness and accuracy
- **Prioritized Recommendations:**
  - **Critical Issues:** Failing tests, security vulnerabilities, accessibility violations
  - **Modernization:** Anti-pattern removal, testing library upgrades, documentation
  - **Enhancement:** Coverage gaps, missing edge cases, performance testing
  - **Organization:** File location, import optimization, naming conventions
- **Implementation Plan:**
  - Detailed steps for each recommended change
  - Risk assessment for breaking changes
  - Dependencies and order of operations
  - Testing validation strategy for changes

## 7. Coverage Gap Analysis and Test Generation

- **Missing Test Scenarios:**
  - Identify untested user workflows and edge cases
  - Check for missing error handling and validation scenarios
  - Assess mobile responsiveness and accessibility testing gaps
  - Verify cross-browser and cross-device testing coverage
- **Test Generation Strategy:**
  - **Unit Tests:** Missing component behavior, hook logic, utility functions
  - **Integration Tests:** Component interactions, service integrations, state management
  - **E2E Tests:** Complete user journeys, critical business workflows
  - **Accessibility Tests:** WCAG compliance, keyboard navigation, screen reader compatibility

## 8. Implementation and Validation Strategy

- **Pre-Implementation Validation:**
  - Confirm behavioral assumptions and expected outcomes
  - Validate architectural decisions and modernization approach
  - Ensure understanding of SmartPack-specific requirements
  - Review implementation plan and change impact
- **Implementation Approach:**
  - **Phase 1:** Apply critical IDE fixes first (type errors, import issues, configuration)
  - **Phase 2:** Apply critical test fixes (failing tests, security issues)
  - **Phase 3:** Modernize testing patterns systematically
  - **Phase 4:** Add missing documentation headers and organization
  - **Phase 5:** Generate missing tests for coverage gaps
  - **Phase 6:** Validate changes with comprehensive test execution
- **Post-Implementation Verification:**
  - Run complete test suite to ensure no regressions
  - Validate test execution performance and reliability
  - Check coverage reports for improvement metrics
  - Verify adherence to 2024/2025 testing standards

## Decision Points Requiring Clarification

**When architectural alignment questions arise:**

- Component responsibility boundaries and testing scope
- Service layer abstraction and mocking strategies
- State management patterns and context testing approach

**When behavioral assumptions need validation:**

- Expected user interactions and workflow changes
- Error handling and edge case requirements
- Performance and accessibility standards compliance

**When implementation approach needs confirmation:**

- Breaking changes that might affect dependent tests
- Test generation priorities and coverage targets
- Documentation updates and maintenance procedures

## Analysis Checklist

- [ ] **IDE Static Analysis completed (Before test execution)**
- [ ] TypeScript/ESLint errors in test files identified and categorized
- [ ] jest-axe type compatibility issues documented
- [ ] Integration test timeout and configuration problems assessed
- [ ] Test execution status documented (pass/fail with details) - only after IDE issues resolved
- [ ] 2024/2025 testing standards compliance assessed
- [ ] SmartPack architecture alignment validated
- [ ] Anti-patterns and modernization opportunities identified
- [ ] Coverage gaps and missing scenarios documented
- [ ] Documentation headers and organization evaluated
- [ ] Accessibility testing integration checked
- [ ] Mobile-first responsive testing patterns verified
- [ ] Service mocking and dependency management assessed
- [ ] Prioritized recommendations with implementation plan generated

## Implementation Checklist

- [ ] **IDE static analysis errors resolved first**
- [ ] TypeScript type compatibility issues fixed (jest-axe, expect.extend)
- [ ] Integration test timeout and configuration issues addressed
- [ ] Import and dependency resolution problems corrected
- [ ] Critical failing tests fixed or updated (after IDE issues resolved)
- [ ] Anti-patterns modernized (fireEvent → userEvent, etc.)
- [ ] Documentation headers added/updated per standards
- [ ] File organization corrected per established structure
- [ ] Missing accessibility tests added with jest-axe
- [ ] Coverage gaps filled with appropriate test types
- [ ] Service mocking updated for SmartPack architecture
- [ ] Mobile-first responsive testing implemented
- [ ] All tests passing with improved coverage metrics
- [ ] Changes validated against 2024/2025 standards

## Usage Guidelines

**For Individual Test Files:**
Provide the specific test file path and any known issues. Include relevant error messages or coverage reports.

**For Test Suites:**
Specify the test suite scope (component, integration, E2E) and any specific concerns about coverage or patterns.

**For Full Test Modernization:**
Request analysis of entire test infrastructure with focus on standards compliance and coverage improvement.

**Always Include:**

- Current test execution results
- Any specific behavioral questions or concerns
- Coverage reports if available
- Recent code changes that might affect tests
- **IDE Error Status:** Include any TypeScript/ESLint errors visible in IDE before running tests

## Common IDE Issues and Solutions

**jest-axe Type Compatibility (RESOLVED 2025-07-29):**

```typescript
// Problem: expect.extend(toHaveNoViolations) type mismatch with Vitest
// Solution: Use inline accessibility validation
const expectNoA11yViolations = async (container: HTMLElement) => {
  const results = await axe(container);
  expect(results.violations).toEqual([]);
};
```

**Integration Test Timeouts:**

```typescript
// Problem: "Test timed out in 5000ms" on setupApp() calls
// Solution: Investigate form interactions, navigation, element finding
```

**Mock Type Mismatches:**

```typescript
// Problem: vi.mocked() type conflicts
// Solution: Proper mock typing with correct return types
```

The prompt will analyze, provide detailed recommendations, and wait for confirmation before implementing any changes to ensure alignment with project goals and architectural decisions.
