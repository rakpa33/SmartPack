#!/usr/bin/env node
/**
 * Cleanup Script for SmartPack Test Files
 * Removes temporary test files and screenshots from root directory
 * Moves them to appropriate test-results subdirectories
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, stat, rename, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// File patterns that should not be in root directory
const PATTERNS_TO_MOVE = [
  { pattern: /.*validation.*\.js$/, dest: 'manual' },
  { pattern: /^debug-.*\.js$/, dest: 'manual' },
  { pattern: /^test-.*\.js$/, dest: 'manual' },
  { pattern: /^manual-.*\.js$/, dest: 'manual' },
  { pattern: /.*ship.*\.js$/, dest: 'manual' },
  { pattern: /.*osaka.*\.js$/, dest: 'manual' },
  { pattern: /\.png$/, dest: 'screenshots' },
  { pattern: /^current-.*\.html$/, dest: 'manual' },
  { pattern: /.*results\.xml$/, dest: 'playwright' },
  { pattern: /.*validation.*\.md$/, dest: 'manual' },
  { pattern: /.*\.log$/, dest: 'logs' }
];

// Directories to create in test-results
const TEST_RESULT_DIRS = [
  'playwright',
  'playwright/html-report',
  'vitest',
  'vitest/coverage',
  'screenshots',
  'manual',
  'logs'
];

async function ensureTestResultsDirectories() {
  const testResultsDir = join(rootDir, 'test-results');
  
  if (!existsSync(testResultsDir)) {
    await mkdir(testResultsDir);
    console.log('✅ Created test-results directory');
  }
  
  for (const dir of TEST_RESULT_DIRS) {
    const fullPath = join(testResultsDir, dir);
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
      console.log(`✅ Created test-results/${dir}`);
    }
  }
}

async function cleanupRootFiles() {
  console.log('🧹 Scanning root directory for misplaced test files...\n');
  
  const files = await readdir(rootDir);
  let movedCount = 0;
  
  for (const file of files) {
    const filePath = join(rootDir, file);
    const fileStat = await stat(filePath);
    
    // Skip directories
    if (fileStat.isDirectory()) continue;
    
    // Check if file matches any pattern to move
    for (const { pattern, dest } of PATTERNS_TO_MOVE) {
      if (pattern.test(file)) {
        const destDir = join(rootDir, 'test-results', dest);
        const destPath = join(destDir, file);
        
        try {
          await rename(filePath, destPath);
          console.log(`📦 Moved ${file} → test-results/${dest}/`);
          movedCount++;
          break;
        } catch (error) {
          console.warn(`⚠️  Could not move ${file}: ${error.message}`);
        }
      }
    }
  }
  
  return movedCount;
}

async function main() {
  try {
    console.log('🧹 SmartPack Test File Cleanup\n');
    
    // Ensure test-results directory structure exists
    await ensureTestResultsDirectories();
    
    // Move misplaced files
    const movedCount = await cleanupRootFiles();
    
    console.log(`\n✅ Cleanup complete! Moved ${movedCount} files to proper directories.`);
    
    if (movedCount === 0) {
      console.log('🎉 Root directory is already clean!');
    } else {
      console.log('\n📁 Files are now organized in:');
      console.log('   • test-results/manual/     - Manual test scripts and validation files');
      console.log('   • test-results/screenshots/ - Test screenshots and images');
      console.log('   • test-results/playwright/  - Playwright test outputs');
      console.log('   • test-results/logs/        - Debug and server logs');
    }
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

// Run cleanup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { cleanupRootFiles, ensureTestResultsDirectories };