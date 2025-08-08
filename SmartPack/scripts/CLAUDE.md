# SmartPack Scripts Directory Navigation

**SCRIPT INVENTORY - DO NOT DELETE**

This navigation file provides quick script discovery and usage documentation, reducing token usage by cataloging all utility scripts.

**Purpose**: Script documentation, automation tools, utility functions
**Status**: Reference file for development automation

## Directory Purpose

The `scripts/` directory contains utility scripts for development automation, cleanup tasks, validation, and coordination. These scripts help maintain code quality and streamline development workflows.

## Script Inventory

### Process Management

#### `cleanup-processes.js`
**Purpose**: Clean up hanging Node.js processes
**Usage**: `node scripts/cleanup-processes.js`
**Function**:
- Identifies hanging Node processes
- Kills zombie processes
- Frees up ports
- Prevents test failures from process conflicts

**When to use**:
- Before running tests
- When ports are blocked
- After failed test runs
- When dev server won't start

### Test Management

#### `cleanup-test-files.js`
**Purpose**: Remove temporary test artifacts
**Usage**: `node scripts/cleanup-test-files.js`
**Function**:
- Deletes test screenshots
- Removes test videos
- Cleans coverage reports
- Purges temporary test data

**When to use**:
- After test suite completion
- Before committing code
- To free disk space
- Regular maintenance

### Agent Coordination

#### `run-coordinator.js`
**Purpose**: Orchestrate agent workflows
**Usage**: `node scripts/run-coordinator.js [task-type]`
**Function**:
- Assigns tasks to agents
- Manages agent handoffs
- Tracks progress
- Updates scratchpad

**Task types**:
- `bug-fix` - Bug resolution workflow
- `feature` - Feature implementation
- `validation` - Full validation suite
- `ship-check` - Ship readiness assessment

**Example**:
```bash
node scripts/run-coordinator.js ship-check
```

### Validation Scripts

#### `validate-instruction-adherence.js`
**Purpose**: Ensure code follows project standards
**Usage**: `node scripts/validate-instruction-adherence.js`
**Function**:
- Checks coding standards
- Validates file structure
- Ensures documentation
- Verifies test coverage

**Validation checks**:
- TypeScript strict mode compliance
- Component prop interfaces
- Test file existence
- Documentation completeness
- Accessibility attributes

**Output**:
```
✓ All components have TypeScript interfaces
✓ Tests exist for all components
✓ Accessibility attributes present
✗ Missing documentation in 2 files
```

## Script Categories

### Development Scripts
Scripts that assist during development:
- Process management
- Environment setup
- Development server utilities
- Hot reload helpers

### Testing Scripts
Scripts for test management:
- Test file cleanup
- Test data generation
- Coverage reporting
- Test runner helpers

### Validation Scripts
Scripts that ensure quality:
- Code standard validation
- Documentation checks
- Dependency audits
- Security scans

### Build Scripts
Scripts for production builds:
- Bundle optimization
- Asset processing
- Environment configuration
- Deployment preparation

### Maintenance Scripts
Scripts for project maintenance:
- File cleanup
- Log rotation
- Cache clearing
- Database maintenance

## Common Script Patterns

### Error Handling Pattern
All scripts follow consistent error handling:
```javascript
try {
  // Script logic
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
```

### Logging Pattern
Consistent logging across scripts:
```javascript
console.log('✓', 'Success message');
console.warn('⚠', 'Warning message');
console.error('✗', 'Error message');
```

### Configuration Pattern
Scripts read from common config:
```javascript
const config = require('../config/scripts.config.js');
const { timeout, retries, verbose } = config;
```

## Usage Examples

### Pre-Test Cleanup
```bash
# Clean processes and test files before testing
node scripts/cleanup-processes.js && \
node scripts/cleanup-test-files.js && \
npm test
```

### Full Validation
```bash
# Run complete validation suite
node scripts/validate-instruction-adherence.js && \
node scripts/run-coordinator.js validation
```

### Ship Readiness Check
```bash
# Check if ready to ship
node scripts/run-coordinator.js ship-check && \
node scripts/validate-instruction-adherence.js
```

## Script Configuration

### Environment Variables
Scripts respect these environment variables:
- `DEBUG` - Enable verbose output
- `DRY_RUN` - Preview without executing
- `FORCE` - Skip confirmations
- `QUIET` - Suppress output

### Configuration Files
Scripts may use configuration from:
- `package.json` - Script definitions
- `.env` - Environment variables
- `scripts.config.js` - Script-specific config

## Adding New Scripts

### Script Template
```javascript
#!/usr/bin/env node

/**
 * Script: script-name.js
 * Purpose: Brief description
 * Usage: node scripts/script-name.js [options]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  verbose: process.env.DEBUG === 'true',
  dryRun: process.env.DRY_RUN === 'true'
};

// Main function
async function main() {
  try {
    console.log('Starting script...');
    
    // Script logic here
    
    console.log('✓ Script completed successfully');
  } catch (error) {
    console.error('✗ Script failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main };
```

### Script Guidelines
1. Include clear documentation
2. Use consistent error handling
3. Provide helpful output
4. Support dry-run mode
5. Make scripts idempotent

## Integration with Package.json

### NPM Script Aliases
```json
{
  "scripts": {
    "cleanup": "node scripts/cleanup-processes.js",
    "cleanup:test": "node scripts/cleanup-test-files.js",
    "validate": "node scripts/validate-instruction-adherence.js",
    "coordinate": "node scripts/run-coordinator.js"
  }
}
```

### Usage via NPM
```bash
npm run cleanup
npm run cleanup:test
npm run validate
npm run coordinate feature
```

## Troubleshooting Scripts

### Common Issues

**Script not found**:
- Check file exists in scripts/
- Verify correct path
- Ensure execute permissions

**Script fails silently**:
- Run with DEBUG=true
- Check error logs
- Verify dependencies

**Script hangs**:
- Check for infinite loops
- Verify async operations
- Add timeout handling

### Debug Mode
Run any script in debug mode:
```bash
DEBUG=true node scripts/script-name.js
```

### Dry Run Mode
Test script without side effects:
```bash
DRY_RUN=true node scripts/script-name.js
```

## Script Dependencies

### Node.js Built-ins
Most scripts use only Node.js built-ins:
- `fs` - File system operations
- `path` - Path manipulation
- `child_process` - Process management
- `util` - Utility functions

### External Dependencies
Some scripts may require:
- `chalk` - Colored output
- `inquirer` - Interactive prompts
- `glob` - File pattern matching
- `yargs` - Command-line arguments

## Best Practices

### Script Development
1. Keep scripts focused on single purpose
2. Use descriptive names
3. Include usage documentation
4. Handle errors gracefully
5. Provide meaningful output

### Script Maintenance
1. Test scripts regularly
2. Update documentation
3. Remove obsolete scripts
4. Version control all scripts
5. Review and refactor periodically