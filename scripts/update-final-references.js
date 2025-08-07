#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  '.claude/agents/smartpack-ux-flow-optimizer.xml',
  'CLAUDE.xml',
  '.claude/agents/smartpack-visual-designer.xml',
  '.claude/agents/smartpack-ui-polish-specialist.xml',
  '.claude/agents/smartpack-mobile-ux-specialist.xml',
  '.claude/agents/smartpack-coordinator.xml',
  '.claude/agents/smartpack-code-fixer.xml',
  '.claude/agents/smartpack-bug-crusher.xml',
  '.claude/agents/smartpack-functional-validator.xml',
  '.claude/agents/smartpack-integration-fixer.xml',
  '.claude/agents/smartpack-context-extractor.xml',
  '.claude/agents/smartpack-performance-enhancer.xml',
  '.claude/agents/smartpack-architecture-analyzer.xml',
  '.claude/agents/smartpack-test-specialist.xml',
  '.claude/agents/smartpack-test-auditor.xml',
  '.claude/scratchpad.xml'
];

const replacements = [
  { from: /scratchpad\.md/g, to: 'scratchpad.xml' },
  { from: /ux-flow-optimizer\.md/g, to: 'ux-flow-optimizer.xml' },
  { from: /\.claude\\scratchpad\.md/g, to: '.claude\\scratchpad.xml' },
  { from: /\.claude\/scratchpad\.md/g, to: '.claude/scratchpad.xml' },
  { from: /C:\\\\Users\\\\Rachel\\\\Desktop\\\\SmartPack\\\\\.claude\\\\scratchpad\.md/g, 
    to: 'C:\\\\Users\\\\Rachel\\\\Desktop\\\\SmartPack\\\\.claude\\\\scratchpad.xml' }
];

console.log('📝 Updating references to XML files...\n');

let totalUpdates = 0;

for (const filePath of filesToUpdate) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let fileUpdates = 0;
  
  for (const replacement of replacements) {
    const matches = content.match(replacement.from);
    if (matches) {
      content = content.replace(replacement.from, replacement.to);
      fileUpdates += matches.length;
    }
  }
  
  if (fileUpdates > 0) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Updated ${filePath} (${fileUpdates} references)`);
    totalUpdates += fileUpdates;
  }
}

console.log(`\n✅ Total references updated: ${totalUpdates}`);