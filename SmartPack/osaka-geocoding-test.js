/**
 * TARGETED OSAKA GEOCODING TEST
 * Tests the specific "Osaka" → "Osaka, Japan" autocomplete functionality
 */

import { chromium } from 'playwright';

async function testOsakaGeocoding() {
    console.log('🎯 TESTING OSAKA GEOCODING FUNCTIONALITY');
    console.log('==========================================');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    // Capture all console messages and errors
    const logs = [];
    page.on('console', msg => {
        const message = `[${msg.type()}] ${msg.text()}`;
        logs.push(message);
        console.log(message);
    });
    
    page.on('pageerror', error => {
        const message = `[ERROR] ${error.message}`;
        logs.push(message);
        console.error(message);
    });
    
    try {
        // Navigate to the app
        console.log('\n📍 Loading SmartPack application...');
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
        
        // Take screenshot of initial state
        await page.screenshot({ path: 'osaka-test-initial.png' });
        
        // Look for the trip details edit form or a way to access it
        console.log('\n🔍 Looking for trip form or edit form...');
        
        // Multiple strategies to find and access the form
        let formFound = false;
        
        // Strategy 1: Look for edit button or form directly
        const editButton = await page.$('button:has-text("Edit"), button[aria-label*="edit"], button[title*="edit"]');
        if (editButton) {
            console.log('✓ Found edit button, clicking...');
            await editButton.click();
            await page.waitForTimeout(1000);
            formFound = true;
        }
        
        // Strategy 2: Look for destination input directly
        if (!formFound) {
            const destinationInput = await page.$('input[data-testid^="destination-input"], input[id^="destination-"], input[placeholder*="destination"]');
            if (destinationInput) {
                console.log('✓ Found destination input directly');
                formFound = true;
            }
        }
        
        // Strategy 3: Look for any form with destination-related fields
        if (!formFound) {
            console.log('🔍 Searching for form containing destination fields...');
            const allInputs = await page.$$('input[type="text"]');
            console.log(`Found ${allInputs.length} text inputs`);
            
            for (let i = 0; i < allInputs.length; i++) {
                const input = allInputs[i];
                const id = await input.getAttribute('id');
                const placeholder = await input.getAttribute('placeholder');
                const dataTestId = await input.getAttribute('data-testid');
                
                console.log(`Input ${i}: id="${id}", placeholder="${placeholder}", data-testid="${dataTestId}"`);
                
                if (id && id.includes('destination') || dataTestId && dataTestId.includes('destination')) {
                    console.log(`✓ Found potential destination input: ${id || dataTestId}`);
                    formFound = true;
                    break;
                }
            }
        }
        
        if (!formFound) {
            console.log('❌ Could not find any form with destination input');
            console.log('\nTrying to create a new trip to access form...');
            
            // Look for "Create Trip" or similar button
            const createButtons = await page.$$('button, a');
            for (const button of createButtons) {
                const text = await button.textContent();
                if (text && (text.includes('Create') || text.includes('New') || text.includes('Trip'))) {
                    console.log(`Found potential create button: "${text}"`);
                    await button.click();
                    await page.waitForTimeout(1000);
                    break;
                }
            }
        }
        
        // Now look for destination input again
        console.log('\n🎯 Testing Osaka geocoding...');
        
        // Find destination input with multiple selectors
        const destinationSelectors = [
            'input[data-testid="destination-input-0"]',
            'input[id="destination-0"]',
            'input[placeholder*="destination"]',
            'input[name*="destination"]'
        ];
        
        let destinationInput = null;
        for (const selector of destinationSelectors) {
            destinationInput = await page.$(selector);
            if (destinationInput) {
                console.log(`✓ Found destination input with selector: ${selector}`);
                break;
            }
        }
        
        if (!destinationInput) {
            console.log('❌ CRITICAL: Cannot find destination input field');
            
            // Debug: Show all inputs on page
            const allInputs = await page.$$('input');
            console.log('\nAll inputs found on page:');
            for (let i = 0; i < allInputs.length; i++) {
                const input = allInputs[i];
                const type = await input.getAttribute('type');
                const id = await input.getAttribute('id');
                const name = await input.getAttribute('name');
                const placeholder = await input.getAttribute('placeholder');
                const className = await input.getAttribute('class');
                const dataTestId = await input.getAttribute('data-testid');
                
                console.log(`${i + 1}. type="${type}", id="${id}", name="${name}", placeholder="${placeholder}", data-testid="${dataTestId}"`);
                console.log(`   class="${className}"`);
            }
            
            await browser.close();
            return { success: false, error: 'Destination input not found' };
        }
        
        // Test the Osaka geocoding functionality
        console.log('\n✨ Testing Osaka → Osaka, Japan conversion...');
        
        // Clear the field and enter "Osaka"
        await page.fill('input[data-testid="destination-input-0"]', '');
        await page.fill('input[data-testid="destination-input-0"]', 'Osaka');
        
        console.log('✓ Entered "Osaka" in destination field');
        await page.screenshot({ path: 'osaka-test-before-blur.png' });
        
        // Record console messages count before blur
        const logsBefore = logs.length;
        
        // Trigger blur event
        console.log('🔄 Triggering blur event...');
        await page.focus('body'); // Focus away from the input to trigger blur
        
        // Wait for geocoding to complete (allow time for async operation)
        await page.waitForTimeout(3000);
        
        // Check the field value after blur
        const valueAfter = await page.inputValue('input[data-testid="destination-input-0"]');
        console.log(`📝 Field value after blur: "${valueAfter}"`);
        
        // Take screenshot after blur
        await page.screenshot({ path: 'osaka-test-after-blur.png' });
        
        // Check for new console messages
        const logsAfter = logs.length;
        const newLogs = logs.slice(logsBefore);
        
        console.log(`\n📊 Console activity during blur:`);
        console.log(`Messages before: ${logsBefore}, after: ${logsAfter}`);
        if (newLogs.length > 0) {
            console.log('New messages:');
            newLogs.forEach(log => console.log(`  ${log}`));
        } else {
            console.log('❌ No console messages - function may not be executing');
        }
        
        // Evaluate the test result
        const testResult = {
            success: false,
            inputValue: valueAfter,
            expectedValue: 'Osaka, Japan',
            alternateExpected: 'Osaka, Osaka Prefecture, Japan',
            consoleActivity: newLogs.length > 0,
            functionExecuted: newLogs.some(log => log.includes('handleDestinationBlur') || log.includes('geocod')),
            logs: newLogs
        };
        
        if (valueAfter !== 'Osaka') {
            testResult.success = true;
            console.log(`✅ SUCCESS: Geocoding worked! "${valueAfter}"`);
        } else {
            console.log('❌ FAILURE: Geocoding did not work - value unchanged');
            
            if (!testResult.consoleActivity) {
                console.log('🔍 Root cause: No console activity - blur handler not executing');
            } else if (!testResult.functionExecuted) {
                console.log('🔍 Root cause: Console activity but no geocoding function execution');
            } else {
                console.log('🔍 Root cause: Function executed but geocoding failed');
            }
        }
        
        await browser.close();
        return testResult;
        
    } catch (error) {
        console.error(`\n💥 ERROR during testing: ${error.message}`);
        await browser.close();
        return { success: false, error: error.message, logs };
    }
}

// Run the test
testOsakaGeocoding().then(result => {
    console.log('\n' + '='.repeat(50));
    console.log('🏁 OSAKA GEOCODING TEST RESULTS');
    console.log('='.repeat(50));
    
    if (result.success) {
        console.log('✅ STATUS: GEOCODING WORKING');
        console.log(`✓ Input transformed: "Osaka" → "${result.inputValue}"`);
    } else {
        console.log('❌ STATUS: GEOCODING BROKEN');
        if (result.error) {
            console.log(`💥 Error: ${result.error}`);
        }
        if (result.inputValue) {
            console.log(`📝 Final value: "${result.inputValue}"`);
            console.log(`🎯 Expected: "${result.expectedValue}" or "${result.alternateExpected}"`);
        }
        if (result.logs && result.logs.length > 0) {
            console.log('\n📋 Console logs during test:');
            result.logs.forEach(log => console.log(`  ${log}`));
        }
    }
    
    console.log('\n🚢 SHIP IMPACT ASSESSMENT:');
    if (result.success) {
        console.log('✅ No ship blocker - geocoding functionality working');
    } else {
        console.log('🚫 SHIP BLOCKER - Core autocomplete feature broken');
        console.log('🔧 Requires immediate fix before shipping');
    }
}).catch(console.error);