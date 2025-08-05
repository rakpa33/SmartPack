const { chromium } = require('playwright');

async function debugBlurIssue() {
  console.log('🔍 Starting blur handler debug test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    console.log(`🌐 BROWSER: ${msg.text()}`);
  });

  try {
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:5176');
    await page.goto('http://localhost:5176');
    await page.waitForLoadState('networkidle');

    // Navigate to create new trip
    console.log('🎯 Clicking "Create New Trip" button');
    await page.click('text=Create New Trip');
    await page.waitForTimeout(1000);

    // Wait for form to be visible
    await page.waitForSelector('input[data-testid="destination-input-0"]', { timeout: 5000 });
    console.log('✅ Form loaded, destination input found');

    // Clear and type "Osaka"
    const input = page.locator('input[data-testid="destination-input-0"]');
    await input.clear();
    await input.fill('Osaka');
    console.log('📝 Entered "Osaka" in destination field');

    // Add console log listener before blur
    console.log('👂 Listening for blur events...');
    
    // Click away to trigger blur
    console.log('👆 Clicking away from input to trigger blur...');
    await page.click('body');
    
    // Wait a moment for any geocoding to happen
    await page.waitForTimeout(3000);
    
    // Check the final value
    const finalValue = await input.inputValue();
    console.log(`📋 Final value: "${finalValue}"`);
    
    if (finalValue === 'Osaka') {
      console.log('❌ ISSUE CONFIRMED: Value did not change from "Osaka"');
      console.log('🔧 This confirms the blur handler is not executing properly');
    } else {
      console.log('✅ SUCCESS: Value changed as expected');
    }

    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  await browser.close();
}

debugBlurIssue().catch(console.error);