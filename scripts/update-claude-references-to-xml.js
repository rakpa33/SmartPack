#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files to update references in
const filesToUpdate = [
  '.claude/**/*.xml',
  'CLAUDE.xml',
  'docs/**/*.xml',
  'SmartPack/CLAUDE.xml',
  'SmartPack/src/CLAUDE.xml',
  'SmartPack/src/components/CLAUDE.xml',
  'SmartPack/src/hooks/CLAUDE.xml'
];

console.log('🔄 Updating references from .md to .xml in .claude files...\n');

let totalUpdates = 0;
let filesModified = 0;

// Get all files to process
const allFiles = [];
for (const pattern of filesToUpdate) {
  const files = glob.sync(pattern, { cwd: process.cwd() });
  allFiles.push(...files);
}

// Process each file
for (const file of allFiles) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Update references to .claude MD files
  const patterns = [
    // .claude/scratchpad.md -> .claude/scratchpad.xml
    /\.claude\/scratchpad\.md/g,
    // .claude/agents/*.md -> .claude/agents/*.xml
    /\.claude\/agents\/([a-z-]+)\.md/g,
    // .claude/docs/*.md -> .claude/docs/*.xml
    /\.claude\/docs\/([a-zA-Z\/_-]+)\.md/g,
    // .claude/active-worktrees/*.md (keep as MD - these are temp files)
    // Don't change these
  ];
  
  let updates = 0;
  
  // Update scratchpad references
  const scratchpadMatches = content.match(/\.claude\/scratchpad\.md/g);
  if (scratchpadMatches) {
    content = content.replace(/\.claude\/scratchpad\.md/g, '.claude/scratchpad.xml');
    updates += scratchpadMatches.length;
  }
  
  // Update agent references
  const agentMatches = content.match(/\.claude\/agents\/([a-z-]+)\.md/g);
  if (agentMatches) {
    content = content.replace(/\.claude\/agents\/([a-z-]+)\.md/g, '.claude/agents/$1.xml');
    updates += agentMatches.length;
  }
  
  // Update docs references
  const docsMatches = content.match(/\.claude\/docs\/([a-zA-Z\/_-]+)\.md/g);
  if (docsMatches) {
    content = content.replace(/\.claude\/docs\/([a-zA-Z\/_-]+)\.md/g, '.claude/docs/$1.xml');
    updates += docsMatches.length;
  }
  
  // Save if modified
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated ${updates} references in: ${file}`);
    totalUpdates += updates;
    filesModified++;
  }
}

console.log(`\n📊 Update Summary:`);
console.log(`✅ Updated ${totalUpdates} references across ${filesModified} files`);

if (totalUpdates > 0) {
  console.log('\n✨ All references to .claude MD files have been updated to XML!');
}