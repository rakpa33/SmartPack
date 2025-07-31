# SmartPack Testing Instructions

## Testing Framework Stack

- **Unit/Integration**: Vitest + React Testing Library + @testing-library/jest-dom
- **E2E**: Playwright with accessibility validation
- **Coverage**: Built-in Vitest coverage with quality gates
- **Accessibility**: axe-core integration with automated checks

## Test Organization Structure

```
src/
├── __tests__/
│   ├── unit/                    # Component unit tests
│   ├── integration/             # Multi-component integration tests
│   └── mocks/                   # Mock data and services
├── test-utils/                  # Centralized test utilities
└── components/                  # Components with co-located test files

playwright/                      # E2E test suite
├── fixtures/                    # Test fixtures and page objects
└── pages/                       # Page object models
```

## Testing Strategy by Component Type

### UI Components

```javascript
// Standard pattern: render + user interaction + assertions
test('component behavior', async () => {
  render(<Component />);
  const element = screen.getByRole('button', { name: /click me/i });
  await user.click(element);
  expect(screen.getByText(/result/i)).toBeInTheDocument();
});
```

### Context Providers

```javascript
// Test with provider wrapper
test('context state updates', () => {
  const { result } = renderHook(() => useContext(TestContext), {
    wrapper: TestProvider,
  });
  // Test context behavior
});
```

### Forms and Validation

```javascript
// Test form submission and validation
test('form handles input and validation', async () => {
  render(<TripForm />);

  // Fill form fields
  await user.type(screen.getByLabelText(/trip name/i), 'Test Trip');
  await user.click(screen.getByRole('button', { name: /next/i }));

  // Assert validation or navigation
  await waitFor(() => {
    expect(screen.getByText(/packing checklist/i)).toBeInTheDocument();
  });
});
```

## Accessibility Testing Standards

### Automated Accessibility Checks

```javascript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('component has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Accessibility Validation

- Test keyboard navigation (Tab, Enter, Escape)
- Verify screen reader announcements
- Check focus management and visual indicators
- Validate color contrast ratios
- Test with high contrast mode

## Testing Environment Setup

### Pre-Test Checklist

```bash
# 1. Check for hanging Node.js processes
tasklist | find "node.exe"

# 2. Clean environment if needed
taskkill /F /IM node.exe

# 3. Verify build success
npm run build

# 4. Check for lint errors
npm run lint
```

### LocalStorage Testing Pattern

```javascript
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();

  // Setup test data if needed
  localStorage.setItem('tripForm', JSON.stringify(mockTripData));
});
```

## Test Execution Protocols

### Quick Validation (Prefer for Development)

```bash
# Single component test
npm test -- --run ComponentName.test.tsx

# Specific test pattern
npm test -- --run --testNamePattern="user can submit form"

# Directory-specific testing
npm test -- --run src/__tests__/unit/
```

### Integration Testing

```bash
# Integration test suite
npm run test:integration

# Specific integration test
npm test -- --run src/__tests__/integration/TripForm.integration.test.tsx
```

### E2E Testing

```bash
# Full E2E suite
npm run test:e2e

# Specific test file
npx playwright test travel-modes.spec.ts

# Debug mode
npm run test:e2e:debug
```

## Error Classification System

### NEW Failures (Must Fix)

- Related to recent code changes
- Blocking current development
- Priority: HIGH - Fix before proceeding

### PRE-EXISTING Failures (Document and Track)

- Existing in codebase before changes
- Not related to current work
- Priority: MEDIUM - Track separately

### ENVIRONMENTAL Failures (Fix Setup)

- Test environment or configuration issues
- Infrastructure or dependency problems
- Priority: HIGH - Blocks development workflow

## Mock Patterns and Test Data

### API Service Mocking

```javascript
// Mock external services
const mockApiService = {
  generatePackingList: vi.fn().mockResolvedValue(mockPackingList),
  fetchWeather: vi.fn().mockResolvedValue(mockWeatherData),
};

vi.mock('@/services/apiService', () => ({
  apiService: mockApiService,
}));
```

### LocalStorage Testing

```javascript
// Test localStorage persistence
test('data persists across page reloads', () => {
  const testData = { tripName: 'Test Trip' };

  // Simulate save
  localStorage.setItem('tripForm', JSON.stringify(testData));

  // Simulate reload
  const retrieved = JSON.parse(localStorage.getItem('tripForm') || '{}');
  expect(retrieved).toEqual(testData);
});
```

## Performance Testing

### Component Render Performance

```javascript
test('component renders within performance budget', () => {
  const startTime = performance.now();
  render(<ExpensiveComponent />);
  const renderTime = performance.now() - startTime;

  expect(renderTime).toBeLessThan(100); // 100ms budget
});
```

### Bundle Size Validation

```bash
# Check bundle size after changes
npm run build
# Verify dist/ folder size is reasonable
```

## Quality Gates and Success Criteria

### Before Commit Checklist

- [ ] All related unit tests pass
- [ ] Integration tests for affected features pass
- [ ] No new accessibility violations
- [ ] TypeScript compilation successful
- [ ] ESLint passes without warnings
- [ ] No hanging test processes

### Coverage Requirements

- Line coverage: >80% for new code
- Branch coverage: >70% for complex logic
- Function coverage: >90% for public APIs
- Statement coverage: >85% overall

## Common Testing Pitfalls

### Issues to Avoid

- Running full test suite for minor changes (use targeted testing)
- Ignoring hanging test processes
- Not cleaning localStorage between tests
- Testing implementation details instead of user behavior
- Skipping accessibility validation
- Not categorizing test failures properly

### Best Practices

- Use `findBy*` queries for async elements
- Test user workflows, not component internals
- Mock external dependencies consistently
- Include edge cases and error scenarios
- Maintain test data factories for consistency
- Document flaky tests and their resolution

## Test Monitoring and Maintenance

### Expected Performance

- Unit tests: Complete within 5 seconds
- Integration tests: Complete within 30 seconds
- E2E tests: Complete within 2 minutes
- Clear completion with pass/fail summary

### Red Flags

- Tests showing "queued" for >30 seconds
- Incomplete test runs without summary
- Console errors that are ignored
- Inconsistent test results between runs

### Recovery Actions

```bash
# Kill hanging processes
taskkill /F /IM node.exe

# Try unit tests only
npm test -- --run src/__tests__/unit/

# Check specific failing test
npm test -- --run --timeout=10000 failing-test.tsx
```
