#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'remaining-duplicates.json');

if (!fs.existsSync(dataFile)) {
  console.error('❌ No remaining-duplicates.json file found. Run find-remaining-duplicates.js first.');
  process.exit(1);
}

const { invalidDuplicates } = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

console.log('🗑️  Deleting broken/empty XML files...\n');

let deleted = 0;
let errors = 0;

for (const dup of invalidDuplicates) {
  const xmlPath = path.join(process.cwd(), dup.xml);
  
  try {
    // Double-check the file is small (likely empty)
    const stats = fs.statSync(xmlPath);
    if (stats.size < 200) {
      fs.unlinkSync(xmlPath);
      console.log(`✅ Deleted: ${dup.xml} (${stats.size} bytes)`);
      deleted++;
    } else {
      console.log(`⚠️  Skipped: ${dup.xml} (larger than expected: ${stats.size} bytes)`);
    }
  } catch (error) {
    console.error(`❌ Error deleting ${dup.xml}: ${error.message}`);
    errors++;
  }
}

console.log('\n📊 Summary:');
console.log(`✅ Deleted: ${deleted} broken XML files`);
console.log(`❌ Errors: ${errors}`);
console.log('\n✨ All broken XML files have been removed.');
console.log('📝 The original MD files remain intact.');