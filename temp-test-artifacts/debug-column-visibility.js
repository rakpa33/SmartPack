/**
 * DEBUG COLUMN VISIBILITY ISSUE
 * Check why Packing List and AI Suggestions sections aren't visible
 */

import { chromium } from 'playwright';

async function debugColumnVisibility() {
    console.log('🔧 DEBUGGING COLUMN VISIBILITY ISSUE');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    const page = await context.newPage();

    try {
        await page.goto('http://localhost:5177', { waitUntil: 'networkidle' });
        
        // Check all sections
        console.log('\n📍 CHECKING ALL SECTIONS:');
        
        const tripDetails = await page.locator('[data-testid="trip-details-section"]');
        const packingList = await page.locator('[data-testid="packing-list-section"]');
        const aiSuggestions = await page.locator('[data-testid="ai-suggestions-section"]');
        
        console.log(`Trip Details: ${await tripDetails.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`Packing List: ${await packingList.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`AI Suggestions: ${await aiSuggestions.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);

        // Check visibility of existing sections
        if (await tripDetails.count() > 0) {
            const isVisible = await tripDetails.isVisible();
            console.log(`Trip Details visible: ${isVisible ? '✅ YES' : '❌ NO'}`);
        }

        if (await packingList.count() > 0) {
            const isVisible = await packingList.isVisible();
            console.log(`Packing List visible: ${isVisible ? '✅ YES' : '❌ NO'}`);
        }

        if (await aiSuggestions.count() > 0) {
            const isVisible = await aiSuggestions.isVisible();
            console.log(`AI Suggestions visible: ${isVisible ? '✅ YES' : '❌ NO'}`);
        }

        // Check localStorage for column visibility settings
        console.log('\n📱 CHECKING COLUMN VISIBILITY SETTINGS:');
        const columnSettings = await page.evaluate(() => {
            const visibility = localStorage.getItem('smartpack-column-visibility');
            return visibility ? JSON.parse(visibility) : null;
        });

        if (columnSettings) {
            console.log('Column Visibility Settings:', columnSettings);
        } else {
            console.log('❌ No column visibility settings found in localStorage');
        }

        // Check bottom navigation
        console.log('\n🧭 CHECKING BOTTOM NAVIGATION:');
        const bottomNav = await page.locator('nav[aria-label="Column visibility controls"]');
        console.log(`Bottom Navigation: ${await bottomNav.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        
        if (await bottomNav.count() > 0) {
            const isVisible = await bottomNav.isVisible();
            console.log(`Bottom Navigation visible: ${isVisible ? '✅ YES' : '❌ NO'}`);
            
            // Check navigation buttons
            const buttons = await bottomNav.locator('button');
            const buttonCount = await buttons.count();
            console.log(`Navigation buttons: ${buttonCount}`);
            
            for (let i = 0; i < buttonCount; i++) {
                const button = buttons.nth(i);
                const text = await button.textContent();
                const ariaLabel = await button.getAttribute('aria-label');
                const isPressed = await button.getAttribute('aria-pressed');
                console.log(`  Button ${i + 1}: "${text}" | aria-label: "${ariaLabel}" | pressed: ${isPressed}`);
            }
        }

        // Try clicking navigation buttons to show hidden sections
        console.log('\n🖱️ TESTING NAVIGATION BUTTON CLICKS:');
        if (await bottomNav.count() > 0) {
            const packingButton = await bottomNav.locator('button:has-text("Packing Checklist")');
            if (await packingButton.count() > 0) {
                console.log('Found Packing Checklist button, clicking...');
                await packingButton.click();
                await page.waitForTimeout(1000);
                
                const packingListAfterClick = await page.locator('[data-testid="packing-list-section"]');
                console.log(`Packing List after click: ${await packingListAfterClick.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
                if (await packingListAfterClick.count() > 0) {
                    const isVisible = await packingListAfterClick.isVisible();
                    console.log(`Packing List visible after click: ${isVisible ? '✅ YES' : '❌ NO'}`);
                }
            }

            const suggestionsButton = await bottomNav.locator('button:has-text("Suggestions")');
            if (await suggestionsButton.count() > 0) {
                console.log('Found Suggestions button, clicking...');
                await suggestionsButton.click();
                await page.waitForTimeout(1000);
                
                const aiSuggestionsAfterClick = await page.locator('[data-testid="ai-suggestions-section"]');
                console.log(`AI Suggestions after click: ${await aiSuggestionsAfterClick.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
                if (await aiSuggestionsAfterClick.count() > 0) {
                    const isVisible = await aiSuggestionsAfterClick.isVisible();
                    console.log(`AI Suggestions visible after click: ${isVisible ? '✅ YES' : '❌ NO'}`);
                }
            }
        }

        // Check what's actually rendered in the main element
        console.log('\n🔍 MAIN CONTENT ANALYSIS:');
        const mainElement = await page.locator('main');
        if (await mainElement.count() > 0) {
            const sections = await page.locator('main section');
            const sectionCount = await sections.count();
            console.log(`Total sections in main: ${sectionCount}`);
            
            for (let i = 0; i < sectionCount; i++) {
                const section = sections.nth(i);
                const testId = await section.getAttribute('data-testid');
                const id = await section.getAttribute('id');
                const isVisible = await section.isVisible();
                console.log(`  Section ${i + 1}: testid="${testId}" id="${id}" visible=${isVisible}`);
            }
        }

        // Check mobile viewport behavior
        console.log('\n📱 MOBILE VIEWPORT TEST:');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        
        const bottomNavMobile = await page.locator('nav[aria-label="Column visibility controls"]');
        console.log(`Bottom Nav on mobile: ${await bottomNavMobile.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        if (await bottomNavMobile.count() > 0) {
            const isVisible = await bottomNavMobile.isVisible();
            console.log(`Bottom Nav visible on mobile: ${isVisible ? '✅ YES' : '❌ NO'}`);
        }

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    }

    await page.waitForTimeout(2000); // Keep browser open to see final state
    await browser.close();
}

// Run the debug
debugColumnVisibility()
    .then(() => {
        console.log('\n🔧 Debug completed');
    })
    .catch(error => {
        console.error('❌ Debug failed:', error.message);
    });