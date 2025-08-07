#!/usr/bin/env node

/**
 * Markdown to XML Converter for Claude Documentation
 * Converts markdown files to XML format with semantic tags for better Claude parsing
 */

const fs = require('fs');
const path = require('path');

class MarkdownToXmlConverter {
  constructor() {
    this.indentLevel = 0;
    this.indentSize = 2;
  }

  indent() {
    return ' '.repeat(this.indentLevel * this.indentSize);
  }

  escapeXml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  parseSection(lines, startIdx = 0) {
    const sections = [];
    let currentSection = null;
    let currentContent = [];
    let i = startIdx;

    while (i < lines.length) {
      const line = lines[i];
      
      // Check for headers
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        // Save previous section if exists
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
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
      
      i++;
    }

    // Save last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return this.organizeSections(sections);
  }

  organizeSections(sections) {
    const root = [];
    const stack = [];

    for (const section of sections) {
      while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(section);
      } else {
        const parent = stack[stack.length - 1];
        parent.subsections = parent.subsections || [];
        parent.subsections.push(section);
      }

      stack.push(section);
    }

    return root;
  }

  generateId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  parseList(content) {
    const lines = content.split('\n');
    const items = [];
    let currentItem = null;
    let currentContent = [];

    for (const line of lines) {
      const listMatch = line.match(/^[-*]\s+(.+)$/);
      const numberedMatch = line.match(/^\d+\.\s+(.+)$/);
      
      if (listMatch || numberedMatch) {
        if (currentItem) {
          currentItem.content = currentContent.join('\n').trim();
          items.push(currentItem);
        }
        
        const text = listMatch ? listMatch[1] : numberedMatch[1];
        
        // Check for bold items (agent names, etc.)
        const boldMatch = text.match(/^\*\*([^*]+)\*\*:?\s*(.*)$/);
        if (boldMatch) {
          currentItem = {
            id: this.generateId(boldMatch[1]),
            name: boldMatch[1],
            description: boldMatch[2]
          };
        } else {
          currentItem = {
            text: text
          };
        }
        currentContent = [];
      } else if (line.match(/^\s+/)) {
        // Indented content belongs to current item
        currentContent.push(line.trim());
      }
    }

    if (currentItem) {
      currentItem.content = currentContent.join('\n').trim();
      items.push(currentItem);
    }

    return items;
  }

  convertSectionToXml(section, tagName = 'section') {
    const xml = [];
    
    xml.push(`${this.indent()}<${tagName} id="${section.id}" level="${section.level}">`);
    this.indentLevel++;
    
    xml.push(`${this.indent()}<title>${this.escapeXml(section.title)}</title>`);
    
    if (section.content) {
      // Parse special content patterns
      if (section.content.includes('**') && section.content.includes(':')) {
        // Likely contains structured data
        const items = this.parseList(section.content);
        if (items.length > 0) {
          xml.push(`${this.indent()}<items>`);
          this.indentLevel++;
          
          for (const item of items) {
            if (item.name) {
              xml.push(`${this.indent()}<item id="${item.id}">`);
              this.indentLevel++;
              xml.push(`${this.indent()}<name>${this.escapeXml(item.name)}</name>`);
              if (item.description) {
                xml.push(`${this.indent()}<description>${this.escapeXml(item.description)}</description>`);
              }
              this.indentLevel--;
              xml.push(`${this.indent()}</item>`);
            } else {
              xml.push(`${this.indent()}<item>${this.escapeXml(item.text || '')}</item>`);
            }
          }
          
          this.indentLevel--;
          xml.push(`${this.indent()}</items>`);
        }
      } else {
        // Regular content
        xml.push(`${this.indent()}<content>${this.escapeXml(section.content)}</content>`);
      }
    }
    
    // Process subsections
    if (section.subsections && section.subsections.length > 0) {
      for (const subsection of section.subsections) {
        xml.push(...this.convertSectionToXml(subsection, 'subsection').split('\n'));
      }
    }
    
    this.indentLevel--;
    xml.push(`${this.indent()}</${tagName}>`);
    
    return xml.join('\n');
  }

  convertMarkdownToXml(markdownPath, outputPath) {
    const markdown = fs.readFileSync(markdownPath, 'utf-8');
    const lines = markdown.split('\n');
    const sections = this.parseSection(lines);
    
    const fileName = path.basename(markdownPath, '.md');
    const xml = [];
    
    xml.push('<?xml version="1.0" encoding="UTF-8"?>');
    xml.push(`<document type="${fileName}" version="1.0" last-updated="${new Date().toISOString().split('T')[0]}">`);
    
    this.indentLevel = 1;
    
    for (const section of sections) {
      xml.push(this.convertSectionToXml(section));
    }
    
    xml.push('</document>');
    
    fs.writeFileSync(outputPath, xml.join('\n'), 'utf-8');
    console.log(`✓ Converted ${markdownPath} to ${outputPath}`);
  }

  convertAgentDefinition(markdownPath, outputPath) {
    const markdown = fs.readFileSync(markdownPath, 'utf-8');
    const lines = markdown.split('\n');
    
    const agentName = path.basename(markdownPath, '.md');
    const xml = [];
    
    xml.push('<?xml version="1.0" encoding="UTF-8"?>');
    xml.push(`<agent id="${agentName}" version="1.0">`);
    
    this.indentLevel = 1;
    
    // Parse agent-specific patterns
    const sections = this.parseSection(lines);
    
    for (const section of sections) {
      const sectionTitle = section.title.toLowerCase();
      
      if (sectionTitle.includes('role') || sectionTitle.includes('purpose')) {
        xml.push(`${this.indent()}<role>${this.escapeXml(section.content)}</role>`);
      } else if (sectionTitle.includes('capabilities')) {
        xml.push(`${this.indent()}<capabilities>`);
        this.indentLevel++;
        const items = this.parseList(section.content);
        for (const item of items) {
          xml.push(`${this.indent()}<capability>${this.escapeXml(item.text || item.description || '')}</capability>`);
        }
        this.indentLevel--;
        xml.push(`${this.indent()}</capabilities>`);
      } else if (sectionTitle.includes('workflow') || sectionTitle.includes('process')) {
        xml.push(`${this.indent()}<workflow>`);
        this.indentLevel++;
        const items = this.parseList(section.content);
        let stepNum = 1;
        for (const item of items) {
          xml.push(`${this.indent()}<step order="${stepNum++}">${this.escapeXml(item.text || item.description || '')}</step>`);
        }
        this.indentLevel--;
        xml.push(`${this.indent()}</workflow>`);
      } else if (sectionTitle.includes('priority') || sectionTitle.includes('ship')) {
        xml.push(`${this.indent()}<priority>${this.escapeXml(section.content)}</priority>`);
      } else {
        xml.push(this.convertSectionToXml(section));
      }
    }
    
    xml.push('</agent>');
    
    fs.writeFileSync(outputPath, xml.join('\n'), 'utf-8');
    console.log(`✓ Converted agent ${agentName} to XML`);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node md-to-xml-converter.js <input.md> <output.xml> [--agent]');
    process.exit(1);
  }
  
  const [input, output, flag] = args;
  const converter = new MarkdownToXmlConverter();
  
  if (flag === '--agent') {
    converter.convertAgentDefinition(input, output);
  } else {
    converter.convertMarkdownToXml(input, output);
  }
}

module.exports = MarkdownToXmlConverter;