# SmartPack Playwright Test Directory Navigation

**TEST INVENTORY - DO NOT DELETE**

This navigation file provides instant test discovery and reduces token usage by cataloging all E2E test scenarios without reading each file.

**Purpose**: E2E test inventory, test patterns, validation scenarios
**Status**: Critical file for test navigation and validation

## Directory Purpose

The `playwright/` directory contains end-to-end tests that validate complete user workflows, ensuring the application works correctly from a user's perspective. Tests are organized by feature area and criticality.

## Test File Inventory

### Critical Ship-Ready Tests
These tests MUST pass before shipping. They validate core functionality.

- **`critical-workflow-validation.spec.ts`**
  - Complete trip creation workflow
  - Packing list generation with AI
  - Data persistence across sessions
  - Core feature integration

- **`critical-ship-readiness-test.spec.ts`**
  - Ship-blocking bug detection
  - MVP feature completeness
  - Integration health checks
  - Go/no-go validation

- **`critical-form-submission-validation.spec.js`**
  - Form field validation
  - Required field enforcement
  - Save functionality
  - Error handling

### Feature-Specific Tests

- **`ai-packing-suggestions.spec.ts`**
  - AI service integration
  - Suggestion generation
  - Custom prompt handling
  - Fallback behavior when AI unavailable

- **`ai-integration-test.spec.ts`**
  - Ollama service connection
  - Response parsing
  - Error handling
  - Performance validation

- **`travel-modes.spec.ts`**
  - Transport mode selection
  - Multi-mode support
  - UI state management
  - Data persistence

- **`test-geocoding-live.spec.ts`**
  - Location autocomplete
  - Geocoding service integration
  - Invalid location handling
  - API error recovery

### User Journey Tests

- **`user-journey.spec.ts`**
  - First-time user experience
  - Complete workflow from start to finish
  - Cross-feature integration
  - Real-world usage patterns

- **`simple-workflow-test.spec.ts`**
  - Basic happy path validation
  - Minimal feature testing
  - Quick smoke test
  - Regression detection

### Accessibility Tests

- **`accessibility.spec.ts`**
  - WCAG 2.1 AA compliance
  - Keyboard navigation
  - Screen reader compatibility
  - Focus management
  - Color contrast validation

### Debug and Investigation Tests

- **`debug-blur-execution-20250805.spec.ts`**
  - Form blur event handling
  - Validation timing issues
  - State update debugging

- **`debug-osaka-console.spec.ts`**
  - Console error detection
  - Warning investigation
  - Performance monitoring

- **`osaka-autocomplete-test.spec.ts`**
  - Specific city autocomplete testing
  - Edge case validation
  - API response handling

### Validation Tests

- **`functional-validation-test.spec.ts`**
  - Complete functionality matrix
  - Feature coverage validation
  - Integration verification

- **`ship-readiness-validation.spec.ts`**
  - Production readiness checks
  - Performance benchmarks
  - Security validation

- **`urgent-geocoding-fix-validation.spec.ts`**
  - Geocoding bug fixes
  - Regression testing
  - API stability

### Manual Validation Tests

- **`ship-readiness-manual-test.spec.ts`**
  - Manual testing scenarios
  - Visual inspection points
  - UX validation checklist

- **`final-ship-manual-validation-20250805.spec.ts`**
  - Final pre-ship checklist
  - Manual verification steps
  - Sign-off criteria

- **`final-validation-20250805.spec.js`**
  - Comprehensive final checks
  - All features validation
  - Ship decision support

## Test Patterns and Helpers

### Fixtures Directory (`fixtures/`)

- **`base.ts`**
  - Shared test setup
  - Common page objects
  - Reusable assertions
  - Test data generators

### Page Objects (`pages/`)

- **`main-layout.page.ts`**
  - Main layout interactions
  - Navigation helpers
  - Column management
  - Responsive testing utilities

- **`trip-form.page.ts`**
  - Form interaction helpers
  - Field validation utilities
  - Save/submit actions
  - Error message assertions

## Test Execution Commands

### Running Tests

```bash
# Run all tests
npm run test:e2e

# Run with UI (debugging)
npm run test:e2e:ui

# Run specific test file
npx playwright test critical-workflow-validation

# Run tests by tag
npx playwright test --grep @critical

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific browser
npx playwright test --project=chromium
```

### Test Configuration

Tests use configuration from `playwright.config.ts`:
- **Browsers**: Chromium, Firefox, WebKit
- **Viewports**: Mobile and desktop
- **Base URL**: `http://localhost:5173`
- **Timeout**: 30 seconds per test
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure
- **Videos**: On first retry

## Test Categories and Priority

### Priority 1: Ship-Critical (Must Pass 100%)
```
✓ Application loads successfully
✓ Trip form accepts all required inputs
✓ Generate packing list works
✓ Data persists across sessions
✓ AI integration functions (or fallback works)
```

### Priority 2: High-Priority (Should Work Well)
```
✓ Weather integration displays correctly
✓ Form validation provides clear feedback
✓ Navigation between sections is smooth
✓ Mobile experience is functional
✓ Error states are handled gracefully
```

### Priority 3: Nice-to-Have (Can Have Minor Issues)
```
✓ Animations and transitions
✓ Advanced customization options
✓ Edge case handling
✓ Performance optimizations
✓ Cross-browser consistency
```

## Common Test Scenarios

### Scenario 1: First-Time User
1. Open application
2. See welcome state
3. Start creating first trip
4. Fill required fields
5. Generate packing list
6. See AI suggestions
7. Customize list
8. Data persists on refresh

### Scenario 2: Returning User
1. Open application with existing data
2. See previous trip
3. Edit trip details
4. Regenerate packing list
5. Add custom items
6. Mark items as packed
7. Data updates persist

### Scenario 3: Error Recovery
1. Disconnect Ollama service
2. Try generating packing list
3. See fallback UI
4. Get helpful error message
5. App remains functional
6. Can still use manual features

## Test Data Management

### Test Data Patterns
```typescript
// Valid trip data
const validTrip = {
  tripName: "Paris Adventure",
  destinations: ["Paris", "Lyon"],
  startDate: "2024-06-01",
  endDate: "2024-06-07",
  transportModes: ["plane", "train"]
};

// Edge case data
const edgeCase = {
  tripName: "A".repeat(100), // Max length
  destinations: ["Unknown City"],
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0], // Same day
  transportModes: [] // No transport
};
```

## Debugging Failed Tests

### Common Failure Patterns

1. **Timeout Errors**
   - Increase timeout in test
   - Check if services are running
   - Add explicit waits

2. **Element Not Found**
   - Check selectors are correct
   - Verify page loaded completely
   - Add wait for element

3. **AI Service Failures**
   - Ensure Ollama is running
   - Check network connectivity
   - Verify fallback behavior

### Debug Commands
```bash
# Run with debug output
DEBUG=pw:api npx playwright test

# Generate trace for debugging
npx playwright test --trace on

# Open trace viewer
npx playwright show-trace trace.zip

# Take screenshots at each step
npx playwright test --screenshot on
```

## Integration with CI/CD

### GitHub Actions Integration
Tests run automatically on:
- Pull requests
- Main branch commits
- Nightly builds
- Release tags

### Test Reports
- HTML reports in `playwright-report/`
- JUnit XML for CI integration
- Screenshots in `test-results/`
- Videos for failed tests

## Best Practices

### Writing New Tests
1. Use descriptive test names
2. Follow AAA pattern (Arrange, Act, Assert)
3. Include both happy path and error cases
4. Use page objects for reusability
5. Add appropriate tags (@critical, @smoke, etc.)

### Test Maintenance
1. Keep tests independent
2. Clean up test data after each test
3. Use fixtures for common setup
4. Update tests when features change
5. Remove obsolete tests

### Performance Tips
1. Run tests in parallel when possible
2. Use `test.skip()` for known issues
3. Minimize browser context creation
4. Reuse authentication state
5. Use API calls for data setup when possible