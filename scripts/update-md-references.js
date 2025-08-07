#!/usr/bin/env node

/**
 * Update references from .md to .xml for successfully converted files
 */

const fs = require('fs');
const path = require('path');

// Files that were successfully converted and deleted
const successfullyConverted = [
  'CLAUDE.md',
  '.claude/agents/smartpack-bug-crusher.md',
  '.claude/agents/smartpack-code-fixer.md',
  '.claude/agents/smartpack-coordinator.md',
  '.claude/agents/smartpack-functional-validator.md',
  '.claude/agents/smartpack-integration-fixer.md',
  '.claude/agents/smartpack-mobile-ux-specialist.md',
  '.claude/agents/smartpack-performance-enhancer.md',
  '.claude/agents/smartpack-test-specialist.md',
  '.claude/agents/smartpack-test-auditor.md',
  '.claude/agents/smartpack-ui-polish-specialist.md',
  '.claude/agents/smartpack-visual-designer.md',
  '.claude/agents/smartpack-architecture-analyzer.md',
  '.claude/agents/smartpack-context-extractor.md',
  'docs/development/DEVLOG.md'
];

// Convert to simple reference replacements
const replacements = successfullyConverted.map(file => ({
  from: file,
  to: file.replace(/\.md$/, '.xml')
}));

// Files to update references in
const filesToUpdate = [
  // Agent XML files
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
  '.claude/agents/smartpack-visual-designer.xml',
  '.claude/agents/smartpack-architecture-analyzer.xml',
  '.claude/agents/smartpack-context-extractor.xml',
  
  // Main XML files
  'CLAUDE.xml',
  '.claude/scratchpad.xml',
  'XML_USAGE_GUIDE.xml',
  
  // Scripts
  'scripts/batch-md-to-xml.js',
  'scripts/safe-delete-md-files.js',
  
  // Keep scratchpad.md since it wasn't successfully converted
  '.claude/scratchpad.md',
  '.claude/README.md'
];

function updateReferences() {
  console.log('📝 Updating references from .md to .xml...\n');
  
  let totalUpdates = 0;
  let filesUpdated = 0;
  
  for (const filePath of filesToUpdate) {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    let fileUpdates = 0;
    
    // Update references for successfully converted files
    for (const replacement of replacements) {
      // Match various reference patterns
      const patterns = [
        // Direct file references
        new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        // Path references like C:\\Users\\...\\CLAUDE.md
        new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\//g, '\\\\'), 'g'),
        // References with quotes
        new RegExp(`"${replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
        new RegExp(`'${replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
        // References in XML tags
        new RegExp(`>${replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`, 'g')
      ];
      
      for (const pattern of patterns) {
        const matches = content.match(pattern);
        if (matches) {
          // Replace with XML equivalent
          if (pattern.source.includes('"')) {
            content = content.replace(pattern, `"${replacement.to}"`);
          } else if (pattern.source.includes("'")) {
            content = content.replace(pattern, `'${replacement.to}'`);
          } else if (pattern.source.includes('>') && pattern.source.includes('<')) {
            content = content.replace(pattern, `>${replacement.to}<`);
          } else {
            content = content.replace(pattern, replacement.to);
          }
          fileUpdates += matches.length;
        }
      }
    }
    
    // Special case for DEVLOG references
    content = content.replace(/DEVLOG\.md/g, 'DEVLOG.xml');
    content = content.replace(/docs\/development\/DEVLOG\.md/g, 'docs/development/DEVLOG.xml');
    
    // Special case for CLAUDE.md root references
    content = content.replace(/Update CLAUDE\.md/g, 'Update CLAUDE.xml');
    content = content.replace(/preserve in CLAUDE\.md/g, 'preserve in CLAUDE.xml');
    
    if (fileUpdates > 0) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`✅ Updated ${filePath} (${fileUpdates} references)`);
      filesUpdated++;
      totalUpdates += fileUpdates;
    }
  }
  
  console.log('\n📊 Update Summary:');
  console.log(`✅ Files updated: ${filesUpdated}`);
  console.log(`✅ Total references updated: ${totalUpdates}`);
}

// Run the update
if (require.main === module) {
  updateReferences();
}