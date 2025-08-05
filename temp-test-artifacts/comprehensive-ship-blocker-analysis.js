/**
 * COMPREHENSIVE SHIP-BLOCKING BUG ANALYSIS
 * SmartPack Application - Critical Issues Detection
 * 
 * Focus: Identify SHIP-CRITICAL bugs that prevent launch within 2-day timeline
 * Priority: Core functionality, navigation, data persistence, critical UX issues
 */

import { chromium } from 'playwright';

async function analyzeShipBlockingBugs() {
    console.log('🔍 STARTING COMPREHENSIVE SHIP-BLOCKING BUG ANALYSIS');
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

    // Network error monitoring
    const networkErrors = [];
    page.on('response', response => {
        if (response.status() >= 400) {
            networkErrors.push(`${response.status()} - ${response.url()}`);
        }
    });

    try {

        // ===== CRITICAL TEST 1: APPLICATION LOADS =====
        console.log('\n🧪 CRITICAL TEST 1: Application Loading');
        console.log('-'.repeat(50));

        try {
            await page.goto('http://localhost:5177', { waitUntil: 'networkidle' });
            console.log('✅ Application loads successfully');
            workingFeatures.push('Application loads successfully');
        } catch (error) {
            console.log('❌ SHIP BLOCKER: Application fails to load');
            console.log(`   Error: ${error.message}`);
            shipBlockers.push({
                id: 'SB001',
                severity: 'CRITICAL',
                issue: 'Application fails to load',
                impact: 'Complete application failure - cannot ship',
                evidence: error.message
            });
            return { shipBlockers, highPriority, workingFeatures, consoleErrors, networkErrors };
        }

        // ===== CRITICAL TEST 2: CORE NAVIGATION =====
        console.log('\n🧪 CRITICAL TEST 2: Core Navigation');
        console.log('-'.repeat(50));

        try {
            // Check if main navigation elements exist
            const tripDetailsButton = await page.locator('[data-testid="nav-trip-details"]');
            const packingListButton = await page.locator('[data-testid="nav-packing-list"]');
            
            if (await tripDetailsButton.count() === 0) {
                shipBlockers.push({
                    id: 'SB002',
                    severity: 'CRITICAL',
                    issue: 'Trip Details navigation button missing',
                    impact: 'Users cannot navigate to core trip form',
                    evidence: 'nav-trip-details element not found'
                });
            } else {
                console.log('✅ Trip Details navigation button exists');
                workingFeatures.push('Trip Details navigation available');
            }

            if (await packingListButton.count() === 0) {
                shipBlockers.push({
                    id: 'SB003',
                    severity: 'CRITICAL',
                    issue: 'Packing List navigation button missing',
                    impact: 'Users cannot navigate to packing checklist',
                    evidence: 'nav-packing-list element not found'
                });
            } else {
                console.log('✅ Packing List navigation button exists');
                workingFeatures.push('Packing List navigation available');
            }

            // Test navigation functionality
            if (await tripDetailsButton.count() > 0) {
                await tripDetailsButton.click();
                await page.waitForTimeout(1000);
                
                const tripForm = await page.locator('[data-testid="trip-form"]');
                if (await tripForm.count() === 0) {
                    shipBlockers.push({
                        id: 'SB004',
                        severity: 'CRITICAL',
                        issue: 'Trip Details navigation broken - form not loading',
                        impact: 'Core workflow blocked - users cannot create trips',
                        evidence: 'Trip form does not appear after navigation'
                    });
                } else {
                    console.log('✅ Trip Details navigation works - form loads');
                    workingFeatures.push('Trip Details navigation functional');
                }
            }

        } catch (error) {
            console.log('❌ SHIP BLOCKER: Navigation system failure');
            shipBlockers.push({
                id: 'SB005',
                severity: 'CRITICAL',
                issue: 'Navigation system failure',
                impact: 'Users cannot navigate between app sections',
                evidence: error.message
            });
        }

        // ===== CRITICAL TEST 3: FORM ACCESSIBILITY =====
        console.log('\n🧪 CRITICAL TEST 3: Core Form Accessibility');
        console.log('-'.repeat(50));

        try {
            // Navigate to trip form
            const tripDetailsButton = await page.locator('[data-testid="nav-trip-details"]');
            if (await tripDetailsButton.count() > 0) {
                await tripDetailsButton.click();
                await page.waitForTimeout(1000);
            }

            // Check for essential form fields
            const tripNameField = await page.locator('[data-testid="trip-name-input"]');
            const destinationField = await page.locator('[data-testid="destination-input-0"]');
            const startDateField = await page.locator('[data-testid="start-date-input"]');
            const endDateField = await page.locator('[data-testid="end-date-input"]');

            if (await tripNameField.count() === 0) {
                shipBlockers.push({
                    id: 'SB006',
                    severity: 'CRITICAL',
                    issue: 'Trip name field missing',
                    impact: 'Core form workflow broken - users cannot name trips',
                    evidence: 'trip-name-input element not found'
                });
            } else {
                console.log('✅ Trip name field accessible');
                workingFeatures.push('Trip name field available');
            }

            if (await destinationField.count() === 0) {
                shipBlockers.push({
                    id: 'SB007',
                    severity: 'CRITICAL',
                    issue: 'Destination field missing',
                    impact: 'Core form workflow broken - users cannot enter destinations',
                    evidence: 'destination-input-0 element not found'
                });
            } else {
                console.log('✅ Destination field accessible');
                workingFeatures.push('Destination field available');
            }

            if (await startDateField.count() === 0 || await endDateField.count() === 0) {
                shipBlockers.push({
                    id: 'SB008',
                    severity: 'CRITICAL',
                    issue: 'Date fields missing',
                    impact: 'Core form workflow broken - users cannot set trip dates',
                    evidence: 'Date input elements not found'
                });
            } else {
                console.log('✅ Date fields accessible');
                workingFeatures.push('Date fields available');
            }

        } catch (error) {
            console.log('❌ SHIP BLOCKER: Form accessibility failure');
            shipBlockers.push({
                id: 'SB009',
                severity: 'CRITICAL',
                issue: 'Form accessibility failure',
                impact: 'Core form workflow completely broken',
                evidence: error.message
            });
        }

        // ===== CRITICAL TEST 4: LOCATION AUTOCOMPLETE =====
        console.log('\n🧪 CRITICAL TEST 4: Location Autocomplete Function');
        console.log('-'.repeat(50));

        try {
            const destinationField = await page.locator('[data-testid="destination-input-0"]');
            
            if (await destinationField.count() > 0) {
                // Clear any existing value and type Osaka
                await destinationField.clear();
                await destinationField.fill('Osaka');
                
                // Trigger blur event
                console.log('   Testing: "Osaka" → blur event → should become "Osaka, Japan"');
                await destinationField.blur();
                
                // Wait for potential geocoding
                await page.waitForTimeout(3000);
                
                // Check final value
                const finalValue = await destinationField.inputValue();
                console.log(`   Result: "${finalValue}"`);
                
                if (finalValue === 'Osaka') {
                    console.log('❌ SHIP BLOCKER: Location autocomplete completely broken');
                    shipBlockers.push({
                        id: 'SB010',
                        severity: 'CRITICAL',
                        issue: 'Location autocomplete completely broken',
                        impact: 'Core UX feature non-functional - users expect "Osaka" → "Osaka, Japan"',
                        evidence: `Input "Osaka" remains "Osaka" instead of "Osaka, Japan" or similar`,
                        reproduction: [
                            '1. Enter "Osaka" in destination field',
                            '2. Click away from field (blur)',
                            '3. EXPECTED: Field updates to "Osaka, Japan"',
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
                        impact: 'Potential user confusion with autocomplete results',
                        evidence: `Input "Osaka" became "${finalValue}" which is unexpected`
                    });
                }
                
            } else {
                console.log('❌ Cannot test autocomplete - destination field not found');
            }

        } catch (error) {
            console.log('❌ Error testing location autocomplete');
            highPriority.push({
                id: 'HP002',
                severity: 'HIGH',
                issue: 'Location autocomplete testing failed',
                impact: 'Cannot verify core autocomplete functionality',
                evidence: error.message
            });
        }

        // ===== CRITICAL TEST 5: FORM SUBMISSION =====
        console.log('\n🧪 CRITICAL TEST 5: Form Submission Workflow');
        console.log('-'.repeat(50));

        try {
            // Fill out minimum required fields
            const tripNameField = await page.locator('[data-testid="trip-name-input"]');
            const destinationField = await page.locator('[data-testid="destination-input-0"]');
            const startDateField = await page.locator('[data-testid="start-date-input"]');
            const endDateField = await page.locator('[data-testid="end-date-input"]');

            if (await tripNameField.count() > 0) {
                await tripNameField.clear();
                await tripNameField.fill('Test Trip Ship Analysis');
            }

            if (await destinationField.count() > 0) {
                await destinationField.clear();
                await destinationField.fill('Tokyo, Japan');
            }

            if (await startDateField.count() > 0) {
                await startDateField.fill('2025-08-10');
            }

            if (await endDateField.count() > 0) {
                await endDateField.fill('2025-08-15');
            }

            // Try to find and check travel modes
            const travelModeWalking = await page.locator('[data-testid="travel-mode-walking"]');
            if (await travelModeWalking.count() > 0) {
                await travelModeWalking.check();
                console.log('✅ Travel mode selection working');
                workingFeatures.push('Travel mode selection functional');
            }

            // Look for save/submit button
            const saveButton = await page.locator('[data-testid="save-trip-button"]');
            if (await saveButton.count() === 0) {
                shipBlockers.push({
                    id: 'SB011',
                    severity: 'CRITICAL',
                    issue: 'Save/Submit button missing',
                    impact: 'Users cannot save their trip details - core workflow blocked',
                    evidence: 'save-trip-button element not found'
                });
            } else {
                console.log('✅ Save button accessible');
                
                // Try to submit form
                await saveButton.click();
                await page.waitForTimeout(2000);
                
                // Check if form saves successfully (look for success indicators)
                const successIndicator = await page.locator('.bg-green-100, .text-green-800, [data-testid="success-message"]');
                if (await successIndicator.count() > 0) {
                    console.log('✅ Form submission successful');
                    workingFeatures.push('Form submission functional');
                } else {
                    // Check if we're still on the form or moved to next step
                    const currentUrl = page.url();
                    if (currentUrl.includes('packing') || await page.locator('[data-testid="packing-list"]').count() > 0) {
                        console.log('✅ Form submission successful - navigated to packing list');
                        workingFeatures.push('Form submission and navigation functional');
                    } else {
                        console.log('⚠️  Form submission unclear - may need validation');
                        highPriority.push({
                            id: 'HP003',
                            severity: 'HIGH',
                            issue: 'Form submission success unclear',
                            impact: 'User feedback on form submission may be missing',
                            evidence: 'No clear success indicator after form submission'
                        });
                    }
                }
            }

        } catch (error) {
            console.log('❌ SHIP BLOCKER: Form submission failure');
            shipBlockers.push({
                id: 'SB012',
                severity: 'CRITICAL',
                issue: 'Form submission failure',
                impact: 'Core workflow broken - users cannot save trip details',
                evidence: error.message
            });
        }

        // ===== CRITICAL TEST 6: DATA PERSISTENCE =====
        console.log('\n🧪 CRITICAL TEST 6: Data Persistence');
        console.log('-'.repeat(50));

        try {
            // Check localStorage for saved data
            const localStorageData = await page.evaluate(() => {
                const keys = Object.keys(localStorage);
                const data = {};
                keys.forEach(key => {
                    data[key] = localStorage.getItem(key);
                });
                return data;
            });

            if (Object.keys(localStorageData).length === 0) {
                shipBlockers.push({
                    id: 'SB013',
                    severity: 'CRITICAL',
                    issue: 'Data persistence completely broken',
                    impact: 'User data not saved - complete data loss on refresh',
                    evidence: 'No data found in localStorage after form submission'
                });
            } else {
                console.log('✅ Data persistence working - localStorage contains data');
                console.log(`   Keys found: ${Object.keys(localStorageData).join(', ')}`);
                workingFeatures.push('Data persistence functional');
            }

        } catch (error) {
            console.log('❌ Error testing data persistence');
            highPriority.push({
                id: 'HP004',
                severity: 'HIGH',
                issue: 'Data persistence testing failed',
                impact: 'Cannot verify data persistence functionality',
                evidence: error.message
            });
        }

        // ===== CRITICAL TEST 7: MOBILE RESPONSIVENESS =====
        console.log('\n🧪 CRITICAL TEST 7: Mobile Responsiveness');
        console.log('-'.repeat(50));

        try {
            // Test mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await page.waitForTimeout(1000);

            // Check if main elements are still accessible
            const mainContent = await page.locator('main, [role="main"], .container');
            if (await mainContent.count() === 0) {
                shipBlockers.push({
                    id: 'SB014',
                    severity: 'CRITICAL',
                    issue: 'Mobile layout completely broken',
                    impact: 'App unusable on mobile devices - significant user base lost',
                    evidence: 'Main content not accessible on mobile viewport'
                });
            } else {
                console.log('✅ Mobile layout accessible');
                workingFeatures.push('Mobile layout functional');
            }

            // Reset to desktop viewport
            await page.setViewportSize({ width: 1200, height: 800 });

        } catch (error) {
            console.log('❌ Error testing mobile responsiveness');
            highPriority.push({
                id: 'HP005',
                severity: 'HIGH',
                issue: 'Mobile responsiveness testing failed',
                impact: 'Cannot verify mobile compatibility',
                evidence: error.message
            });
        }

        // ===== CRITICAL TEST 8: JAVASCRIPT ERRORS =====
        console.log('\n🧪 CRITICAL TEST 8: JavaScript Errors');
        console.log('-'.repeat(50));

        if (consoleErrors.length > 0) {
            console.log('❌ JavaScript errors detected:');
            consoleErrors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
            
            // Filter critical vs non-critical errors
            const criticalErrors = consoleErrors.filter(error => 
                error.toLowerCase().includes('uncaught') || 
                error.toLowerCase().includes('cannot read') ||
                error.toLowerCase().includes('is not defined') ||
                error.toLowerCase().includes('network error')
            );

            if (criticalErrors.length > 0) {
                shipBlockers.push({
                    id: 'SB015',
                    severity: 'CRITICAL',
                    issue: 'Critical JavaScript errors',
                    impact: 'Application functionality compromised by runtime errors',
                    evidence: criticalErrors.join('; ')
                });
            } else {
                highPriority.push({
                    id: 'HP006',
                    severity: 'HIGH',
                    issue: 'Non-critical JavaScript warnings',
                    impact: 'Potential development issues but not ship-blocking',
                    evidence: consoleErrors.join('; ')
                });
            }
        } else {
            console.log('✅ No JavaScript errors detected');
            workingFeatures.push('JavaScript execution clean');
        }

        // ===== CRITICAL TEST 9: NETWORK ERRORS =====
        console.log('\n🧪 CRITICAL TEST 9: Network Errors');
        console.log('-'.repeat(50));

        if (networkErrors.length > 0) {
            console.log('❌ Network errors detected:');
            networkErrors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });

            // Filter critical vs non-critical network errors
            const criticalNetworkErrors = networkErrors.filter(error => 
                error.includes('500') || error.includes('404') || error.includes('503')
            );

            if (criticalNetworkErrors.length > 0) {
                shipBlockers.push({
                    id: 'SB016',
                    severity: 'CRITICAL',
                    issue: 'Critical network failures',
                    impact: 'Essential services unavailable',
                    evidence: criticalNetworkErrors.join('; ')
                });
            } else {
                highPriority.push({
                    id: 'HP007',
                    severity: 'HIGH',
                    issue: 'Non-critical network errors',
                    impact: 'Some services may be degraded',
                    evidence: networkErrors.join('; ')
                });
            }
        } else {
            console.log('✅ No network errors detected');
            workingFeatures.push('Network requests successful');
        }

    } catch (globalError) {
        console.log('❌ CRITICAL: Global testing failure');
        shipBlockers.push({
            id: 'SB017',
            severity: 'CRITICAL',
            issue: 'Global testing failure',
            impact: 'Cannot complete comprehensive analysis',
            evidence: globalError.message
        });
    }

    await browser.close();

    // ===== RESULTS ANALYSIS =====
    console.log('\n' + '='.repeat(80));
    console.log('📊 COMPREHENSIVE SHIP-BLOCKING BUG ANALYSIS RESULTS');
    console.log('='.repeat(80));

    console.log(`\n✅ WORKING FEATURES (${workingFeatures.length}):`);
    workingFeatures.forEach((feature, index) => {
        console.log(`   ${index + 1}. ${feature}`);
    });

    console.log(`\n❌ SHIP BLOCKERS (${shipBlockers.length}):`);
    shipBlockers.forEach((blocker, index) => {
        console.log(`   ${blocker.id}: ${blocker.issue}`);
        console.log(`        Impact: ${blocker.impact}`);
        if (blocker.reproduction) {
            console.log(`        Reproduction:`);
            blocker.reproduction.forEach(step => console.log(`          ${step}`));
        }
    });

    console.log(`\n⚠️  HIGH PRIORITY ISSUES (${highPriority.length}):`);
    highPriority.forEach((issue, index) => {
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
        console.log(`   ${highPriority.length} non-critical issues to address post-launch`);
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
            consoleErrors: consoleErrors.length,
            networkErrors: networkErrors.length
        }
    };
}

// Run the analysis
analyzeShipBlockingBugs()
    .then(results => {
        console.log('\n🔍 Analysis completed successfully');
        process.exit(results.shipBlockers.length > 0 ? 1 : 0);
    })
    .catch(error => {
        console.error('❌ Analysis failed:', error.message);
        process.exit(1);
    });

export { analyzeShipBlockingBugs };