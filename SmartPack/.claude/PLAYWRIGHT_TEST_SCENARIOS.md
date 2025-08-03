# SmartPack Playwright Test Scenarios

This document defines comprehensive browser automation test scenarios for the SmartPack application using Playwright. These scenarios should be used by the smartpack-test-specialist and smartpack-test-auditor agents to validate real browser behavior.

## Prerequisites

- Development server running: `npm run dev` (localhost:5173)
- Playwright installed and configured
- Browser automation tools configured

## Core Test Scenarios

### 1. Application Launch and Initial Load

**Scenario**: Verify the application loads correctly and displays the main interface

```typescript
// Test Steps (Playwright):
test('application launches correctly', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector("[data-testid='main-layout']");
  await page.screenshot({ path: 'app-launch.png', fullPage: true });
  const content = await page.content();
  // Validate content contains expected elements
});

// Validation Points:
- Main layout renders correctly
- Three-column desktop layout visible
- TripForm component loads
- No console errors
- Performance: page loads within 2.5 seconds
```

### 2. Trip Form Creation Workflow

**Scenario**: Create a new trip through the multi-step form process

```typescript
// Test Steps:
test('create new trip workflow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForSelector("[data-testid='trip-form']");
  await page.fill("input[name='destination']", "Paris, France");
  await page.fill("input[name='startDate']", "2024-12-01");
  await page.fill("input[name='endDate']", "2024-12-07");
  await page.selectOption("select[name='tripType']", "leisure");
  await page.click("button[type='submit']");
  await page.waitForSelector("[data-testid='packing-list']");
  await page.screenshot({ path: 'trip-created.png' });
});

// Validation Points:
- Form validation works (real-time feedback)
- Date picker functionality
- Dropdown selections work
- Form submission navigates to packing list
- Trip data persists in localStorage
```

### 3. LocalStorage Persistence Testing

**Scenario**: Verify data persistence across browser sessions

```typescript
// Test Steps:
test('localStorage persistence', async ({ page }) => {
  // Create trip (use scenario 2 steps)
  await page.goto('http://localhost:5173');
  // ... create trip steps ...
  
  // Check localStorage
  const tripData = await page.evaluate(() => localStorage.getItem('tripData'));
  expect(tripData).not.toBeNull();
  
  // Reload page
  await page.reload();
  await page.waitForSelector("[data-testid='trip-details']");
  
  // Verify data persisted
  const persistedData = await page.evaluate(() => localStorage.getItem('tripData'));
  expect(persistedData).toBe(tripData);
});

// Validation Points:
- Trip data saved to localStorage
- Data persists after page reload
- UI state restored correctly
- No data loss or corruption
```

### 4. Packing List Management

**Scenario**: Add, edit, and manage packing list items

```typescript
// Test Steps:
test('packing list management', async ({ page }) => {
  // Ensure trip exists (scenario 2)
  await page.goto('http://localhost:5173');
  // ... ensure trip exists ...
  
  await page.waitForSelector("[data-testid='add-item-input']");
  await page.fill("[data-testid='add-item-input']", "Passport");
  await page.click("[data-testid='add-item-button']");
  await page.waitForSelector("[data-testid='packing-item-passport']");
  await page.check("[data-testid='item-checkbox-passport']");
  await page.click("[data-testid='delete-item-passport']");
  await page.screenshot({ path: 'packing-list-management.png' });
});

// Validation Points:
- Items can be added to packing list
- Checkbox interactions work
- Item deletion functionality
- Real-time updates to localStorage
- Proper visual feedback for actions
```

### 5. AI Suggestions Integration

**Scenario**: Test AI-powered packing suggestions (with Ollama fallback)

```typescript
// Test Steps:
test('AI suggestions integration', async ({ page }) => {
  // Ensure trip exists (scenario 2)
  await page.goto('http://localhost:5173');
  // ... ensure trip exists ...
  
  await page.waitForSelector("[data-testid='suggestions-panel']");
  await page.click("[data-testid='get-suggestions-button']");
  await page.waitForSelector("[data-testid='suggestion-item']", { timeout: 10000 });
  await page.click("[data-testid='add-suggestion-0']");
  await page.screenshot({ path: 'ai-suggestions.png' });
});

// Validation Points:
- Suggestions panel loads correctly
- AI service responds (or fallback triggers)
- Suggestions can be added to packing list
- Loading states display appropriately
- Error handling for AI service failures
```

### 6. Weather Integration

**Scenario**: Verify weather data display and integration

```typescript
// Test Steps:
test('weather integration', async ({ page }) => {
  // Ensure trip with destination exists (scenario 2)
  await page.goto('http://localhost:5173');
  // ... ensure trip with destination exists ...
  
  await page.waitForSelector("[data-testid='weather-panel']");
  await page.screenshot({ path: 'weather-display.png' });
  const content = await page.content();
  // Validate weather content
});

// Validation Points:
- Weather panel displays for destinations
- Weather data loads correctly
- Appropriate fallback for weather API failures
- Weather-based packing suggestions
```

### 7. Responsive Design Testing

**Scenario**: Test mobile and tablet layouts

```typescript
// Test Steps:
test('responsive design testing', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // iPhone SE
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForSelector("[data-testid='mobile-layout']");
  await page.screenshot({ path: 'mobile-layout.png' });
  
  // iPad
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: 'tablet-layout.png' });
  
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'desktop-layout.png' });
});

// Validation Points:
- Mobile-first responsive design works
- Touch targets are 44px minimum
- Navigation adapts to screen size
- Content remains accessible at all breakpoints
```

### 8. Accessibility Testing

**Scenario**: Validate keyboard navigation and screen reader compatibility

```javascript
// Test Steps:
1. puppeteer_evaluate({ 
     pageId: "main", 
     script: "document.activeElement.focus()" 
   })
2. puppeteer_evaluate({ 
     pageId: "main", 
     script: "document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}))" 
   })
3. puppeteer_evaluate({ 
     pageId: "main", 
     script: "document.activeElement.tagName" 
   })
4. puppeteer_screenshot({ pageId: "main", path: "keyboard-navigation.png" })

// Validation Points:
- Tab navigation works throughout the app
- Focus indicators are visible
- ARIA labels are present
- Screen reader compatibility
- Color contrast meets WCAG 2.1 AA standards
```

### 9. Error Handling and Edge Cases

**Scenario**: Test application behavior under error conditions

```javascript
// Test Steps:
1. // Simulate network failure
2. puppeteer_evaluate({ 
     pageId: "main", 
     script: "navigator.onLine = false" 
   })
3. puppeteer_click({ pageId: "main", selector: "[data-testid='get-suggestions-button']" })
4. puppeteer_wait_for_selector({ pageId: "main", selector: "[data-testid='error-message']" })
5. puppeteer_screenshot({ pageId: "main", path: "error-handling.png" })

// Validation Points:
- Graceful error handling
- User-friendly error messages
- Fallback functionality works
- No application crashes
- Error boundaries prevent cascading failures
```

### 10. Performance and Loading Testing

**Scenario**: Validate application performance metrics

```javascript
// Test Steps:
1. puppeteer_evaluate({ 
     pageId: "main", 
     script: "performance.mark('start')" 
   })
2. puppeteer_navigate({ pageId: "main", url: "http://localhost:5173" })
3. puppeteer_wait_for_selector({ pageId: "main", selector: "[data-testid='main-layout']" })
4. puppeteer_evaluate({ 
     pageId: "main", 
     script: "performance.mark('end'); performance.measure('load-time', 'start', 'end')" 
   })
5. puppeteer_evaluate({ 
     pageId: "main", 
     script: "performance.getEntriesByType('measure')[0].duration" 
   })

// Validation Points:
- LCP ≤ 2.5 seconds
- Bundle size optimized
- No memory leaks
- Efficient rendering
```

## Test Execution Guidelines

### For smartpack-test-specialist:
- Focus on specific component testing with targeted scenarios
- Use scenarios 1-5 for core functionality validation
- Implement accessibility testing (scenario 8) for all components
- Take screenshots for visual regression testing

### For smartpack-test-auditor:
- Execute comprehensive test suite including all scenarios
- Generate detailed reports with screenshots and performance metrics
- Categorize failures as NEW/PRE-EXISTING/ENVIRONMENTAL
- Document findings in markdown reports

### Test Environment Setup:
1. Ensure development server is running (`npm run dev`)
2. Clear browser cache and localStorage before testing
3. Use `npm run test:e2e:headed` for debugging with visible browsers
4. Use `npm run test:e2e:debug` for step-by-step debugging
5. Use `npm run test:e2e:ui` for interactive test development

### Failure Analysis:
- Capture screenshots at failure points
- Log browser console errors
- Document reproduction steps
- Categorize issues for appropriate escalation

### Performance Benchmarks:
- Page load time: ≤ 2.5 seconds
- First Contentful Paint: ≤ 1.8 seconds
- Touch target size: ≥ 44px
- Color contrast: ≥ 4.5:1 (text), ≥ 3:1 (UI components)

## Integration with Testing Pipeline

These scenarios complement existing testing infrastructure:
- **Unit Tests**: Component behavior and business logic
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Complete user workflows with Playwright
- **Browser Automation**: Real browser validation with Playwright across multiple browsers
- **Accessibility Tests**: WCAG compliance with jest-axe

The Playwright scenarios provide comprehensive validation that ensures the application works correctly in real browser environments across Chromium, Firefox, WebKit, and Mobile Chrome, complementing the existing test suite with multi-browser automation and interaction testing.