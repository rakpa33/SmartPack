/**
 * CHECK LOCALSTORAGE COLUMN SETTINGS
 * Investigate column visibility settings that might be hiding sections
 */

import { chromium } from 'playwright';

async function checkLocalStorageSettings() {
    console.log('📱 CHECKING LOCALSTORAGE COLUMN SETTINGS');
    console.log('=' .repeat(50));

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    const page = await context.newPage();

    try {
        await page.goto('http://localhost:5177', { waitUntil: 'networkidle' });
        
        // Get all localStorage data
        const allLocalStorage = await page.evaluate(() => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                try {
                    data[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    data[key] = localStorage.getItem(key);
                }
            }
            return data;
        });

        console.log('\n📦 ALL LOCALSTORAGE DATA:');
        Object.keys(allLocalStorage).forEach(key => {
            console.log(`${key}:`, JSON.stringify(allLocalStorage[key], null, 2));
        });

        // Check specifically column visibility settings
        const columnVisibility = allLocalStorage['smartpack-column-visibility'];
        if (columnVisibility) {
            console.log('\n👁️ COLUMN VISIBILITY SETTINGS:');
            console.log(JSON.stringify(columnVisibility, null, 2));
            
            // Check if packingChecklist and suggestions are disabled
            if (columnVisibility.packingChecklist === false) {
                console.log('❌ SHIP BLOCKER FOUND: Packing Checklist is disabled in localStorage');
            }
            if (columnVisibility.suggestions === false) {
                console.log('❌ SHIP BLOCKER FOUND: AI Suggestions is disabled in localStorage'); 
            }
        }

        // Try to fix column visibility by setting all to true
        console.log('\n🔧 ATTEMPTING TO FIX COLUMN VISIBILITY:');
        await page.evaluate(() => {
            const newSettings = {
                tripDetails: true,
                packingChecklist: true,
                suggestions: true
            };
            localStorage.setItem('smartpack-column-visibility', JSON.stringify(newSettings));
            console.log('Updated column visibility settings to show all columns');
        });

        // Refresh page to apply new settings
        await page.reload({ waitUntil: 'networkidle' });
        
        // Check sections again
        console.log('\n🔍 CHECKING SECTIONS AFTER FIX:');
        const tripDetails = await page.locator('[data-testid="trip-details-section"]').first();
        const packingList = await page.locator('[data-testid="packing-list-section"]');
        const aiSuggestions = await page.locator('[data-testid="ai-suggestions-section"]');
        
        console.log(`Trip Details: ${await tripDetails.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`Packing List: ${await packingList.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`AI Suggestions: ${await aiSuggestions.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);

        // Check bottom navigation after fix
        const bottomNav = await page.locator('nav[aria-label="Column visibility controls"]');
        console.log(`Bottom Navigation: ${await bottomNav.count() > 0 ? '✅ EXISTS' : '❌ MISSING'}`);
        
        if (await bottomNav.count() > 0) {
            const isVisible = await bottomNav.isVisible();
            console.log(`Bottom Navigation visible: ${isVisible ? '✅ YES' : '❌ NO'}`);
        }

        // Final localStorage check
        const finalSettings = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('smartpack-column-visibility'));
        });
        console.log('\n✅ FINAL COLUMN SETTINGS:', finalSettings);

    } catch (error) {
        console.error('❌ Check failed:', error.message);
    }

    await page.waitForTimeout(2000);
    await browser.close();
}

// Run the check
checkLocalStorageSettings()
    .then(() => {
        console.log('\n📱 localStorage check completed');
    })
    .catch(error => {
        console.error('❌ Check failed:', error.message);
    });