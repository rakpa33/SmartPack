/**
 * Chrome-Specific Blur Event Debugging Script
 * Created: 2025-08-05
 * 
 * CRITICAL SHIP BLOCKER: Location autocomplete works in Safari/Firefox but fails in Chrome
 * 
 * Focus: Test Chrome-specific blur event handling and timing differences
 */

const { chromium, firefox, webkit } = require('playwright');

async function debugChromeBlurHandling() {
  console.log('🔍 CHROME BLUR EVENT DEBUG - Targeted Analysis');
  console.log('📋 Testing: Blur event handling differences');
  console.log('🎯 Focus: Chrome vs Safari/Firefox event timing');
  console.log('');

  // Test Chrome vs WebKit (Safari)
  const browsers = [
    { name: 'Chrome', engine: chromium },
    { name: 'Safari', engine: webkit }
  ];

  const results = {};

  for (const { name, engine } of browsers) {
    console.log(`🌐 Testing ${name}...`);
    
    try {
      const browser = await engine.launch({ headless: false });
      const context = await browser.newContext();
      const page = await context.newPage();

      // Comprehensive console logging
      page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warn' || msg.text().includes('BLUR') || msg.text().includes('handleDestination')) {
          console.log(`[${name} ${type.toUpperCase()}]`, msg.text());
        }
      });

      // Navigate to app - try multiple ports
      let appUrl = null;
      for (const port of [5177, 5176, 5175, 5174, 5173]) {
        try {
          await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle', timeout: 10000 });
          appUrl = `http://localhost:${port}`;
          console.log(`[${name}] Connected to app at ${appUrl}`);
          break;
        } catch (e) {
          // Try next port
        }
      }

      if (!appUrl) {
        throw new Error('Could not connect to dev server on any port');
      }

      // Wait for app to load
      await page.waitForTimeout(2000);

      // Try to find the trip edit form directly
      let foundForm = false;
      
      // Check if we're already on a form page or need to navigate
      const destinationInput = page.locator('[data-testid="destination-input-0"]');
      if (await destinationInput.isVisible()) {
        console.log(`[${name}] Form already visible`);
        foundForm = true;
      } else {
        // Try clicking different navigation options
        const navOptions = [
          'text=Create Trip', 
          'text=New Trip', 
          'text=Create', 
          'button:has-text("Create")',
          'a:has-text("Create")',
          '.btn:has-text("Create")'
        ];
        
        for (const selector of navOptions) {
          try {
            const element = page.locator(selector).first();
            if (await element.isVisible({ timeout: 2000 })) {
              console.log(`[${name}] Found navigation: ${selector}`);
              await element.click();
              await page.waitForTimeout(1000);
              if (await destinationInput.isVisible({ timeout: 5000 })) {
                foundForm = true;
                break;
              }
            }
          } catch (e) {
            // Continue to next option
          }
        }
      }

      if (!foundForm) {
        throw new Error('Could not find or navigate to trip form');
      }

      console.log(`[${name}] Form found, starting blur test...`);

      // Inject enhanced logging directly into the page
      await page.evaluate(() => {
        // Override console methods to ensure we see all logs
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.log = (...args) => {
          originalLog(`[PAGE LOG]`, ...args);
        };
        console.warn = (...args) => {
          originalWarn(`[PAGE WARN]`, ...args);
        };
        console.error = (...args) => {
          originalError(`[PAGE ERROR]`, ...args);
        };

        // Add event listener to track all blur events
        document.addEventListener('blur', (event) => {
          if (event.target && event.target.dataset && event.target.dataset.testid) {
            console.warn(`🚨 GLOBAL BLUR EVENT: ${event.target.dataset.testid}`, event.target.value);
          }
        }, true);

        console.log('🔧 Enhanced logging and event tracking injected');
      });

      // Test the blur event sequence
      const input = page.locator('[data-testid="destination-input-0"]');
      
      await input.focus();
      console.log(`[${name}] Input focused`);
      
      await input.fill('Osaka');
      console.log(`[${name}] Input filled with "Osaka"`);
      
      const beforeBlur = await input.inputValue();
      console.log(`[${name}] Value before blur: "${beforeBlur}"`);
      
      // Trigger blur and monitor closely
      console.log(`[${name}] Triggering blur...`);
      await input.blur();
      
      // Wait incrementally and check value changes
      const checks = [500, 1000, 2000, 3000, 5000];
      let finalValue = beforeBlur;
      
      for (const wait of checks) {
        await page.waitForTimeout(wait - (checks[checks.indexOf(wait) - 1] || 0));
        const currentValue = await input.inputValue();
        if (currentValue !== finalValue) {
          console.log(`[${name}] Value changed after ${wait}ms: "${currentValue}"`);
          finalValue = currentValue;
        }
      }
      
      console.log(`[${name}] Final value: "${finalValue}"`);
      
      // Test if the geocoding function exists and is callable
      const functionTest = await page.evaluate(() => {
        // Try to access React DevTools or component internals
        const input = document.querySelector('[data-testid="destination-input-0"]');
        if (input) {
          const reactKeys = Object.keys(input).filter(key => key.startsWith('__react'));
          return {
            reactKeys: reactKeys.length,
            inputExists: true,
            inputValue: input.value
          };
        }
        return { inputExists: false };
      });

      results[name] = {
        appUrl,
        beforeBlur,
        finalValue,
        changed: finalValue !== beforeBlur,
        geocodingWorked: finalValue.includes(','),
        functionTest
      };

      console.log(`[${name}] ✅ Test completed`);
      console.log('');

      await browser.close();
      
    } catch (error) {
      console.error(`[${name}] ❌ Test failed:`, error.message);
      results[name] = { error: error.message };
    }
  }

  // Analysis
  console.log('📊 BLUR EVENT ANALYSIS RESULTS:');
  console.log('=====================================');
  
  Object.entries(results).forEach(([browser, result]) => {
    if (result.error) {
      console.log(`${browser}: ❌ ERROR - ${result.error}`);
    } else {
      const status = result.geocodingWorked ? '✅ WORKING' : '❌ BROKEN';
      console.log(`${browser}: ${status}`);
      console.log(`  URL:     ${result.appUrl}`);
      console.log(`  Before:  "${result.beforeBlur}"`);
      console.log(`  After:   "${result.finalValue}"`);
      console.log(`  Changed: ${result.changed}`);
      console.log(`  React:   ${result.functionTest?.reactKeys || 0} keys`);
    }
    console.log('');
  });

  return results;
}

// Export for direct execution
if (require.main === module) {
  debugChromeBlurHandling().catch(console.error);
}

module.exports = { debugChromeBlurHandling };