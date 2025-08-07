#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function findFiles(dir, pattern, results = []) {
  if (!fs.existsSync(dir)) return results;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.git') && file !== 'node_modules') {
      findFiles(fullPath, pattern, results);
    } else if (stat.isFile() && file.endsWith(pattern)) {
      results.push(fullPath);
    }
  }
  
  return results;
}

console.log('🔍 Finding remaining MD files with XML equivalents...\n');

const rootDir = process.cwd();
const mdFiles = findFiles(rootDir, '.md');
const duplicates = [];

for (const mdFile of mdFiles) {
  const xmlFile = mdFile.replace(/\.md$/, '.xml');
  
  if (fs.existsSync(xmlFile)) {
    const mdStats = fs.statSync(mdFile);
    const xmlStats = fs.statSync(xmlFile);
    
    duplicates.push({
      md: mdFile.replace(rootDir + path.sep, ''),
      xml: xmlFile.replace(rootDir + path.sep, ''),
      mdSize: mdStats.size,
      xmlSize: xmlStats.size,
      xmlValid: xmlStats.size > mdStats.size * 0.5
    });
  }
}

if (duplicates.length === 0) {
  console.log('✅ No duplicate MD/XML files found!');
} else {
  console.log(`Found ${duplicates.length} MD files with XML equivalents:\n`);
  
  const validDuplicates = duplicates.filter(d => d.xmlValid);
  const invalidDuplicates = duplicates.filter(d => !d.xmlValid);
  
  if (validDuplicates.length > 0) {
    console.log('📁 MD files that can be safely deleted (valid XML exists):');
    for (const dup of validDuplicates) {
      console.log(`  - ${dup.md}`);
      console.log(`    MD: ${dup.mdSize} bytes, XML: ${dup.xmlSize} bytes`);
    }
  }
  
  if (invalidDuplicates.length > 0) {
    console.log('\n⚠️  MD files that should NOT be deleted (XML too small or invalid):');
    for (const dup of invalidDuplicates) {
      console.log(`  - ${dup.md}`);
      console.log(`    MD: ${dup.mdSize} bytes, XML: ${dup.xmlSize} bytes (TOO SMALL)`);
    }
  }
  
  // Save results for further processing
  fs.writeFileSync(
    path.join(rootDir, 'scripts', 'remaining-duplicates.json'),
    JSON.stringify({ validDuplicates, invalidDuplicates }, null, 2)
  );
  
  console.log('\n📝 Results saved to scripts/remaining-duplicates.json');
}