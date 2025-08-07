#!/usr/bin/env node

/**
 * Safely delete markdown files that have XML equivalents
 * Verifies XML file exists and has content before deleting MD file
 */

const fs = require('fs');
const path = require('path');

// List of MD files to check and potentially delete
const filesToCheck = [
  // Root level
  'CLAUDE.xml',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  
  // Agent definitions
  '.claude/agents/smartpack-bug-crusher.xml',
  '.claude/agents/smartpack-code-fixer.xml',
  '.claude/agents/smartpack-coordinator.xml',
  '.claude/agents/smartpack-functional-validator.xml',
  '.claude/agents/smartpack-integration-fixer.xml',
  '.claude/agents/smartpack-mobile-ux-specialist.xml',
  '.claude/agents/smartpack-performance-enhancer.xml',
  '.claude/agents/smartpack-test-specialist.xml',
  '.claude/agents/smartpack-test-auditor.xml',
  '.claude/agents/smartpack-ui-polish-specialist.xml',
  '.claude/agents/smartpack-ux-flow-optimizer.md',
  '.claude/agents/smartpack-visual-designer.xml',
  '.claude/agents/smartpack-architecture-analyzer.xml',
  '.claude/agents/smartpack-context-extractor.xml',
  
  // Scratchpad
  '.claude/scratchpad.md',
  
  // Navigation files
  'SmartPack/CLAUDE.xml',
  'SmartPack/src/CLAUDE.xml',
  'SmartPack/src/components/CLAUDE.xml',
  'SmartPack/src/hooks/CLAUDE.xml',
  
  // Development docs
  'docs/development/DEVLOG.xml',
  'docs/development/TROUBLESHOOTING.md',
  'docs/development/DEPLOYMENT.md',
  'docs/development/ENVIRONMENT.md',
  'docs/development/ONBOARDING.md',
  'docs/development/ROADMAP.md',
  'docs/development/SECURITY.md',
  
  // Testing docs
  'docs/testing/TESTING_GUIDELINES.md',
  'docs/testing/TESTING_STANDARDS.md',
  'docs/testing/TEST_UTILITIES.md',
  
  // API docs
  'docs/api/API.md',
  
  // Worktree management
  '.claude/docs/worktree-management.md',
  '.claude/docs/worktree-management/WORKTREE_MANAGEMENT.md',
  '.claude/docs/worktree-management/WORKTREE_ENFORCEMENT.md',
  '.claude/docs/worktree-management/WORKTREE_CLEANUP_PROCESS.md',
  
  // Scratchpad management
  '.claude/docs/scratchpad-management/SCRATCHPAD_MANAGEMENT_RULES.md',
  '.claude/docs/scratchpad-management/scratchpad-protocol.md',
  
  // Context translation
  '.claude/docs/translate-context.md',
  
  // Active worktrees
  '.claude/active-worktrees/backend-investigation.md',
  '.claude/active-worktrees/backend-investigation-ux-validation.md',
  '.claude/active-worktrees/form-validation-fix.md',
  '.claude/active-worktrees/form-validation-fix-emergency.md',
  '.claude/active-worktrees/form-validation-fix-travel-mode-debug.md',
  '.claude/active-worktrees/form-validation-ux-test.md',
  '.claude/active-worktrees/loading-states-fix.md',
  '.claude/active-worktrees/touch-targets-fix.md',
  '.claude/active-worktrees/undefined-css-fix.md',
  '.claude/active-worktrees/ux-audit-2025-08-05.md',
  '.claude/active-worktrees/visual-design-audit-2025-08-05.md',
];

function verifyAndDelete() {
  console.log('🔍 Starting safe deletion of markdown files with XML equivalents...\n');
  
  let deleted = 0;
  let kept = 0;
  let errors = 0;
  
  const deletionLog = [];
  
  for (const mdFile of filesToCheck) {
    const mdPath = path.join(process.cwd(), mdFile);
    const xmlPath = mdPath.replace(/\.md$/, '.xml');
    
    // Check if MD file exists
    if (!fs.existsSync(mdPath)) {
      console.log(`⚠️  MD file not found: ${mdFile}`);
      continue;
    }
    
    // Check if XML equivalent exists
    if (!fs.existsSync(xmlPath)) {
      console.log(`❌ No XML equivalent for: ${mdFile} - KEEPING MD FILE`);
      kept++;
      continue;
    }
    
    // Verify XML file has content
    const xmlStats = fs.statSync(xmlPath);
    if (xmlStats.size === 0) {
      console.log(`❌ XML file is empty for: ${mdFile} - KEEPING MD FILE`);
      kept++;
      continue;
    }
    
    // Compare file sizes (XML should generally be larger due to tags)
    const mdStats = fs.statSync(mdPath);
    if (xmlStats.size < mdStats.size * 0.5) {
      console.log(`⚠️  XML file seems too small for: ${mdFile}`);
      console.log(`   MD: ${mdStats.size} bytes, XML: ${xmlStats.size} bytes`);
      console.log(`   KEEPING MD FILE for safety`);
      kept++;
      continue;
    }
    
    // Safe to delete MD file
    try {
      fs.unlinkSync(mdPath);
      console.log(`✅ Deleted: ${mdFile} (XML exists with ${xmlStats.size} bytes)`);
      deletionLog.push({
        file: mdFile,
        mdSize: mdStats.size,
        xmlSize: xmlStats.size
      });
      deleted++;
    } catch (error) {
      console.error(`❌ Error deleting ${mdFile}: ${error.message}`);
      errors++;
    }
  }
  
  // Write deletion log
  const logPath = path.join(process.cwd(), 'scripts', 'md-deletion-log.json');
  fs.writeFileSync(logPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    deleted: deleted,
    kept: kept,
    errors: errors,
    files: deletionLog
  }, null, 2));
  
  console.log('\n📊 Deletion Summary:');
  console.log(`✅ Deleted: ${deleted} MD files`);
  console.log(`📁 Kept: ${kept} MD files (no XML equivalent or safety concerns)`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`\n📝 Deletion log saved to: ${logPath}`);
}

// Run the verification and deletion
if (require.main === module) {
  verifyAndDelete();
}