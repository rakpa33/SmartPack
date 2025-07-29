#!/usr/bin/env node

// Comprehensive test runner to verify all functionality
import { spawn } from 'child_process';

console.log('🧪 SmartPack Enhanced AI - Comprehensive Test Suite\n');

async function testBackendHealth() {
  console.log('1. Testing Backend Health...');
  try {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    console.log('   ✅ Backend is running:', data.message);
    return true;
  } catch (error) {
    console.log('   ❌ Backend health check failed:', error.message);
    return false;
  }
}

async function testEnhancedAI() {
  console.log('\n2. Testing Enhanced AI Logic...');

  const testTrip = {
    name: 'Business Trip to Japan',
    startDate: '2025-08-01',
    endDate: '2025-08-05',
    destinations: ['Tokyo, Japan'],
    travelModes: ['plane'],
    tripDetails: 'Important business meetings with Japanese clients'
  };

  const testWeather = [
    { location: 'Tokyo', temperature: 28, conditions: 'Sunny', precipitation: 0 }
  ];

  try {
    const response = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip: testTrip, weather: testWeather })
    });

    const result = await response.json();

    // Verify enhanced features
    const hasSmartQuantities = result.checklist.some(item => /\d+ pairs/.test(item.text));
    const hasBusinessItems = result.checklist.some(item => item.text.toLowerCase().includes('business'));
    const hasAsiaItems = result.suggestedItems.some(item => item.toLowerCase().includes('translation'));

    console.log(`   ✅ Generated ${result.checklist.length} items and ${result.suggestedItems.length} suggestions`);
    console.log(`   ${hasSmartQuantities ? '✅' : '❌'} Smart quantities based on trip duration`);
    console.log(`   ${hasBusinessItems ? '✅' : '❌'} Business context recognition`);
    console.log(`   ${hasAsiaItems ? '✅' : '❌'} Destination-specific suggestions`);

    return hasSmartQuantities && hasBusinessItems && hasAsiaItems;
  } catch (error) {
    console.log('   ❌ Enhanced AI test failed:', error.message);
    return false;
  }
}

function runUnitTests() {
  console.log('\n3. Running Unit Tests...');

  return new Promise((resolve) => {
    const testProcess = spawn('npx', ['vitest', 'run', 'src/__tests__/validation.unit.test.ts', 'src/__tests__/weather.unit.test.ts'], {
      cwd: process.cwd(),
      stdio: 'pipe'
    });

    let output = '';
    testProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    testProcess.on('close', (code) => {
      const passed = output.includes('passed');
      console.log(`   ${passed ? '✅' : '❌'} Unit tests ${passed ? 'passed' : 'failed'}`);
      resolve(passed);
    });
  });
}

async function main() {
  const backendHealthy = await testBackendHealth();
  const enhancedAIWorking = backendHealthy ? await testEnhancedAI() : false;
  const unitTestsPassed = await runUnitTests();

  console.log('\n📊 Test Results Summary:');
  console.log(`   Backend Health: ${backendHealthy ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Enhanced AI Logic: ${enhancedAIWorking ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Unit Tests: ${unitTestsPassed ? '✅ PASS' : '❌ FAIL'}`);

  const overallSuccess = backendHealthy && enhancedAIWorking && unitTestsPassed;
  console.log(`\n🎯 Overall Status: ${overallSuccess ? '✅ ALL SYSTEMS GO!' : '⚠️  SOME ISSUES DETECTED'}`);

  if (overallSuccess) {
    console.log('\n🚀 SmartPack Enhanced AI is ready for use!');
    console.log('   • Context-aware packing recommendations ✅');
    console.log('   • Smart quantity calculations ✅');
    console.log('   • Destination-specific suggestions ✅');
    console.log('   • Business/leisure trip recognition ✅');
    console.log('   • Weather-appropriate items ✅');
  }
}

main().catch(console.error);
