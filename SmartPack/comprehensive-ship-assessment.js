/**
 * COMPREHENSIVE SHIP READINESS ASSESSMENT
 * Complete bug identification and ship-blocker analysis for SmartPack
 */

import { chromium } from 'playwright';
import fs from 'fs';

async function comprehensiveShipAssessment() {
    console.log('🚢 COMPREHENSIVE SHIP READINESS ASSESSMENT');
    console.log('============================================');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    const shipAssessment = {
        shipBlockers: [],
        highPriority: [],
        mediumPriority: [],
        workingFeatures: [],
        overallStatus: 'UNKNOWN',
        shipRecommendation: 'UNKNOWN',
        testResults: {}
    };
    
    // Capture errors and console messages
    const errors = [];
    const consoleMessages = [];
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error(`🚨 JS ERROR: ${error.message}`);
    });
    
    page.on('console', msg => {
        const message = `[${msg.type()}] ${msg.text()}`;
        consoleMessages.push(message);
        if (msg.type() === 'error') {
            console.error(`🔴 ${message}`);
        }
    });
    
    try {
        // Test 1: Basic Application Load
        console.log('\n📱 TEST 1: Basic Application Load & Structure');
        await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
        
        const title = await page.title();
        console.log(`✓ Page loads with title: ${title}`);
        shipAssessment.workingFeatures.push('Application loads successfully');
        
        // Test 2: Critical Form Components
        console.log('\n📝 TEST 2: Critical Form Components');
        
        // Check if trip form/edit form is accessible
        const destinationInput = await page.$('input[data-testid="destination-input-0"]');
        if (destinationInput) {
            console.log('✓ Destination form input found');
            shipAssessment.workingFeatures.push('Trip form structure exists');
            
            // Test the CRITICAL Osaka geocoding issue
            console.log('🔍 Testing Osaka geocoding (reported ship blocker)...');
            await page.fill('input[data-testid="destination-input-0"]', 'Osaka');
            await page.focus('body'); // Trigger blur
            await page.waitForTimeout(2000);
            
            const osakaValue = await page.inputValue('input[data-testid="destination-input-0"]');
            if (osakaValue === 'Osaka') {
                shipAssessment.shipBlockers.push({
                    id: 'SB001',
                    title: 'Location Autocomplete Completely Broken',
                    severity: 'CRITICAL',
                    description: 'Destination field geocoding not working - "Osaka" should change to "Osaka, Japan" but remains unchanged',
                    reproduction: '1. Enter "Osaka" in destination field\n2. Click away (blur)\n3. Expected: "Osaka, Japan"\n4. Actual: "Osaka"',
                    impact: 'Core user experience feature non-functional - users expect location enhancement',
                    evidence: `Field value: "${osakaValue}"`
                });
                console.log('❌ SHIP BLOCKER: Osaka geocoding broken');
            } else {
                console.log(`✓ Osaka geocoding working: "${osakaValue}"`);
                shipAssessment.workingFeatures.push('Location geocoding functional');
            }
            
        } else {
            shipAssessment.shipBlockers.push({
                id: 'SB002',
                title: 'Trip Form Not Accessible',
                severity: 'CRITICAL',
                description: 'Cannot access trip creation/edit form - core functionality missing',
                reproduction: 'Load application and look for trip form',
                impact: 'Users cannot create or edit trips - app unusable'
            });
            console.log('❌ SHIP BLOCKER: No trip form found');
        }
        
        // Test 3: Navigation & Core User Flow
        console.log('\n🧭 TEST 3: Navigation & Core User Flow');
        
        const navElements = await page.$$('nav a, nav button, [role="navigation"] a, [role="navigation"] button');
        console.log(`Navigation elements: ${navElements.length}`);
        
        if (navElements.length === 0) {
            shipAssessment.highPriority.push({
                id: 'HP001',
                title: 'Navigation Elements Missing',
                severity: 'HIGH',
                description: 'No navigation elements found - users cannot navigate between sections',
                impact: 'Poor user experience - navigation confusion'
            });
        } else {
            shipAssessment.workingFeatures.push('Navigation structure exists');
        }
        
        // Test 4: AI Integration Features
        console.log('\n🤖 TEST 4: AI Integration Features');
        
        const aiButtons = await page.$$('button:has-text("Generate"), button:has-text("AI"), [data-testid*="ai"], [class*="ai"]');
        console.log(`AI-related buttons: ${aiButtons.length}`);
        
        if (aiButtons.length === 0) {
            shipAssessment.highPriority.push({
                id: 'HP002',
                title: 'AI Features Not Visible',
                severity: 'HIGH',
                description: 'No AI generation buttons or features visible in UI',
                impact: 'Key selling point of app not accessible to users'
            });
        } else {
            console.log('✓ AI integration elements present');
            shipAssessment.workingFeatures.push('AI integration UI elements present');
        }
        
        // Test 5: Data Persistence
        console.log('\n💾 TEST 5: Data Persistence');
        
        const testKey = 'ship-test-key';
        const testValue = 'ship-test-value';
        
        await page.evaluate(({ key, value }) => {
            localStorage.setItem(key, value);
        }, { key: testKey, value: testValue });
        
        const retrievedValue = await page.evaluate(({ key }) => {
            return localStorage.getItem(key);
        }, { key: testKey });
        
        if (retrievedValue === testValue) {
            console.log('✓ LocalStorage working correctly');
            shipAssessment.workingFeatures.push('Data persistence functional');
        } else {
            shipAssessment.shipBlockers.push({
                id: 'SB003',
                title: 'Data Persistence Broken',
                severity: 'CRITICAL',
                description: 'LocalStorage not working - user data cannot be saved',
                impact: 'Users lose all data on page refresh - app unusable for real use'
            });
        }
        
        // Test 6: Mobile Responsiveness
        console.log('\n📱 TEST 6: Mobile Responsiveness');
        
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
        await page.waitForTimeout(1000);
        
        // Check for mobile-responsive elements
        const mobileElements = await page.$$('[class*="sm:"], [class*="md:"], [class*="lg:"]');
        console.log(`Mobile-responsive classes: ${mobileElements.length}`);
        
        // Check button sizes for touch-friendliness
        const buttons = await page.$$('button');
        let touchFriendlyButtons = 0;
        let tooSmallButtons = 0;
        
        for (const button of buttons) {
            const box = await button.boundingBox();
            if (box) {
                if (box.height >= 44 && box.width >= 44) {
                    touchFriendlyButtons++;
                } else {
                    tooSmallButtons++;
                }
            }
        }
        
        console.log(`Touch-friendly buttons: ${touchFriendlyButtons}, Too small: ${tooSmallButtons}`);
        
        if (tooSmallButtons > touchFriendlyButtons) {
            shipAssessment.mediumPriority.push({
                id: 'MP001',
                title: 'Mobile Touch Targets Too Small',
                severity: 'MEDIUM',
                description: `${tooSmallButtons} buttons smaller than 44px - not touch-friendly`,
                impact: 'Poor mobile user experience'
            });
        } else {
            shipAssessment.workingFeatures.push('Mobile touch targets adequate');
        }
        
        // Test 7: Performance
        console.log('\n⚡ TEST 7: Performance Check');
        
        const startTime = Date.now();
        await page.reload({ waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        if (loadTime > 5000) {
            shipAssessment.highPriority.push({
                id: 'HP003',
                title: 'Slow Page Load Performance',
                severity: 'HIGH',
                description: `Page load time ${loadTime}ms exceeds 5 seconds`,
                impact: 'Users may abandon slow-loading app'
            });
        } else if (loadTime > 3000) {
            shipAssessment.mediumPriority.push({
                id: 'MP002',
                title: 'Moderate Page Load Performance',
                severity: 'MEDIUM',
                description: `Page load time ${loadTime}ms could be improved`,
                impact: 'Slightly degraded user experience'
            });
        } else {
            console.log(`✓ Good performance: ${loadTime}ms`);
            shipAssessment.workingFeatures.push('Good page load performance');
        }
        
        // Test 8: Error Handling
        console.log('\n🛡️ TEST 8: Error Handling');
        
        if (errors.length > 0) {
            shipAssessment.highPriority.push({
                id: 'HP004',
                title: 'JavaScript Errors Present',
                severity: 'HIGH',
                description: `${errors.length} JavaScript errors detected`,
                impact: 'Potential functionality breakdowns and poor user experience',
                errors: errors
            });
            console.log(`❌ ${errors.length} JavaScript errors found`);
        } else {
            console.log('✓ No JavaScript errors detected');
            shipAssessment.workingFeatures.push('No JavaScript errors');
        }
        
    } catch (error) {
        console.error(`💥 CRITICAL ERROR: ${error.message}`);
        shipAssessment.shipBlockers.push({
            id: 'SB999',
            title: 'Testing Framework Error',
            severity: 'CRITICAL',
            description: `Critical error during testing: ${error.message}`,
            impact: 'Cannot complete ship assessment'
        });
    }
    
    await browser.close();
    
    // Determine overall ship status
    if (shipAssessment.shipBlockers.length > 0) {
        shipAssessment.overallStatus = 'NO-GO';
        shipAssessment.shipRecommendation = `❌ CANNOT SHIP - ${shipAssessment.shipBlockers.length} critical issues must be resolved`;
    } else if (shipAssessment.highPriority.length > 3) {
        shipAssessment.overallStatus = 'CONDITIONAL';
        shipAssessment.shipRecommendation = `⚠️ CONDITIONAL SHIP - ${shipAssessment.highPriority.length} high-priority issues should be addressed`;
    } else {
        shipAssessment.overallStatus = 'GO';
        shipAssessment.shipRecommendation = `✅ READY TO SHIP - ${shipAssessment.workingFeatures.length} features working correctly`;
    }
    
    // Generate Final Report
    console.log('\n' + '='.repeat(80));
    console.log('🚢 FINAL SHIP READINESS ASSESSMENT');
    console.log('='.repeat(80));
    
    console.log(`\n📊 EXECUTIVE SUMMARY:`);
    console.log(`Overall Status: ${shipAssessment.overallStatus}`);
    console.log(`Ship Recommendation: ${shipAssessment.shipRecommendation}`);
    console.log(`Working Features: ${shipAssessment.workingFeatures.length}`);
    console.log(`Ship Blockers: ${shipAssessment.shipBlockers.length}`);
    console.log(`High Priority Issues: ${shipAssessment.highPriority.length}`);
    console.log(`Medium Priority Issues: ${shipAssessment.mediumPriority.length}`);
    
    if (shipAssessment.shipBlockers.length > 0) {
        console.log('\n🚫 CRITICAL SHIP BLOCKERS (MUST FIX):');
        shipAssessment.shipBlockers.forEach((bug, index) => {
            console.log(`\n${index + 1}. [${bug.id}] ${bug.title}`);
            console.log(`   Severity: ${bug.severity}`);
            console.log(`   Description: ${bug.description}`);
            console.log(`   Impact: ${bug.impact}`);
            console.log(`   Reproduction: ${bug.reproduction || 'See description'}`);
            if (bug.evidence) {
                console.log(`   Evidence: ${bug.evidence}`);
            }
        });
    }
    
    if (shipAssessment.highPriority.length > 0) {
        console.log('\n⚠️ HIGH PRIORITY ISSUES (SHOULD FIX):');
        shipAssessment.highPriority.forEach((bug, index) => {
            console.log(`\n${index + 1}. [${bug.id}] ${bug.title}`);
            console.log(`   Description: ${bug.description}`);
            console.log(`   Impact: ${bug.impact}`);
        });
    }
    
    if (shipAssessment.workingFeatures.length > 0) {
        console.log('\n✅ WORKING FEATURES:');
        shipAssessment.workingFeatures.forEach((feature, index) => {
            console.log(`${index + 1}. ${feature}`);
        });
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 SHIP DECISION & NEXT ACTIONS');
    console.log('='.repeat(80));
    
    if (shipAssessment.overallStatus === 'NO-GO') {
        console.log('❌ DECISION: DO NOT SHIP');
        console.log('\n🔧 REQUIRED ACTIONS:');
        shipAssessment.shipBlockers.forEach((bug, index) => {
            console.log(`${index + 1}. Fix ${bug.title} (${bug.id})`);
        });
        console.log('\n⏰ ESTIMATED FIX TIME: 2-6 hours depending on root cause complexity');
    } else if (shipAssessment.overallStatus === 'CONDITIONAL') {
        console.log('⚠️ DECISION: CONDITIONAL SHIP');
        console.log('Application can ship but user experience may be degraded');
        console.log('\n🎯 RECOMMENDED IMPROVEMENTS (if time permits):');
        shipAssessment.highPriority.forEach((bug, index) => {
            console.log(`${index + 1}. ${bug.title}`);
        });
    } else {
        console.log('✅ DECISION: READY TO SHIP');
        console.log('All critical functionality working - ship immediately!');
    }
    
    // Save detailed report
    const reportPath = 'ship-readiness-assessment.json';
    fs.writeFileSync(reportPath, JSON.stringify(shipAssessment, null, 2));
    console.log(`\n📄 Detailed assessment saved to: ${reportPath}`);
    
    return shipAssessment;
}

// Run the assessment
comprehensiveShipAssessment().catch(console.error);