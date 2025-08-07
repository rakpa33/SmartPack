#!/usr/bin/env node

/**
 * Convert active worktree markdown files to XML
 */

const fs = require('fs');
const path = require('path');
const MarkdownToXmlConverter = require('./md-to-xml-converter');

const converter = new MarkdownToXmlConverter();

const worktreeDir = path.join(process.cwd(), '.claude/active-worktrees');

// Get all markdown files in the worktree directory
const files = fs.readdirSync(worktreeDir).filter(file => file.endsWith('.md'));

console.log(`🚀 Converting ${files.length} worktree files to XML...\n`);

let successful = 0;
let skipped = 0;

files.forEach(file => {
  const srcPath = path.join(worktreeDir, file);
  const destPath = path.join(worktreeDir, file.replace('.md', '.xml'));
  
  if (fs.existsSync(destPath)) {
    console.log(`⚠️  Skipping ${file} - XML already exists`);
    skipped++;
    return;
  }
  
  try {
    converter.convertMarkdownToXml(srcPath, destPath);
    successful++;
  } catch (error) {
    console.error(`❌ Error converting ${file}: ${error.message}`);
  }
});

console.log(`\n✅ Successfully converted: ${successful} files`);
console.log(`⚠️  Skipped: ${skipped} files`);