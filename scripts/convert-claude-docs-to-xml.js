#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ClaudeDocsXmlConverter {
  constructor() {
    this.crossReferences = new Map();
  }

  // Parse markdown content into structured sections
  parseMarkdown(content, filePath) {
    const lines = content.split('\n');
    const fileName = path.basename(filePath, '.md');
    const category = this.determineCategory(filePath);
    
    const doc = {
      id: this.generateId(fileName),
      type: category,
      title: this.extractTitle(lines),
      sections: [],
      metadata: this.extractMetadata(lines),
      references: []
    };

    let currentSection = null;
    let currentContent = [];
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Handle code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        currentContent.push(line);
        continue;
      }

      if (inCodeBlock) {
        currentContent.push(line);
        continue;
      }

      // Check for headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          currentSection.content = this.processContent(currentContent.join('\n'));
          doc.sections.push(currentSection);
        }

        const level = headerMatch[1].length;
        const title = headerMatch[2];
        
        currentSection = {
          level,
          title,
          id: this.generateId(title),
          content: '',
          subsections: []
        };
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Save last section
    if (currentSection) {
      currentSection.content = this.processContent(currentContent.join('\n'));
      doc.sections.push(currentSection);
    }

    // Extract cross-references
    doc.references = this.extractReferences(content);
    
    return doc;
  }

  determineCategory(filePath) {
    if (filePath.includes('agents')) {
      if (filePath.includes('integrity-auditor')) return 'agent-auditor';
      if (filePath.includes('detailed-descriptions')) return 'agent-descriptions';
      return 'agent';
    }
    if (filePath.includes('scratchpad')) return 'scratchpad-management';
    if (filePath.includes('worktree')) return 'worktree-management';
    if (filePath.includes('translate-context')) return 'context-management';
    return 'documentation';
  }

  extractTitle(lines) {
    for (const line of lines) {
      if (line.startsWith('# ')) {
        return line.substring(2).trim();
      }
    }
    return 'Untitled Document';
  }

  extractMetadata(lines) {
    const metadata = {};
    
    // Look for YAML frontmatter or metadata patterns
    for (const line of lines) {
      if (line.includes('**Agent ID**:')) {
        metadata.agentId = line.split(':')[1].trim();
      }
      if (line.includes('**Specialization**:')) {
        metadata.specialization = line.split(':')[1].trim();
      }
      if (line.includes('**Priority**:')) {
        metadata.priority = line.split(':')[1].trim();
      }
      if (line.includes('**Status**:')) {
        metadata.status = line.split(':')[1].trim();
      }
    }
    
    return metadata;
  }

  processContent(content) {
    // Process lists, code blocks, and other markdown elements
    const processed = {
      text: '',
      lists: [],
      codeBlocks: [],
      tables: []
    };

    const lines = content.split('\n');
    let currentList = null;
    let inCodeBlock = false;
    let currentCodeBlock = null;

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          currentCodeBlock = { 
            language: line.substring(3).trim(),
            code: []
          };
          inCodeBlock = true;
        } else {
          processed.codeBlocks.push(currentCodeBlock);
          currentCodeBlock = null;
          inCodeBlock = false;
        }
        continue;
      }

      if (inCodeBlock) {
        currentCodeBlock.code.push(line);
        continue;
      }

      // Process lists
      const listMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
      if (listMatch) {
        const indent = listMatch[1].length;
        const text = listMatch[2];
        
        if (!currentList || currentList.indent !== indent) {
          if (currentList) processed.lists.push(currentList);
          currentList = { indent, items: [] };
        }
        
        currentList.items.push(this.parseListItem(text));
      } else if (currentList && line.trim() === '') {
        processed.lists.push(currentList);
        currentList = null;
      } else {
        if (currentList) {
          processed.lists.push(currentList);
          currentList = null;
        }
        processed.text += line + '\n';
      }
    }

    if (currentList) processed.lists.push(currentList);
    
    return processed;
  }

  parseListItem(text) {
    // Parse bold items and nested content
    const boldMatch = text.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/);
    if (boldMatch) {
      return {
        name: boldMatch[1],
        description: boldMatch[2],
        id: this.generateId(boldMatch[1])
      };
    }
    return { text };
  }

  extractReferences(content) {
    const references = [];
    
    // Find references to other files
    const fileRefs = content.matchAll(/([.\/\w-]+)\.(md|xml)/g);
    for (const match of fileRefs) {
      const fileName = match[1];
      if (fileName.includes('claude') || fileName.includes('CLAUDE')) {
        references.push({
          type: 'file',
          target: `${fileName}.xml`,
          id: this.generateId(fileName)
        });
      }
    }

    // Find agent references
    const agentRefs = content.matchAll(/smartpack-[\w-]+/g);
    for (const match of agentRefs) {
      references.push({
        type: 'agent',
        target: `${match[0]}.xml`,
        id: match[0]
      });
    }

    // Deduplicate
    const unique = [];
    const seen = new Set();
    for (const ref of references) {
      const key = `${ref.type}:${ref.target}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(ref);
      }
    }

    return unique;
  }

  generateId(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Convert parsed document to XML
  toXml(doc) {
    const xml = [];
    
    xml.push('<?xml version="1.0" encoding="UTF-8"?>');
    xml.push(`<document id="${doc.id}" type="${doc.type}" version="1.0" last-updated="${new Date().toISOString().split('T')[0]}">`);
    
    // Add metadata
    if (Object.keys(doc.metadata).length > 0) {
      xml.push('  <metadata>');
      for (const [key, value] of Object.entries(doc.metadata)) {
        xml.push(`    <${key}>${this.escapeXml(value)}</${key}>`);
      }
      xml.push('  </metadata>');
    }

    // Add title
    xml.push(`  <title>${this.escapeXml(doc.title)}</title>`);

    // Add document type description
    xml.push('  <document-info>');
    xml.push(`    <type>${doc.type}</type>`);
    xml.push('    <parsing-instructions>');
    xml.push('      <instruction>Use section tags to navigate document structure</instruction>');
    xml.push('      <instruction>Check cross-references for related documents</instruction>');
    xml.push('      <instruction>Code blocks contain executable examples</instruction>');
    xml.push('      <instruction>Lists contain actionable items or requirements</instruction>');
    xml.push('    </parsing-instructions>');
    xml.push('  </document-info>');

    // Add cross-references
    if (doc.references.length > 0) {
      xml.push('  <cross-references>');
      for (const ref of doc.references) {
        xml.push(`    <reference type="${ref.type}" target="${ref.target}" id="${ref.id}"/>`);
      }
      xml.push('  </cross-references>');
    }

    // Add sections
    xml.push('  <content>');
    for (const section of doc.sections) {
      xml.push(...this.sectionToXml(section, 2));
    }
    xml.push('  </content>');

    // Add navigation helpers
    xml.push('  <navigation>');
    xml.push('    <related-documents>');
    
    // Add category-specific related docs
    if (doc.type === 'agent') {
      xml.push('      <document href=".claude/agents/smartpack-coordinator.xml">Agent Coordinator</document>');
      xml.push('      <document href=".claude/scratchpad.xml">Session Context</document>');
    } else if (doc.type.includes('worktree')) {
      xml.push('      <document href=".claude/docs/worktree-management/WORKTREE_MANAGEMENT.xml">Worktree Guidelines</document>');
    } else if (doc.type.includes('scratchpad')) {
      xml.push('      <document href=".claude/scratchpad.xml">Active Scratchpad</document>');
    }
    
    xml.push('    </related-documents>');
    xml.push('  </navigation>');

    xml.push('</document>');
    
    return xml.join('\n');
  }

  sectionToXml(section, indent) {
    const xml = [];
    const spaces = '  '.repeat(indent);
    
    xml.push(`${spaces}<section id="${section.id}" level="${section.level}">`);
    xml.push(`${spaces}  <title>${this.escapeXml(section.title)}</title>`);
    
    if (section.content) {
      // Handle structured content
      if (typeof section.content === 'object') {
        if (section.content.text) {
          xml.push(`${spaces}  <text>${this.escapeXml(section.content.text.trim())}</text>`);
        }
        
        if (section.content.lists && section.content.lists.length > 0) {
          for (const list of section.content.lists) {
            xml.push(`${spaces}  <list>`);
            for (const item of list.items) {
              if (item.name) {
                xml.push(`${spaces}    <item id="${item.id}">`);
                xml.push(`${spaces}      <name>${this.escapeXml(item.name)}</name>`);
                if (item.description) {
                  xml.push(`${spaces}      <description>${this.escapeXml(item.description)}</description>`);
                }
                xml.push(`${spaces}    </item>`);
              } else {
                xml.push(`${spaces}    <item>${this.escapeXml(item.text || '')}</item>`);
              }
            }
            xml.push(`${spaces}  </list>`);
          }
        }
        
        if (section.content.codeBlocks && section.content.codeBlocks.length > 0) {
          for (const block of section.content.codeBlocks) {
            xml.push(`${spaces}  <code-block language="${block.language || 'text'}">`);
            xml.push(`${spaces}    <![CDATA[${block.code.join('\n')}]]>`);
            xml.push(`${spaces}  </code-block>`);
          }
        }
      } else {
        xml.push(`${spaces}  <content>${this.escapeXml(section.content)}</content>`);
      }
    }
    
    // Add subsections
    if (section.subsections && section.subsections.length > 0) {
      for (const subsection of section.subsections) {
        xml.push(...this.sectionToXml(subsection, indent + 1));
      }
    }
    
    xml.push(`${spaces}</section>`);
    
    return xml;
  }

  escapeXml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  convertFile(inputPath, outputPath) {
    const content = fs.readFileSync(inputPath, 'utf-8');
    const doc = this.parseMarkdown(content, inputPath);
    const xml = this.toXml(doc);
    
    fs.writeFileSync(outputPath, xml, 'utf-8');
    
    // Store for cross-reference updates
    this.crossReferences.set(path.basename(inputPath, '.md'), doc.references);
    
    return doc;
  }
}

// Main conversion script
const converter = new ClaudeDocsXmlConverter();

const filesToConvert = [
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

console.log('🔄 Converting .claude documentation to XML with cross-references...\n');

let successful = 0;
let failed = 0;

for (const file of filesToConvert) {
  const inputPath = path.join(process.cwd(), file);
  const outputPath = inputPath.replace(/\.md$/, '.xml');
  
  try {
    converter.convertFile(inputPath, outputPath);
    console.log(`✅ Converted: ${file}`);
    successful++;
  } catch (error) {
    console.error(`❌ Failed: ${file} - ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Conversion Summary:`);
console.log(`✅ Successfully converted: ${successful} files`);
console.log(`❌ Failed: ${failed} files`);

if (successful > 0) {
  console.log('\n✨ XML files created with consistent structure and cross-references!');
}