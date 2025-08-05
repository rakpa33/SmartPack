#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create temp directory for test artifacts
const tempDir = path.join(__dirname, '..', 'temp-test-artifacts');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Files to move to temp directory
const testArtifacts = [
  'comprehensive-ship-assessment.js',
  'critical-bug-analysis.js',
  'critical-bug-report.json',
  'debug-blur-issue.cjs',
  'osaka-geocoding-test.js',
  'osaka-test-after-blur.png',
  'osaka-test-before-blur.png',
  'osaka-test-initial.png',
  'ship-readiness-assessment.json',
  'accurate-functional-validation.js',
  'accurate-ship-blocker-analysis.js',
  'check-localStorage-settings.js',
  'comprehensive-ship-blocker-analysis.js',
  'debug-column-visibility.js',
  'debug-geocode-osaka.js',
  'debug-validation.js',
  'destination-test-cases.js',
  'final-ship-assessment.js',
  'final-ship-validation.js',
  'functional-validation-test.js',
  'manual-test-simple.js',
  'manual-validation.js',
  'quick-manual-validation.js',
  'test-validation.js',
  'use-agents-helper.js',
  'current-app-state.html',
  'current-state.png',
  'geocoding-function-validation.png',
  'geocoding-validation-evidence.png',
  'osaka-test-1-initial.png',
  'osaka-test-3-before-blur.png',
  'osaka-test-4-after-blur.png'
];

console.log('Moving test artifacts to temp directory...\n');

testArtifacts.forEach(file => {
  const sourcePath = path.join(__dirname, '..', 'SmartPack', file);
  const destPath = path.join(tempDir, file);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`✓ Moved: ${file}`);
    } catch (error) {
      console.error(`✗ Failed to move ${file}: ${error.message}`);
    }
  }
});

// Move test-osaka.js from root
const rootTestFile = path.join(__dirname, '..', 'test-osaka.js');
if (fs.existsSync(rootTestFile)) {
  try {
    fs.renameSync(rootTestFile, path.join(tempDir, 'test-osaka.js'));
    console.log('✓ Moved: test-osaka.js from root');
  } catch (error) {
    console.error(`✗ Failed to move test-osaka.js: ${error.message}`);
  }
}

console.log(`\nTest artifacts moved to: ${tempDir}`);
console.log('You can safely delete this directory when no longer needed.');