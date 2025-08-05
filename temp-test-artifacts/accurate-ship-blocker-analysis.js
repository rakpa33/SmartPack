/**
 * ACCURATE SHIP-BLOCKING BUG ANALYSIS
 * SmartPack Application - Updated to match actual component structure
 * 
 * Focus: Test real component structure and navigation patterns
 */

import { chromium } from 'playwright';

async function accurateShipBlockerAnalysis() {
    console.log('🔍 ACCURATE SHIP-BLOCKING BUG ANALYSIS');
    console.log('📅 Ship Timeline: 2-day maximum - focusing on CRITICAL issues only');
    console.log('🎯 Target: http://localhost:5177');
    console.log('=' .repeat(80));

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    const page = await context.newPage();

    const shipBlockers = [];
    const highPriority = [];
    const workingFeatures = [];

    // Console error monitoring
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });

    try {

        // ===== CRITICAL TEST 1: APPLICATION LOADS =====
        console.log('\n🧪 CRITICAL TEST 1: Application Loading');
        console.log('-'.repeat(50));

        await page.goto('http://localhost:5177', { waitUntil: 'networkidle' });
        console.log('✅ Application loads successfully');
        workingFeatures.push('Application loads successfully');

        // ===== CRITICAL TEST 2: COLUMN SECTIONS EXIST =====
        console.log('\n🧪 CRITICAL TEST 2: Core Column Sections');
        console.log('-'.repeat(50));

        // Check for the actual testids used in MainLayout
        const tripDetailsSection = await page.locator('[data-testid="trip-details-section"]');
        const packingListSection = await page.locator('[data-testid="packing-list-section"]');
        const aiSuggestionsSection = await page.locator('[data-testid="ai-suggestions-section"]');

        if (await tripDetailsSection.count() === 0) {
            shipBlockers.push({
                id: 'SB001',
                severity: 'CRITICAL',
                issue: 'Trip Details section missing',
                impact: 'Core trip form functionality unavailable',
                evidence: 'trip-details-section element not found'
            });
        } else {
            console.log('✅ Trip Details section exists');
            workingFeatures.push('Trip Details section available');
        }

        if (await packingListSection.count() === 0) {
            shipBlockers.push({
                id: 'SB002',
                severity: 'CRITICAL',
                issue: 'Packing List section missing',
                impact: 'Core packing checklist functionality unavailable',
                evidence: 'packing-list-section element not found'
            });
        } else {
            console.log('✅ Packing List section exists');
            workingFeatures.push('Packing List section available');
        }

        if (await aiSuggestionsSection.count() === 0) {
            shipBlockers.push({
                id: 'SB003',
                severity: 'CRITICAL',
                issue: 'AI Suggestions section missing',
                impact: 'AI-powered suggestions unavailable',
                evidence: 'ai-suggestions-section element not found'
            });
        } else {
            console.log('✅ AI Suggestions section exists');
            workingFeatures.push('AI Suggestions section available');
        }

        // ===== CRITICAL TEST 3: BOTTOM NAVIGATION =====
        console.log('\n🧪 CRITICAL TEST 3: Bottom Navigation Controls');
        console.log('-'.repeat(50));

        // Look for bottom navigation
        const bottomNav = await page.locator('nav[aria-label="Column visibility controls"]');
        if (await bottomNav.count() === 0) {
            shipBlockers.push({
                id: 'SB004',
                severity: 'CRITICAL',
                issue: 'Bottom navigation missing',
                impact: 'Users cannot navigate between sections on mobile',
                evidence: 'Bottom navigation nav element not found'
            });
        } else {
            console.log('✅ Bottom navigation exists');
            workingFeatures.push('Bottom navigation available');

            // Check for navigation buttons
            const tripDetailsBtn = await bottomNav.locator('button[aria-label*="Trip Details"]');
            const packingBtn = await bottomNav.locator('button[aria-label*="Packing Checklist"]');
            const suggestionsBtn = await bottomNav.locator('button[aria-label*="Suggestions"]');

            if (await tripDetailsBtn.count() === 0) {
                shipBlockers.push({
                    id: 'SB005',
                    severity: 'CRITICAL',
                    issue: 'Trip Details navigation button missing',
                    impact: 'Users cannot toggle trip details visibility',
                    evidence: 'Trip Details button not found in bottom nav'
                });
            } else {
                console.log('✅ Trip Details navigation button exists');
                workingFeatures.push('Trip Details navigation button available');
            }

            if (await packingBtn.count() === 0) {
                shipBlockers.push({
                    id: 'SB006',
                    severity: 'CRITICAL',
                    issue: 'Packing Checklist navigation button missing',
                    impact: 'Users cannot toggle packing list visibility',
                    evidence: 'Packing Checklist button not found in bottom nav'
                });
            } else {
                console.log('✅ Packing Checklist navigation button exists');
                workingFeatures.push('Packing Checklist navigation button available');
            }

            if (await suggestionsBtn.count() === 0) {
                shipBlockers.push({
                    id: 'SB007',
                    severity: 'CRITICAL',
                    issue: 'Suggestions navigation button missing',
                    impact: 'Users cannot toggle AI suggestions visibility',
                    evidence: 'Suggestions button not found in bottom nav'
                });
            } else {
                console.log('✅ Suggestions navigation button exists');
                workingFeatures.push('Suggestions navigation button available');
            }
        }

        // ===== CRITICAL TEST 4: TRIP FORM FIELDS =====
        console.log('\n🧪 CRITICAL TEST 4: Trip Form Fields');
        console.log('-'.repeat(50));

        // Look for form fields within the trip details section
        let tripFormFound = false;
        
        // Check if we can find form inputs
        const inputs = await page.locator('input[type="text"], input[type="date"], textarea');
        const inputCount = await inputs.count();
        
        console.log(`Found ${inputCount} form inputs`);
        
        if (inputCount === 0) {
            shipBlockers.push({
                id: 'SB008',
                severity: 'CRITICAL',
                issue: 'No form inputs found',
                impact: 'Users cannot enter trip information',
                evidence: 'No input elements found on page'
            });
        } else {
            workingFeatures.push(`${inputCount} form inputs available`);
            tripFormFound = true;
        }

        // Look for specific critical form fields
        const destinationInput = await page.locator('[data-testid*="destination-input"]');
        if (await destinationInput.count() === 0) {
            shipBlockers.push({
                id: 'SB009',
                severity: 'CRITICAL',
                issue: 'Destination input field missing',
                impact: 'Users cannot enter trip destinations',
                evidence: 'No destination input testid found'
            });
        } else {
            console.log('✅ Destination input field exists');
            workingFeatures.push('Destination input field available');
        }

        // ===== CRITICAL TEST 5: LOCATION AUTOCOMPLETE =====
        console.log('\n🧪 CRITICAL TEST 5: Location Autocomplete Function');
        console.log('-'.repeat(50));

        const destinationField = await page.locator('[data-testid="destination-input-0"]');
        
        if (await destinationField.count() > 0) {
            await destinationField.clear();
            await destinationField.fill('Osaka');
            
            console.log('   Testing: "Osaka" → blur event → should become enhanced location');
            await destinationField.blur();
            
            // Wait for potential geocoding
            await page.waitForTimeout(3000);
            
            const finalValue = await destinationField.inputValue();
            console.log(`   Result: "${finalValue}"`);
            
            if (finalValue === 'Osaka') {
                console.log('❌ SHIP BLOCKER: Location autocomplete not working');
                shipBlockers.push({
                    id: 'SB010',
                    severity: 'CRITICAL',
                    issue: 'Location autocomplete broken',
                    impact: 'Core UX feature non-functional',
                    evidence: `Input "Osaka" remains "Osaka" instead of being enhanced`,
                    reproduction: [
                        '1. Enter "Osaka" in destination field',
                        '2. Click away from field (blur)',
                        '3. EXPECTED: Field updates to enhanced location',
                        '4. ACTUAL: Field remains "Osaka"'
                    ]
                });
            } else if (finalValue.includes('Osaka') && finalValue !== 'Osaka') {
                console.log(`✅ Location autocomplete working: "Osaka" → "${finalValue}"`);
                workingFeatures.push(`Location autocomplete functional: Osaka → ${finalValue}`);
            } else {
                console.log('⚠️  Location autocomplete unexpected behavior');
                highPriority.push({
                    id: 'HP001',
                    severity: 'HIGH',
                    issue: 'Location autocomplete unexpected behavior',
                    impact: 'Potential user confusion',
                    evidence: `Input "Osaka" became "${finalValue}"`
                });
            }
        } else {
            console.log('❌ Cannot test autocomplete - destination field not found');
            shipBlockers.push({
                id: 'SB011',
                severity: 'CRITICAL',
                issue: 'Cannot access destination field for testing',
                impact: 'Core form functionality unclear',
                evidence: 'destination-input-0 element not found'
            });
        }

        // ===== CRITICAL TEST 6: SAVE FUNCTIONALITY =====
        console.log('\n🧪 CRITICAL TEST 6: Save/Submit Functionality');
        console.log('-'.repeat(50));

        // Look for save buttons - they might have different labels
        const saveButtons = await page.locator('button:has-text("Save"), button:has-text("Update"), button:has-text("Submit")');
        const saveButtonCount = await saveButtons.count();
        
        if (saveButtonCount === 0) {
            shipBlockers.push({
                id: 'SB012',
                severity: 'CRITICAL', 
                issue: 'No save/submit buttons found',
                impact: 'Users cannot save their trip information',
                evidence: 'No Save, Update, or Submit buttons found'
            });
        } else {
            console.log(`✅ Found ${saveButtonCount} save/submit buttons`);
            workingFeatures.push(`${saveButtonCount} save/submit buttons available`);
        }

        // ===== CRITICAL TEST 7: DATA PERSISTENCE =====
        console.log('\n🧪 CRITICAL TEST 7: Data Persistence');
        console.log('-'.repeat(50));

        const localStorageData = await page.evaluate(() => {
            const keys = Object.keys(localStorage);
            const data = {};
            keys.forEach(key => {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    data[key] = localStorage.getItem(key);
                }
            });
            return data;
        });

        if (Object.keys(localStorageData).length === 0) {
            highPriority.push({
                id: 'HP002',
                severity: 'HIGH',
                issue: 'No localStorage data found',
                impact: 'Data persistence may not be working',
                evidence: 'localStorage is empty'
            });
        } else {
            console.log('✅ Data persistence working - localStorage contains data');
            console.log(`   Keys found: ${Object.keys(localStorageData).join(', ')}`);
            workingFeatures.push('Data persistence functional');
        }

        // ===== CRITICAL TEST 8: MOBILE RESPONSIVENESS =====
        console.log('\n🧪 CRITICAL TEST 8: Mobile Responsiveness');
        console.log('-'.repeat(50));

        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        const mainContent = await page.locator('main');
        if (await mainContent.count() === 0) {
            shipBlockers.push({
                id: 'SB013',
                severity: 'CRITICAL',
                issue: 'Main content missing on mobile',
                impact: 'App unusable on mobile devices',
                evidence: 'Main element not found on mobile viewport'
            });
        } else {
            console.log('✅ Mobile layout accessible');
            workingFeatures.push('Mobile layout functional');
        }

        // Check if bottom navigation is visible on mobile
        const bottomNavVisible = await bottomNav.isVisible();
        if (!bottomNavVisible) {
            shipBlockers.push({
                id: 'SB014',
                severity: 'CRITICAL',
                issue: 'Bottom navigation not visible on mobile',
                impact: 'Mobile users cannot navigate between sections',
                evidence: 'Bottom navigation not visible on mobile viewport'
            });
        } else {
            console.log('✅ Bottom navigation visible on mobile');
            workingFeatures.push('Mobile navigation functional');
        }

        // Reset to desktop viewport
        await page.setViewportSize({ width: 1200, height: 800 });

        // ===== CRITICAL TEST 9: JAVASCRIPT ERRORS =====
        console.log('\n🧪 CRITICAL TEST 9: JavaScript Errors');
        console.log('-'.repeat(50));

        if (consoleErrors.length > 0) {
            console.log('❌ JavaScript errors detected:');
            consoleErrors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
            
            const criticalErrors = consoleErrors.filter(error => 
                error.toLowerCase().includes('uncaught') || 
                error.toLowerCase().includes('cannot read') ||
                error.toLowerCase().includes('is not defined')
            );

            if (criticalErrors.length > 0) {
                shipBlockers.push({
                    id: 'SB015',
                    severity: 'CRITICAL',
                    issue: 'Critical JavaScript errors',
                    impact: 'Application functionality compromised',
                    evidence: criticalErrors.join('; ')
                });
            } else {
                highPriority.push({
                    id: 'HP003',
                    severity: 'HIGH',
                    issue: 'JavaScript warnings detected',
                    impact: 'Potential development issues',
                    evidence: consoleErrors.join('; ')
                });
            }
        } else {
            console.log('✅ No JavaScript errors detected');
            workingFeatures.push('JavaScript execution clean');
        }

    } catch (globalError) {
        console.log('❌ CRITICAL: Global testing failure');
        shipBlockers.push({
            id: 'SB016',
            severity: 'CRITICAL',
            issue: 'Global testing failure',
            impact: 'Cannot complete comprehensive analysis',
            evidence: globalError.message
        });
    }

    await browser.close();

    // ===== RESULTS ANALYSIS =====
    console.log('\n' + '='.repeat(80));
    console.log('📊 ACCURATE SHIP-BLOCKING BUG ANALYSIS RESULTS');
    console.log('='.repeat(80));

    console.log(`\n✅ WORKING FEATURES (${workingFeatures.length}):`);
    workingFeatures.forEach((feature, index) => {
        console.log(`   ${index + 1}. ${feature}`);
    });

    console.log(`\n❌ SHIP BLOCKERS (${shipBlockers.length}):`);
    shipBlockers.forEach((blocker) => {
        console.log(`   ${blocker.id}: ${blocker.issue}`);
        console.log(`        Impact: ${blocker.impact}`);
        if (blocker.reproduction) {
            console.log(`        Reproduction:`);
            blocker.reproduction.forEach(step => console.log(`          ${step}`));
        }
    });

    console.log(`\n⚠️  HIGH PRIORITY ISSUES (${highPriority.length}):`);
    highPriority.forEach((issue) => {
        console.log(`   ${issue.id}: ${issue.issue}`);
        console.log(`        Impact: ${issue.impact}`);
    });

    // ===== SHIP DECISION =====
    console.log('\n' + '='.repeat(80));
    console.log('🚢 SHIP READINESS ASSESSMENT');
    console.log('='.repeat(80));

    if (shipBlockers.length === 0) {
        console.log('✅ SHIP DECISION: GO FOR LAUNCH');
        console.log('   All critical functionality working');
        console.log('   No ship-blocking bugs identified');
        console.log(`   ${workingFeatures.length} features confirmed working`);
        if (highPriority.length > 0) {
            console.log(`   ${highPriority.length} non-critical issues to address post-launch`);
        }
    } else {
        console.log('❌ SHIP DECISION: NO-GO FOR LAUNCH');
        console.log(`   ${shipBlockers.length} CRITICAL ship-blocking bugs identified`);
        console.log('   These issues must be fixed before shipping');
        console.log('\n   PRIORITY FIX ORDER:');
        shipBlockers.forEach((blocker, index) => {
            console.log(`   ${index + 1}. [${blocker.id}] ${blocker.issue}`);
        });
    }

    console.log('\n📋 NEXT ACTIONS:');
    if (shipBlockers.length > 0) {
        console.log('1. 🔧 CodeFixer: Implement fixes for ship-blocking bugs (in priority order)');
        console.log('2. 🧪 BugCrusher: Re-validate fixes after implementation');
        console.log('3. ✅ FunctionalValidator: Final end-to-end validation');
    } else {
        console.log('1. ✅ FunctionalValidator: Final ship readiness confirmation');
        console.log('2. 🚀 Ready for deployment preparation');
    }

    return {
        shipDecision: shipBlockers.length === 0 ? 'GO' : 'NO-GO',
        shipBlockers,
        highPriority,
        workingFeatures,
        summary: {
            totalShipBlockers: shipBlockers.length,
            totalHighPriority: highPriority.length,
            totalWorkingFeatures: workingFeatures.length,
            consoleErrors: consoleErrors.length
        }
    };
}

// Run the analysis
accurateShipBlockerAnalysis()
    .then(results => {
        console.log('\n🔍 Analysis completed successfully');
        process.exit(results.shipBlockers.length > 0 ? 1 : 0);
    })
    .catch(error => {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    });

export { accurateShipBlockerAnalysis };