const { chromium } = require('playwright');

async function testOsakaAutocomplete() {
  console.log('🔍 Starting firsthand testing of Osaka autocomplete issue...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the app
    console.log('📱 Navigating to http://localhost:5177...');
    await page.goto('http://localhost:5177', { waitUntil: 'networkidle' });
    
    // Wait for the app to load
    await page.waitForTimeout(2000);
    
    // Look for trip form - first check if we need to navigate to it
    console.log('🔍 Looking for trip creation form...');
    
    // Try to find the destination input field
    const destinationInput = await page.locator('input[placeholder*="destination" i], input[name*="destination" i], input[id*="destination" i]').first();
    
    if (await destinationInput.count() === 0) {
      console.log('❌ Destination input not found on current page - looking for navigation...');
      // Try to find a link or button to trip form
      const tripLink = await page.locator('a:has-text("Trip"), button:has-text("Trip"), a:has-text("Create"), button:has-text("Create")').first();
      if (await tripLink.count() > 0) {
        console.log('🔗 Found trip creation link, clicking...');
        await tripLink.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Now try to find destination input again
    const destInput = await page.locator('input[placeholder*="destination" i], input[name*="destination" i], input[id*="destination" i]').first();
    
    if (await destInput.count() === 0) {
      console.log('❌ Still cannot find destination input field');
      console.log('📄 Current page content:');
      console.log(await page.content());
      return;
    }
    
    console.log('✅ Found destination input field');
    
    // Test 1: Enter "Osaka" and blur
    console.log('🧪 TEST 1: Entering "Osaka" in destination field...');
    await destInput.click();
    await destInput.fill('Osaka');
    console.log('📝 Entered "Osaka", current value:', await destInput.inputValue());
    
    // Trigger blur event by clicking elsewhere
    console.log('🔄 Triggering blur event by clicking elsewhere...');
    await page.click('body');
    
    // Wait a moment for any async operations
    await page.waitForTimeout(2000);
    
    // Check final value
    const finalValue = await destInput.inputValue();
    console.log('📊 RESULT: Final value after blur:', finalValue);
    
    // Check console for any logs/errors
    console.log('🔍 Checking browser console for logs...');
    const logs = await page.evaluate(() => {
      return window.console._logs || [];
    });
    
    // Test 2: Try other cities
    console.log('🧪 TEST 2: Testing other cities...');
    const testCities = ['Tokyo', 'Paris', 'London'];
    
    for (const city of testCities) {
      console.log(`🌍 Testing "${city}"...`);
      await destInput.click();
      await destInput.fill(city);
      await page.click('body');
      await page.waitForTimeout(1500);
      const value = await destInput.inputValue();
      console.log(`📊 "${city}" result: ${value}`);
    }
    
    // Check for any console errors
    page.on('console', msg => console.log('🖥️ Browser console:', msg.text()));
    page.on('pageerror', err => console.log('❌ Page error:', err.message));
    
    console.log('✅ Testing complete');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testOsakaAutocomplete().catch(console.error);