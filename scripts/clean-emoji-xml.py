#!/usr/bin/env python3

import re
import glob
import sys

emoji_pattern = re.compile(r'[\U0001F300-\U0001F9FF\U0001FA70-\U0001FAFF\U00002600-\U000027BF\U0001F1E0-\U0001F1FF✅❌⚠️📊📝🔄🧹✨🚀💡🎯🔥⭐👉💁🟢🔴🟡⚡🛠️📦🎨🐛🔍📱⚙️🏃🔧📈📉🎪🎭🎬🤖]+')

files_with_emoji = [
    './.claude/agents/smartpack-context-extractor.xml',
    './.claude/agents/smartpack-functional-validator.xml',
    './.claude/agents/smartpack-test-auditor.xml',
    './.claude/agents/smartpack-test-specialist.xml',
    './docs/development/DEVLOG.xml',
    './SmartPack/playwright-results.xml'
]

emoji_count = 0
files_cleaned = 0

for filepath in files_with_emoji:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        matches = emoji_pattern.findall(content)
        content = emoji_pattern.sub('', content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            count = len(''.join(matches))
            emoji_count += count
            files_cleaned += 1
            print(f'Removed {count} emoji from: {filepath}')
        else:
            print(f'No emoji found in: {filepath}')
    except Exception as e:
        print(f'Error processing {filepath}: {e}')

print(f'\nSummary:')
print(f'Files cleaned: {files_cleaned}')
print(f'Total emoji removed: {emoji_count}')
print(f'Documentation is now Claude Code compliant!')