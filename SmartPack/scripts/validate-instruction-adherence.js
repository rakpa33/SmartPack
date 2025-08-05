#!/usr/bin/env node
/**
 * SmartPack Instruction Adherence Validation Script
 * 
 * Automatically checks and scores how well agents follow CLAUDE.md instructions
 * Validates compliance with behavioral constraints and output formats
 * 
 * Usage:
 *   node scripts/validate-instruction-adherence.js
 *   npm run compliance-check
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Compliance rules and scoring weights
const COMPLIANCE_RULES = {
  // CRITICAL rules (100% required)
  CRITICAL: {
    weight: 1.0,
    rules: [
      {
        id: 'scratchpad_evaluation',
        description: 'Scratchpad evaluation before major tasks',
        check: (content) => content.includes('SCRATCHPAD EVALUATION'),
        points: 25
      },
      {
        id: 'devlog_documentation',
        description: 'Significant changes documented in DEVLOG.md',
        check: (content, context) => {
          if (!context.significantChanges) return true; // No changes to document
          const devlogContent = getFileContent(join(rootDir, 'docs/development/DEVLOG.md'));
          return devlogContent.includes(getCurrentDate());
        },
        points: 25
      },
      {
        id: 'ship_priority_respect',
        description: 'Ship-critical work prioritized over enhancements',
        check: (content) => {
          const hasEnhancementWork = /enhancement|polish|optimization|visual/.test(content.toLowerCase());
          const hasCriticalWork = /ship.critical|bug|broken|critical/.test(content.toLowerCase());
          return !hasEnhancementWork || hasCriticalWork;
        },
        points: 25
      },
      {
        id: 'output_format_compliance',
        description: 'Required output format templates used',
        check: (content) => {
          const hasStructuredOutput = /\*\*[A-Z_\s]+\*\*:/.test(content);
          return hasStructuredOutput || !content.includes('BUG:') && !content.includes('FEATURE:');
        },
        points: 25
      }
    ]
  },
  
  // HIGH priority rules (should follow)
  HIGH: {
    weight: 0.8,
    rules: [
      {
        id: 'agent_specialization',
        description: 'Appropriate agent selection with justification',
        check: (content) => content.includes('AGENT') || content.includes('agent'),
        points: 20
      },
      {
        id: 'timeline_awareness',
        description: 'Timeline constraints considered',
        check: (content) => /timeline|deadline|ship|2.day/.test(content.toLowerCase()),
        points: 15
      },
      {
        id: 'validation_workflow',
        description: 'Information → Execution → Validation pattern',
        check: (content) => content.includes('VALIDATION') || content.includes('TESTING'),
        points: 15
      }
    ]
  },
  
  // MEDIUM priority rules (when practical)
  MEDIUM: {
    weight: 0.6,
    rules: [
      {
        id: 'testing_standards',
        description: 'Tests run before task completion',
        check: (content) => /test|testing|validation/.test(content.toLowerCase()),
        points: 10
      },
      {
        id: 'code_quality',
        description: 'TypeScript and quality standards followed',
        check: (content) => !content.includes('any type') && !content.includes('// TODO'),
        points: 10
      }
    ]
  }
};

// Behavioral constraint violations (auto-fail)
const BEHAVIORAL_VIOLATIONS = [
  {
    id: 'skipped_scratchpad',
    description: 'Skipped scratchpad evaluation for major task',
    pattern: /major|significant|implement|fix.*bug/i,
    violation: (content) => !/SCRATCHPAD EVALUATION/.test(content)
  },
  {
    id: 'enhancement_over_critical',
    description: 'Worked on enhancements while ship-critical bugs exist',
    pattern: /enhancement|polish|visual|animation/i,
    violation: (content, context) => {
      // This would require more complex context checking
      return false; // Simplified for now
    }
  },
  {
    id: 'undocumented_changes',
    description: 'Significant changes not documented in DEVLOG.md',
    pattern: /implemented|fixed|added|created/i,
    violation: (content) => {
      const devlogContent = getFileContent(join(rootDir, 'docs/development/DEVLOG.md'));
      const today = getCurrentDate();
      return !devlogContent.includes(today);
    }
  }
];

class InstructionAdherenceValidator {
  constructor() {
    this.results = {
      score: 0,
      maxScore: 0,
      compliance: 0,
      violations: [],
      recommendations: [],
      details: {
        critical: { score: 0, max: 0, passed: 0, total: 0 },
        high: { score: 0, max: 0, passed: 0, total: 0 },
        medium: { score: 0, max: 0, passed: 0, total: 0 }
      }
    };
  }

  validateContent(content, context = {}) {
    console.log('🔍 Validating instruction adherence...\n');

    // Check for behavioral violations first
    this.checkBehavioralViolations(content, context);

    // Score compliance with rules
    for (const [priority, ruleSet] of Object.entries(COMPLIANCE_RULES)) {
      this.scoreRuleSet(priority.toLowerCase(), ruleSet, content, context);
    }

    // Calculate final compliance percentage
    this.results.compliance = this.results.maxScore > 0 
      ? Math.round((this.results.score / this.results.maxScore) * 100)
      : 0;

    return this.results;
  }

  checkBehavioralViolations(content, context) {
    for (const violation of BEHAVIORAL_VIOLATIONS) {
      if (violation.pattern.test(content) && violation.violation(content, context)) {
        this.results.violations.push({
          id: violation.id,
          description: violation.description,
          severity: 'CRITICAL'
        });
      }
    }
  }

  scoreRuleSet(priority, ruleSet, content, context) {
    const results = this.results.details[priority];
    results.total = ruleSet.rules.length;

    for (const rule of ruleSet.rules) {
      const passed = rule.check(content, context);
      const weightedPoints = Math.round(rule.points * ruleSet.weight);
      
      results.max += weightedPoints;
      this.results.maxScore += weightedPoints;
      
      if (passed) {
        results.score += weightedPoints;
        results.passed++;
        this.results.score += weightedPoints;
      } else {
        this.results.recommendations.push({
          priority: priority.toUpperCase(),
          rule: rule.id,
          description: rule.description,
          points: weightedPoints
        });
      }
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      overall: {
        score: this.results.score,
        maxScore: this.results.maxScore,
        compliance: this.results.compliance,
        grade: this.getComplianceGrade(this.results.compliance)
      },
      details: this.results.details,
      violations: this.results.violations,
      recommendations: this.results.recommendations.slice(0, 10) // Top 10
    };

    // Write detailed report to file
    const reportPath = join(rootDir, 'test-results/compliance-report.json');
    ensureDirectoryExists(join(rootDir, 'test-results'));
    writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  getComplianceGrade(percentage) {
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'B+';
    if (percentage >= 80) return 'B';
    if (percentage >= 75) return 'C+';
    if (percentage >= 70) return 'C';
    return 'F';
  }

  printSummary(report) {
    console.log('📊 INSTRUCTION ADHERENCE REPORT');
    console.log('=====================================');
    console.log(`🎯 Overall Compliance: ${report.overall.compliance}% (${report.overall.grade})`);
    console.log(`📈 Score: ${report.overall.score}/${report.overall.maxScore}`);
    
    if (report.violations.length > 0) {
      console.log('\n❌ CRITICAL VIOLATIONS:');
      report.violations.forEach(v => {
        console.log(`   • ${v.description}`);
      });
    }

    console.log('\n📋 PRIORITY BREAKDOWN:');
    for (const [priority, details] of Object.entries(report.details)) {
      const percentage = details.max > 0 ? Math.round((details.score / details.max) * 100) : 0;
      console.log(`   ${priority.toUpperCase()}: ${details.passed}/${details.total} rules (${percentage}%)`);
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 TOP RECOMMENDATIONS:');
      report.recommendations.slice(0, 5).forEach(r => {
        console.log(`   • [${r.priority}] ${r.description} (+${r.points} pts)`);
      });
    }

    console.log(`\n📄 Full report: test-results/compliance-report.json`);
  }
}

// Utility functions
function getFileContent(filePath) {
  try {
    return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  } catch (error) {
    return '';
  }
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function ensureDirectoryExists(dirPath) {
  try {
    const fs = require('fs');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    // Directory creation failed, continue anyway
  }
}

// Main execution
async function main() {
  try {
    console.log('🧩 SmartPack Instruction Adherence Validator\n');
    
    // Example: Validate recent DEVLOG entries or scratchpad content
    const scratchpadPath = join(rootDir, '.claude/scratchpad.md');
    const devlogPath = join(rootDir, 'docs/development/DEVLOG.md');
    
    const scratchpadContent = getFileContent(scratchpadPath);
    const devlogContent = getFileContent(devlogPath);
    
    // Combine recent content for validation
    const recentContent = scratchpadContent + '\n' + 
      devlogContent.split('\n').slice(0, 100).join('\n'); // Last 100 lines
    
    const validator = new InstructionAdherenceValidator();
    const results = validator.validateContent(recentContent, {
      significantChanges: recentContent.length > 500
    });
    
    const report = validator.generateReport();
    validator.printSummary(report);
    
    // Return appropriate exit code
    const success = report.overall.compliance >= 80 && report.violations.length === 0;
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export { InstructionAdherenceValidator, COMPLIANCE_RULES, BEHAVIORAL_VIOLATIONS };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}