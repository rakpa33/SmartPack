#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Emoji regex pattern - comprehensive unicode range
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{1F1E0}-\u{1F1FF}]|✅|❌|⚠️|📊|📝|🔄|🧹|✨|🚀|💡|🎯|🔥|⭐|👉|💁|🟢|🔴|🟡|⚡|🛠️|📦|🎨|🐛|🔍|📱|⚙️|🏃|🔧|📈|📉|🎪|🎭|🎬|🎯|🎨|🎪/gu;

// Files to process
const patterns = [
  '**/*.md',
  '**/*.xml',
  '.claude/**/*.md',
  '.claude/**/*.xml'
];

// Files to exclude
const excludePatterns = [
  'node_modules/**',
  'SmartPack/node_modules/**',
  '.git/**',
  'scripts/**'
];

console.log('Removing emoji from documentation files...\n');

let totalFiles = 0;
let totalEmojis = 0;

// Get all files
const allFiles = [];
for (const pattern of patterns) {
  const files = glob.sync(pattern, { 
    cwd: process.cwd(),
    ignore: excludePatterns
  });
  allFiles.push(...files);
}

// Remove duplicates
const uniqueFiles = [...new Set(allFiles)];

for (const file of uniqueFiles) {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Count emojis
  const emojiMatches = content.match(emojiRegex);
  const emojiCount = emojiMatches ? emojiMatches.length : 0;
  
  if (emojiCount > 0) {
    // Remove emojis
    content = content.replace(emojiRegex, '');
    
    // Clean up extra spaces left by emoji removal
    content = content.replace(/\s+([.!?,;:])/g, '$1'); // Remove space before punctuation
    content = content.replace(/:\s*\n/g, ':\n'); // Clean up colons
    content = content.replace(/^\s*-\s*$/gm, '-'); // Clean up empty list items
    content = content.replace(/\[\s*\]/g, '[ ]'); // Fix checkbox formatting
    content = content.replace(/\s{2,}/g, ' '); // Remove multiple spaces
    
    // Save the file
    fs.writeFileSync(filePath, content, 'utf-8');
    
    console.log(`Cleaned ${file}: Removed ${emojiCount} emoji`);
    totalFiles++;
    totalEmojis += emojiCount;
  }
}

console.log(`\nSummary:`);
console.log(`Processed ${totalFiles} files`);
console.log(`Removed ${totalEmojis} total emoji`);
console.log('Documentation is now Claude Code compliant (no emoji)!');