#!/usr/bin/env node

/**
 * Batch Markdown to XML Converter
 * Converts all markdown files in the project to XML format
 */

const fs = require('fs');
const path = require('path');
const MarkdownToXmlConverter = require('./md-to-xml-converter');

const converter = new MarkdownToXmlConverter();

// Define conversion mappings
const conversionMap = [
  // Root level files
  { src: 'CLAUDE.xml', dest: 'CLAUDE.xml', type: 'project' },
  { src: 'CONTRIBUTING.md', dest: 'CONTRIBUTING.xml', type: 'doc' },
  { src: 'CHANGELOG.md', dest: 'CHANGELOG.xml', type: 'doc' },
  
  // Agent definitions
  { src: '.claude/agents/smartpack-bug-crusher.xml', dest: '.claude/agents/smartpack-bug-crusher.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-code-fixer.xml', dest: '.claude/agents/smartpack-code-fixer.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-coordinator.xml', dest: '.claude/agents/smartpack-coordinator.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-functional-validator.xml', dest: '.claude/agents/smartpack-functional-validator.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-integration-fixer.xml', dest: '.claude/agents/smartpack-integration-fixer.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-mobile-ux-specialist.xml', dest: '.claude/agents/smartpack-mobile-ux-specialist.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-performance-enhancer.xml', dest: '.claude/agents/smartpack-performance-enhancer.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-test-specialist.xml', dest: '.claude/agents/smartpack-test-specialist.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-test-auditor.xml', dest: '.claude/agents/smartpack-test-auditor.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-ui-polish-specialist.xml', dest: '.claude/agents/smartpack-ui-polish-specialist.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-ux-flow-optimizer.md', dest: '.claude/agents/smartpack-ux-flow-optimizer.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-visual-designer.xml', dest: '.claude/agents/smartpack-visual-designer.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-architecture-analyzer.xml', dest: '.claude/agents/smartpack-architecture-analyzer.xml', type: 'agent' },
  { src: '.claude/agents/smartpack-context-extractor.xml', dest: '.claude/agents/smartpack-context-extractor.xml', type: 'agent' },
  
  // Scratchpad
  { src: '.claude/scratchpad.md', dest: '.claude/scratchpad.xml', type: 'scratchpad' },
  
  // Navigation files
  { src: 'SmartPack/CLAUDE.xml', dest: 'SmartPack/CLAUDE.xml', type: 'navigation' },
  { src: 'SmartPack/src/CLAUDE.xml', dest: 'SmartPack/src/CLAUDE.xml', type: 'navigation' },
  { src: 'SmartPack/src/components/CLAUDE.xml', dest: 'SmartPack/src/components/CLAUDE.xml', type: 'navigation' },
  { src: 'SmartPack/src/hooks/CLAUDE.xml', dest: 'SmartPack/src/hooks/CLAUDE.xml', type: 'navigation' },
  
  // Development documentation
  { src: 'docs/development/DEVLOG.xml', dest: 'docs/development/DEVLOG.xml', type: 'doc' },
  { src: 'docs/development/TROUBLESHOOTING.md', dest: 'docs/development/TROUBLESHOOTING.xml', type: 'doc' },
  { src: 'docs/development/DEPLOYMENT.md', dest: 'docs/development/DEPLOYMENT.xml', type: 'doc' },
  { src: 'docs/development/ENVIRONMENT.md', dest: 'docs/development/ENVIRONMENT.xml', type: 'doc' },
  { src: 'docs/development/ONBOARDING.md', dest: 'docs/development/ONBOARDING.xml', type: 'doc' },
  { src: 'docs/development/ROADMAP.md', dest: 'docs/development/ROADMAP.xml', type: 'doc' },
  { src: 'docs/development/SECURITY.md', dest: 'docs/development/SECURITY.xml', type: 'doc' },
  
  // Testing documentation
  { src: 'docs/testing/TESTING_GUIDELINES.md', dest: 'docs/testing/TESTING_GUIDELINES.xml', type: 'doc' },
  { src: 'docs/testing/TESTING_STANDARDS.md', dest: 'docs/testing/TESTING_STANDARDS.xml', type: 'doc' },
  { src: 'docs/testing/TEST_UTILITIES.md', dest: 'docs/testing/TEST_UTILITIES.xml', type: 'doc' },
  
  // API documentation
  { src: 'docs/api/API.md', dest: 'docs/api/API.xml', type: 'doc' },
  
  // Worktree management docs
  { src: '.claude/docs/worktree-management.md', dest: '.claude/docs/worktree-management.xml', type: 'doc' },
  { src: '.claude/docs/worktree-management/WORKTREE_MANAGEMENT.md', dest: '.claude/docs/worktree-management/WORKTREE_MANAGEMENT.xml', type: 'doc' },
  { src: '.claude/docs/worktree-management/WORKTREE_ENFORCEMENT.md', dest: '.claude/docs/worktree-management/WORKTREE_ENFORCEMENT.xml', type: 'doc' },
  { src: '.claude/docs/worktree-management/WORKTREE_CLEANUP_PROCESS.md', dest: '.claude/docs/worktree-management/WORKTREE_CLEANUP_PROCESS.xml', type: 'doc' },
  
  // Scratchpad management docs
  { src: '.claude/docs/scratchpad-management/SCRATCHPAD_MANAGEMENT_RULES.md', dest: '.claude/docs/scratchpad-management/SCRATCHPAD_MANAGEMENT_RULES.xml', type: 'doc' },
  { src: '.claude/docs/scratchpad-management/scratchpad-protocol.md', dest: '.claude/docs/scratchpad-management/scratchpad-protocol.xml', type: 'doc' },
  
  // Context translation
  { src: '.claude/docs/translate-context.md', dest: '.claude/docs/translate-context.xml', type: 'doc' },
];

function convertFile(mapping) {
  const srcPath = path.join(process.cwd(), mapping.src);
  const destPath = path.join(process.cwd(), mapping.dest);
  
  // Check if source file exists
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  Skipping ${mapping.src} - file not found`);
    return false;
  }
  
  // Check if destination already exists
  if (fs.existsSync(destPath)) {
    console.log(`⚠️  Skipping ${mapping.src} - XML already exists`);
    return false;
  }
  
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Convert based on type
    if (mapping.type === 'agent') {
      converter.convertAgentDefinition(srcPath, destPath);
    } else {
      converter.convertMarkdownToXml(srcPath, destPath);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error converting ${mapping.src}: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting batch markdown to XML conversion...\n');
  
  let successful = 0;
  let skipped = 0;
  let failed = 0;
  
  for (const mapping of conversionMap) {
    const result = convertFile(mapping);
    if (result === true) {
      successful++;
    } else if (result === false) {
      skipped++;
    } else {
      failed++;
    }
  }
  
  console.log('\n📊 Conversion Summary:');
  console.log(`✅ Successfully converted: ${successful} files`);
  console.log(`⚠️  Skipped: ${skipped} files`);
  console.log(`❌ Failed: ${failed} files`);
  
  if (successful > 0) {
    console.log('\n✨ XML files created successfully!');
    console.log('📝 Remember to update any references in your codebase to use the new XML files.');
  }
}

// Run the conversion
if (require.main === module) {
  main();
}