// Browser-based workflow test using Playwright
const { chromium } = require('playwright');

async function testUserWorkflow() {
    console.log('🌐 Starting browser-based workflow test...');
    
    const browser = await chromium.launch({ 
        headless: false,  // Show browser for debugging
        slowMo: 1000      // Slow down actions to see what's happening
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Enable console logging from the browser
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('🔴 Browser Console Error:', msg.text());
        } else if (msg.type() === 'log') {
            console.log('📝 Browser Console Log:', msg.text());
        }
    });
    
    // Listen for network requests
    page.on('request', request => {
        if (request.url().includes('localhost:3000')) {
            console.log('🌐 API Request:', request.method(), request.url());
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('localhost:3000')) {
            console.log('📡 API Response:', response.status(), response.url());
        }
    });
    
    try {
        // Navigate to the app
        console.log('1. Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173');
        
        // Wait for the page to load
        await page.waitForLoadState('networkidle');
        console.log('✅ Page loaded successfully');
        
        // Take a screenshot of initial state
        await page.screenshot({ path: 'C:\\Users\\Rachel\\Desktop\\SmartPack\\.claude\\active-worktrees\\initial-state.png' });
        
        // Check if the form is visible
        const formVisible = await page.isVisible('form, [data-testid="trip-form"], input[name="name"], input[placeholder*="trip"], input[placeholder*="name"]');
        console.log('📋 Trip form visible:', formVisible);
        
        // Fill out the trip form
        console.log('2. Filling out trip form...');
        
        // Try different possible selectors for the name field
        const nameSelectors = [
            'input[name="name"]',
            'input[placeholder*="trip"]',
            'input[placeholder*="name"]',
            '[data-testid="trip-name"]',
            'input:first-of-type'
        ];
        
        let nameField = null;
        for (const selector of nameSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 2000 });
                nameField = selector;
                break;
            } catch (e) {
                // Try next selector
            }
        }
        
        if (nameField) {
            await page.fill(nameField, 'Test Trip to London');
            console.log('✅ Filled trip name');
        } else {
            console.log('❌ Could not find trip name field');
        }
        
        // Try to find and fill date fields
        const dateFields = await page.locator('input[type="date"]').count();
        console.log(`📅 Found ${dateFields} date fields`);
        
        if (dateFields >= 2) {
            await page.locator('input[type="date"]').first().fill('2025-08-10');
            await page.locator('input[type="date"]').last().fill('2025-08-15');
            console.log('✅ Filled dates');
        }
        
        // Try to find destinations field
        const destinationSelectors = [
            'input[name="destinations"]',
            'input[placeholder*="destination"]',
            'textarea[name="destinations"]'
        ];
        
        for (const selector of destinationSelectors) {
            try {
                if (await page.isVisible(selector)) {
                    await page.fill(selector, 'London, UK');
                    console.log('✅ Filled destinations');
                    break;
                }
            } catch (e) {
                // Try next selector
            }
        }
        
        // Take screenshot after filling form
        await page.screenshot({ path: 'C:\\Users\\Rachel\\Desktop\\SmartPack\\.claude\\active-worktrees\\form-filled.png' });
        
        // Look for save/submit/generate button
        console.log('3. Looking for submit button...');
        const buttonSelectors = [
            'button[type="submit"]',
            'button:has-text("Save")',
            'button:has-text("Generate")',
            'button:has-text("Create")',
            '[data-testid="save-button"]',
            '[data-testid="submit-button"]'
        ];
        
        let submitButton = null;
        for (const selector of buttonSelectors) {
            try {
                if (await page.isVisible(selector)) {
                    submitButton = selector;
                    break;
                }
            } catch (e) {
                // Try next selector
            }
        }
        
        if (submitButton) {
            console.log(`🎯 Found submit button: ${submitButton}`);
            await page.click(submitButton);
            console.log('✅ Clicked submit button');
        } else {
            console.log('❌ Could not find submit button');
            // List all buttons on the page
            const buttons = await page.locator('button').allTextContents();
            console.log('Available buttons:', buttons);
        }
        
        // Wait a moment for any network requests
        await page.waitForTimeout(3000);
        
        // Take screenshot after submission
        await page.screenshot({ path: 'C:\\Users\\Rachel\\Desktop\\SmartPack\\.claude\\active-worktrees\\after-submit.png' });
        
        // Check for results
        console.log('4. Checking for results...');
        
        // Look for checklist items
        const checklistItems = await page.locator('li, .checklist-item, [data-testid*="item"]').count();
        console.log(`📝 Found ${checklistItems} potential checklist items`);
        
        // Look for weather section
        const weatherVisible = await page.isVisible('*:has-text("Weather"), *:has-text("°"), .weather');
        console.log('🌤️ Weather section visible:', weatherVisible);
        
        // Look for AI suggestions
        const suggestionsVisible = await page.isVisible('*:has-text("Suggestions"), *:has-text("AI"), .suggestions');
        console.log('🤖 Suggestions section visible:', suggestionsVisible);
        
        // Check if anything is loading
        const loadingVisible = await page.isVisible('*:has-text("Loading"), .loading, .spinner');
        console.log('⏳ Loading indicators visible:', loadingVisible);
        
        // Final screenshot
        await page.screenshot({ path: 'C:\\Users\\Rachel\\Desktop\\SmartPack\\.claude\\active-worktrees\\final-state.png' });
        
        console.log('\\n📊 WORKFLOW TEST SUMMARY:');
        console.log('=========================');
        console.log(`✅ Page loaded: Yes`);
        console.log(`📋 Form visible: ${formVisible}`);
        console.log(`🎯 Submit button found: ${submitButton ? 'Yes' : 'No'}`);
        console.log(`📝 Checklist items: ${checklistItems}`);
        console.log(`🌤️ Weather visible: ${weatherVisible}`);
        console.log(`🤖 Suggestions visible: ${suggestionsVisible}`);
        console.log(`⏳ Still loading: ${loadingVisible}`);
        
        // Keep browser open for manual inspection
        console.log('\\n🔍 Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'C:\\Users\\Rachel\\Desktop\\SmartPack\\.claude\\active-worktrees\\error-state.png' });
    } finally {
        await browser.close();
    }
}

// Run the test
testUserWorkflow().catch(console.error);