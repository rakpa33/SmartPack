#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of MD files to delete after successful XML conversion
const mdFilesToDelete = [
  '.claude/agents/detailed-descriptions.md',
  '.claude/agents/smartpack-integrity-auditor.md',
  '.claude/docs/scratchpad-management/SCRATCHPAD_MANAGEMENT_RULES.md',
  '.claude/docs/scratchpad-management/SCRATCHPAD_SOLUTION_SUMMARY.md',
  '.claude/docs/scratchpad-management/scratchpad-evaluation-template.md',
  '.claude/docs/scratchpad-management/scratchpad-protocol.md',
  '.claude/docs/TEMP_FILE_MANAGEMENT_SUMMARY.md',
  '.claude/docs/translate-context.md',
  '.claude/docs/worktree-management.md',
  '.claude/docs/worktree-management/test-worktree-workflow.md',
  '.claude/docs/worktree-management/WORKTREE_CLEANUP_PROCESS.md',
  '.claude/docs/worktree-management/WORKTREE_ENFORCEMENT.md',
  '.claude/docs/worktree-management/WORKTREE_ENFORCEMENT_SUMMARY.md',
  '.claude/docs/worktree-management/WORKTREE_MANAGEMENT.md',
  '.claude/docs/worktree-management/WORKTREE_MONITORING_GUIDE.md'
];

console.log('🧹 Cleaning up MD files after successful XML conversion...\n');

let deleted = 0;
let failed = 0;

for (const mdFile of mdFilesToDelete) {
  const mdPath = path.join(process.cwd(), mdFile);
  const xmlPath = mdPath.replace(/\.md$/, '.xml');
  
  // Check if XML file exists
  if (!fs.existsSync(xmlPath)) {
    console.error(`❌ Skipping ${mdFile} - XML file not found`);
    failed++;
    continue;
  }
  
  // Check XML file has content
  const xmlStats = fs.statSync(xmlPath);
  if (xmlStats.size < 500) {
    console.error(`❌ Skipping ${mdFile} - XML file too small (${xmlStats.size} bytes)`);
    failed++;
    continue;
  }
  
  // Delete MD file
  try {
    if (fs.existsSync(mdPath)) {
      fs.unlinkSync(mdPath);
      console.log(`✅ Deleted: ${mdFile}`);
      deleted++;
    } else {
      console.log(`⚠️  Already deleted: ${mdFile}`);
    }
  } catch (error) {
    console.error(`❌ Failed to delete ${mdFile}: ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Cleanup Summary:`);
console.log(`✅ Deleted: ${deleted} MD files`);
console.log(`❌ Failed/Skipped: ${failed} files`);

if (deleted > 0) {
  console.log('\n✨ MD to XML conversion complete! All .claude files are now in XML format.');
}