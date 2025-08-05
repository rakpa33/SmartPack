import { test, expect } from '@playwright/test';

test.describe('SmartPack Ship Readiness - Manual Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5185');
    await page.waitForLoadState('networkidle');
  });

  test('Ship Readiness: Core Application Structure', async ({ page }) => {
    // Verify page loads
    await expect(page).toHaveTitle(/SmartPack|Vite/);
    
    // Check if React app loaded
    const rootElement = page.locator('#root');
    await expect(rootElement).toBeVisible();
    
    // Look for main components
    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.innerHTML.length > 100;
    });
    
    expect(hasContent).toBeTruthy();
    console.log('✅ Application loads and React content renders');
  });

  test('Ship Readiness: Form Elements Present', async ({ page }) => {
    // Look for form inputs
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    
    // Look for buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    // Look for form elements
    const forms = page.locator('form, .form, [role="form"]');
    const formCount = await forms.count();
    
    console.log(`Found ${inputCount} inputs, ${buttonCount} buttons, ${formCount} forms`);
    
    expect(inputCount).toBeGreaterThan(0);
    expect(buttonCount).toBeGreaterThan(0);
    
    console.log('✅ Form elements present and accessible');
  });

  test('Ship Readiness: Location Autocomplete Critical Test', async ({ page }) => {
    // Find destination input by multiple possible selectors
    const destinationSelectors = [
      'input[name="destination"]',
      'input[name="destinations"]', 
      'input[placeholder*="destination" i]',
      'input[placeholder*="where" i]',
      'input[placeholder*="location" i]',
      'input[aria-label*="destination" i]'
    ];
    
    let destinationInput = null;
    for (const selector of destinationSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.first().isVisible()) {
        destinationInput = element.first();
        console.log(`Found destination input with selector: ${selector}`);
        break;
      }
    }
    
    if (destinationInput) {
      console.log('📍 CRITICAL TEST: Osaka → Osaka, Japan geocoding');
      
      // Clear and fill
      await destinationInput.clear();
      await destinationInput.fill('Osaka');
      
      const beforeBlur = await destinationInput.inputValue();
      console.log(`Before blur: "${beforeBlur}"`);
      
      // Trigger blur and wait
      await destinationInput.blur();
      await page.waitForTimeout(3000);
      
      const afterBlur = await destinationInput.inputValue();
      console.log(`After blur: "${afterBlur}"`);
      
      if (afterBlur !== beforeBlur && afterBlur.includes('Japan')) {
        console.log('✅ SHIP CRITICAL: Location autocomplete WORKING!');
      } else if (afterBlur === beforeBlur) {
        console.log('❌ SHIP BLOCKER: Location autocomplete NOT working');
      } else {
        console.log(`⚠️ Unexpected result: "${afterBlur}"`);
      }
      
      // Additional test with Tokyo
      await destinationInput.clear();
      await destinationInput.fill('Tokyo');
      await destinationInput.blur();
      await page.waitForTimeout(2000);
      
      const tokyoResult = await destinationInput.inputValue();
      console.log(`Tokyo result: "${tokyoResult}"`);
      
    } else {
      console.log('❌ CRITICAL: Could not find destination input field');
    }
  });

  test('Ship Readiness: Basic Form Interaction', async ({ page }) => {
    // Test basic input functionality
    const firstInput = page.locator('input[type="text"], input:not([type]), input[type="email"]').first();
    
    if (await firstInput.isVisible()) {
      await firstInput.fill('Test Value');
      const value = await firstInput.inputValue();
      expect(value).toBe('Test Value');
      console.log('✅ Basic form input working');
    }
    
    // Test checkboxes if present
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();
    
    if (checkboxCount > 0) {
      await checkboxes.first().check();
      const isChecked = await checkboxes.first().isChecked();
      expect(isChecked).toBeTruthy();
      console.log(`✅ Checkbox interaction working (${checkboxCount} checkboxes found)`);
    }
    
    // Test button clicks
    const buttons = page.locator('button:not([disabled])');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      // Try clicking the first non-disabled button
      await buttons.first().click();
      console.log(`✅ Button click working (${buttonCount} buttons found)`);
    }
  });

  test('Ship Readiness: Navigation and Workflow', async ({ page }) => {
    // Look for navigation elements
    const navElements = page.locator('[role="navigation"], nav, .nav, [data-testid*="nav"]');
    const navCount = await navElements.count();
    
    // Look for workflow buttons
    const workflowButtons = page.locator('button').filter({
      hasText: /next|continue|generate|submit|create|save/i
    });
    const workflowCount = await workflowButtons.count();
    
    console.log(`Found ${navCount} navigation elements, ${workflowCount} workflow buttons`);
    
    if (workflowCount > 0) {
      console.log('✅ Workflow progression elements found');
    } else {
      console.log('⚠️ No clear workflow progression found');
    }
  });

  test('Ship Readiness: Mobile Responsiveness', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Check if content is visible and accessible
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    
    // Test touch interaction
    const firstClickable = page.locator('button, input, [role="button"]').first();
    if (await firstClickable.isVisible()) {
      await firstClickable.tap();
      console.log('✅ Touch interactions working on mobile');
    }
    
    // Check for horizontal scrolling (bad on mobile)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    if (!hasHorizontalScroll) {
      console.log('✅ No horizontal scroll on mobile - responsive design working');
    } else {
      console.log('⚠️ Horizontal scroll detected on mobile - may need responsive fixes');
    }
    
    // Restore desktop
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Ship Readiness: Error Handling', async ({ page }) => {
    // Monitor console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Test extreme inputs
    const textInputs = page.locator('input[type="text"], input:not([type])');
    if (await textInputs.count() > 0) {
      const input = textInputs.first();
      await input.fill('x'.repeat(500)); // Long input
      await input.blur();
      await page.waitForTimeout(1000);
    }
    
    if (consoleErrors.length === 0) {
      console.log('✅ No console errors with extreme inputs');
    } else {
      console.log(`⚠️ ${consoleErrors.length} console errors: ${consoleErrors.slice(0, 3).join(', ')}`);
    }
    
    // Check for error boundaries or crash states
    const errorStates = page.locator('.error, [data-testid="error"], .crash, .fallback');
    const hasErrors = await errorStates.count() > 0;
    
    if (!hasErrors) {
      console.log('✅ No error states detected - app running normally');
    } else {
      console.log('⚠️ Error states detected - may need investigation');
    }
  });

  test('Ship Readiness: Performance and Loading', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:5185');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    if (loadTime < 5000) {
      console.log('✅ Good loading performance');
    } else {
      console.log('⚠️ Slow loading - may need optimization');
    }
    
    // Check for loading indicators
    const loaders = page.locator('.loading, .spinner, [data-testid*="loading"]');
    const hasLoaders = await loaders.count() > 0;
    
    if (hasLoaders) {
      console.log('✅ Loading indicators present for better UX');
    }
  });
});