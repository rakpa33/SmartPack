/**
 * CRITICAL BUG ANALYSIS SCRIPT
 * SmartPack Application - Ship-Blocker Detection
 * 
 * This script performs comprehensive testing of the SmartPack application
 * to identify critical bugs that would prevent shipping within 2-day timeline.
 */

import { chromium } from 'playwright';
import fs from 'fs';

async function criticalBugAnalysis() {
    console.log('🔍 STARTING CRITICAL BUG ANALYSIS FOR SMARTPACK');
    console.log('======================================================');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    // Setup console logging to catch errors
    const consoleMessages = [];
    const jsErrors = [];
    
    page.on('console', msg => {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
        jsErrors.push(error.message);
        console.error(`[JS ERROR] ${error.message}`);
    });
    
    const bugReport = {
        shipBlockers: [],
        highPriority: [],
        mediumPriority: [],
        lowPriority: [],
        jsErrors: [],
        consoleMessages: [],
        testResults: {}
    };
    
    try {
        console.log('\n📍 Testing Core Application Load...');
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
        
        // Test 1: Basic App Load and Navigation
        console.log('\n🧪 TEST 1: Basic App Load and Navigation');
        const title = await page.title();
        console.log(`✓ Page title: ${title}`);
        
        // Check if main navigation elements exist
        const navElements = await page.$$('nav a, nav button');
        console.log(`✓ Navigation elements: ${navElements.length} found`);
        
        if (navElements.length === 0) {
            bugReport.shipBlockers.push({
                id: 'SB001',
                title: 'Navigation Elements Missing',
                severity: 'CRITICAL',
                description: 'No navigation elements found - users cannot navigate the app',
                reproduction: 'Load main page and check for nav elements',
                impact: 'Complete navigation breakdown'
            });
        }
        
        // Test 2: Trip Creation Form Access
        console.log('\n🧪 TEST 2: Trip Creation Form Access');
        let formAccessible = false;
        
        try {
            // Look for trip creation form or button
            const createTripButton = await page.$('button:has-text("Create Trip"), button:has-text("New Trip"), a:has-text("Create Trip")');
            if (createTripButton) {
                await createTripButton.click();
                await page.waitForTimeout(1000);
                formAccessible = true;
                console.log('✓ Trip creation form accessible');
            } else {
                // Try to find form directly
                const tripForm = await page.$('form, [data-testid*="trip"], [class*="trip-form"]');
                if (tripForm) {
                    formAccessible = true;
                    console.log('✓ Trip form found directly');
                } else {
                    console.log('❌ Trip creation form not accessible');
                    bugReport.shipBlockers.push({
                        id: 'SB002',
                        title: 'Trip Creation Form Inaccessible',
                        severity: 'CRITICAL',
                        description: 'Users cannot access trip creation form - core functionality broken',
                        reproduction: 'Load app and try to find/access trip creation form',
                        impact: 'Core user journey broken - cannot create trips'
                    });
                }
            }
        } catch (error) {
            console.log(`❌ Error accessing trip form: ${error.message}`);
            bugReport.shipBlockers.push({
                id: 'SB003',
                title: 'Trip Form Access Error',
                severity: 'CRITICAL',
                description: `JavaScript error when trying to access trip form: ${error.message}`,
                reproduction: 'Click on trip creation elements',
                impact: 'Core functionality throws errors'
            });
        }
        
        // Test 3: Form Field Validation (if form is accessible)
        if (formAccessible) {
            console.log('\n🧪 TEST 3: Form Field Validation');
            
            // Test destination field (the reported Osaka issue)
            console.log('Testing destination field autocomplete...');
            const destinationField = await page.$('input[name*="destination"], input[placeholder*="destination"], input[placeholder*="where"]');
            
            if (destinationField) {
                console.log('✓ Destination field found');
                
                // Clear field and type "Osaka"
                await destinationField.clear();
                await destinationField.fill('Osaka');
                console.log('✓ Entered "Osaka" in destination field');
                
                // Record console messages before blur
                const messagesBefore = consoleMessages.length;
                
                // Trigger blur event
                await destinationField.blur();
                await page.waitForTimeout(2000); // Wait for any async operations
                
                // Check if field value changed
                const fieldValueAfter = await destinationField.inputValue();
                console.log(`Field value after blur: "${fieldValueAfter}"`);
                
                // Check for new console messages
                const messagesAfter = consoleMessages.length;
                const newMessages = consoleMessages.slice(messagesBefore);
                
                if (newMessages.length > 0) {
                    console.log('Console messages during blur:', newMessages);
                } else {
                    console.log('❌ No console messages from blur event - function may not be executing');
                }
                
                if (fieldValueAfter === 'Osaka') {
                    bugReport.shipBlockers.push({
                        id: 'SB004',
                        title: 'Location Autocomplete Broken',
                        severity: 'CRITICAL',
                        description: 'Destination field does not autocomplete "Osaka" to "Osaka, Japan" on blur',
                        reproduction: '1. Enter "Osaka" in destination field\n2. Click away from field\n3. Expect: "Osaka, Japan"\n4. Actual: "Osaka"',
                        impact: 'Key user experience feature non-functional',
                        debugInfo: {
                            consoleMessages: newMessages,
                            fieldValue: fieldValueAfter
                        }
                    });
                    console.log('❌ SHIP BLOCKER: Osaka autocomplete not working');
                } else {
                    console.log(`✓ Autocomplete working: ${fieldValueAfter}`);
                }
            } else {
                bugReport.shipBlockers.push({
                    id: 'SB005',
                    title: 'Destination Field Missing',
                    severity: 'CRITICAL',
                    description: 'Cannot find destination input field in trip form',
                    reproduction: 'Access trip form and look for destination field',
                    impact: 'Core form functionality missing'
                });
            }
            
            // Test other form fields for validation
            console.log('Testing other form field validation...');
            const tripNameField = await page.$('input[name*="name"], input[placeholder*="name"]');
            if (tripNameField) {
                await tripNameField.clear();
                await tripNameField.blur();
                await page.waitForTimeout(500);
                
                // Check for validation error display
                const errorMessage = await page.$('.error, .text-red-500, .text-danger, [role="alert"]');
                if (errorMessage) {
                    console.log('✓ Form validation working for required fields');
                } else {
                    bugReport.highPriority.push({
                        id: 'HP001',
                        title: 'Form Validation Missing',
                        severity: 'HIGH',
                        description: 'Required field validation not showing for empty trip name',
                        reproduction: 'Clear trip name field and blur',
                        impact: 'Poor user experience - no validation feedback'
                    });
                }
            }
        }
        
        // Test 4: Mobile Responsiveness
        console.log('\n🧪 TEST 4: Mobile Responsiveness');
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
        await page.waitForTimeout(1000);
        
        // Check if mobile layout is working
        const mobileElements = await page.$$('[class*="mobile"], [class*="sm:"], [class*="md:"]');
        console.log(`Mobile-responsive elements: ${mobileElements.length}`);
        
        // Check if buttons are touch-friendly (minimum 44px)
        const buttons = await page.$$('button');
        let smallButtons = 0;
        
        for (const button of buttons) {
            const box = await button.boundingBox();
            if (box && (box.height < 44 || box.width < 44)) {
                smallButtons++;
            }
        }
        
        if (smallButtons > 0) {
            bugReport.mediumPriority.push({
                id: 'MP001',
                title: 'Touch Target Size Issues',
                severity: 'MEDIUM',
                description: `${smallButtons} buttons smaller than 44px - not touch-friendly`,
                reproduction: 'Test on mobile device or small viewport',
                impact: 'Poor mobile user experience'
            });
        }
        
        // Test 5: Performance Issues
        console.log('\n🧪 TEST 5: Performance Check');
        const startTime = Date.now();
        await page.reload({ waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        if (loadTime > 5000) {
            bugReport.highPriority.push({
                id: 'HP002',
                title: 'Slow Page Load',
                severity: 'HIGH',
                description: `Page load time ${loadTime}ms exceeds 5 seconds`,
                reproduction: 'Reload page and measure load time',
                impact: 'Poor user experience - users may abandon'
            });
        }
        
        // Test 6: AI Integration
        console.log('\n🧪 TEST 6: AI Integration Status');
        // Look for AI-related elements or buttons
        const aiElements = await page.$$('button:has-text("AI"), button:has-text("Generate"), [class*="ai"], [data-testid*="ai"]');
        console.log(`AI-related elements: ${aiElements.length} found`);
        
        if (aiElements.length === 0) {
            bugReport.highPriority.push({
                id: 'HP003',
                title: 'AI Integration Elements Missing',
                severity: 'HIGH',
                description: 'No AI-related buttons or elements found in UI',
                reproduction: 'Look for AI generation buttons or features',
                impact: 'Key selling point of app not visible to users'
            });
        }
        
        // Test 7: Local Storage Persistence
        console.log('\n🧪 TEST 7: Data Persistence');
        await page.evaluate(() => {
            localStorage.setItem('test-key', 'test-value');
        });
        
        const storedValue = await page.evaluate(() => {
            return localStorage.getItem('test-key');
        });
        
        if (storedValue !== 'test-value') {
            bugReport.shipBlockers.push({
                id: 'SB006',
                title: 'LocalStorage Not Working',
                severity: 'CRITICAL',
                description: 'Data persistence via localStorage is broken',
                reproduction: 'Try to save and retrieve data from localStorage',
                impact: 'User data cannot be saved - core functionality broken'
            });
        } else {
            console.log('✓ LocalStorage working correctly');
        }
        
    } catch (error) {
        console.error(`\n❌ CRITICAL ERROR DURING TESTING: ${error.message}`);
        bugReport.shipBlockers.push({
            id: 'SB007',
            title: 'Testing Framework Error',
            severity: 'CRITICAL',
            description: `Critical error during automated testing: ${error.message}`,
            reproduction: 'Run automated bug analysis',
            impact: 'Cannot complete comprehensive testing'
        });
    }
    
    // Collect final results
    bugReport.jsErrors = [...new Set(jsErrors)];
    bugReport.consoleMessages = consoleMessages;
    
    await browser.close();
    
    // Generate Bug Report
    console.log('\n' + '='.repeat(60));
    console.log('🚨 CRITICAL BUG ANALYSIS REPORT');
    console.log('='.repeat(60));
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Ship Blockers: ${bugReport.shipBlockers.length}`);
    console.log(`High Priority: ${bugReport.highPriority.length}`);
    console.log(`Medium Priority: ${bugReport.mediumPriority.length}`);
    console.log(`JavaScript Errors: ${bugReport.jsErrors.length}`);
    
    if (bugReport.shipBlockers.length > 0) {
        console.log('\n🚫 SHIP BLOCKERS (MUST FIX):');
        bugReport.shipBlockers.forEach(bug => {
            console.log(`\n[${bug.id}] ${bug.title}`);
            console.log(`Severity: ${bug.severity}`);
            console.log(`Description: ${bug.description}`);
            console.log(`Impact: ${bug.impact}`);
            console.log(`Reproduction Steps: ${bug.reproduction}`);
            if (bug.debugInfo) {
                console.log(`Debug Info: ${JSON.stringify(bug.debugInfo, null, 2)}`);
            }
        });
    }
    
    if (bugReport.highPriority.length > 0) {
        console.log('\n⚠️ HIGH PRIORITY ISSUES:');
        bugReport.highPriority.forEach(bug => {
            console.log(`\n[${bug.id}] ${bug.title}`);
            console.log(`Description: ${bug.description}`);
            console.log(`Impact: ${bug.impact}`);
        });
    }
    
    if (bugReport.jsErrors.length > 0) {
        console.log('\n💥 JAVASCRIPT ERRORS:');
        bugReport.jsErrors.forEach((error, index) => {
            console.log(`${index + 1}. ${error}`);
        });
    }
    
    // Ship Readiness Assessment
    console.log('\n' + '='.repeat(60));
    console.log('🚢 SHIP READINESS ASSESSMENT');
    console.log('='.repeat(60));
    
    if (bugReport.shipBlockers.length === 0) {
        console.log('✅ STATUS: READY FOR SHIPPING');
        console.log('No critical ship-blocking issues found.');
        if (bugReport.highPriority.length > 0) {
            console.log(`⚠️ ${bugReport.highPriority.length} high-priority issues should be addressed if time permits.`);
        }
    } else {
        console.log('❌ STATUS: NO-GO FOR SHIPPING');
        console.log(`${bugReport.shipBlockers.length} critical ship-blocking issues must be resolved.`);
        console.log('\nRECOMMENDED FIX ORDER:');
        bugReport.shipBlockers.forEach((bug, index) => {
            console.log(`${index + 1}. ${bug.title} (${bug.id})`);
        });
    }
    
    // Save report to file
    const reportPath = './critical-bug-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(bugReport, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    return bugReport;
}

// Run the analysis
criticalBugAnalysis().catch(console.error);