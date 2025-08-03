# SmartPack Coordinator Usage Guide

## Overview

The SmartPack Coordinator is a sophisticated agent orchestration system that manages complex development workflows by coordinating multiple specialized subagents. This guide provides best practices for safe and effective coordinator usage.

## ⚠️ IMPORTANT: Always Use Safety Protocols

**NEVER** run the coordinator directly. Always use the safety wrapper to prevent terminal freezing:

```bash
# ✅ CORRECT: Use safety wrapper
npm run coordinator:safe "your task description"

# ❌ WRONG: Direct usage (can cause terminal freezing)
# Don't use: Task tool with smartpack-coordinator directly
```

## Quick Start Commands

### Basic Usage
```bash
# Standard coordinator execution with cleanup
npm run coordinator:safe "implement new weather integration feature"

# Manual cleanup before coordinator usage
npm run cleanup
npm run coordinator "fix critical build errors"

# Custom timeout (15 minutes instead of default 10)
npm run coordinator "complex refactoring task" --timeout 15
```

### Diagnostic Commands
```bash
# Check system status before coordinator usage
npm run cleanup:verbose

# Preview what the coordinator would do (no actual execution)
node scripts/run-coordinator.js "task description" --dry-run

# Emergency process cleanup if coordinator hangs
npm run cleanup
```

## When to Use the Coordinator

### ✅ Good Use Cases

1. **Multi-Component Features**
   - New features requiring UI, backend, and testing changes
   - Integration of new APIs or services
   - System-wide architectural changes

2. **Complex Bug Resolution**
   - Issues affecting multiple components
   - Problems requiring analysis, fixes, and testing
   - Integration failures with unknown root causes

3. **Quality Assurance Workflows**
   - Comprehensive testing after major changes
   - Code quality improvements across multiple files
   - Documentation updates with implementation changes

### ❌ Avoid Using for

1. **Simple, Single-File Changes**
   - Individual component fixes
   - Documentation-only updates
   - Configuration changes

2. **Exploratory Tasks**
   - "Understand how X works"
   - Research tasks without implementation
   - Learning or investigation activities

3. **Time-Sensitive Urgent Fixes**
   - Quick hotfixes that need immediate deployment
   - Emergency debugging sessions

## Safety Features and Limits

### Automatic Protections

| Protection | Limit | Action |
|------------|-------|--------|
| Global Timeout | 10 minutes (default) | Graceful abort with progress report |
| Subagent Timeout | 3 minutes per call | Move to next step or abort |
| Memory Usage | 500MB heap limit | Emergency cleanup and abort |
| Infinite Loop Detection | Max 3 calls per subagent | Circuit breaker activation |
| Progress Requirements | Updates every 2-3 minutes | Force abort if no progress |

### Resource Monitoring

The coordinator continuously monitors:
- Node.js process count and memory usage
- Port availability (3000, 5173, 11434)
- CPU and disk I/O utilization
- Browser/test process accumulation

## Task Planning Guidelines

### Break Down Complex Tasks

Instead of:
```bash
npm run coordinator:safe "Completely rewrite the AI system with new models and update all tests"
```

Use multiple focused tasks:
```bash
npm run coordinator:safe "Analyze current AI system architecture and create migration plan"
npm run coordinator:safe "Implement new AI model integration following the migration plan"
npm run coordinator:safe "Update and fix all AI-related tests"
```

### Time Budget Planning

| Task Type | Estimated Time | Coordinator Pattern |
|-----------|----------------|-------------------|
| Bug Fix | 6-8 minutes | Bug Investigation & Resolution |
| New Feature | 8-10 minutes | New Feature Development |
| System Issues | 10+ minutes | System-Wide Issues (use custom timeout) |
| Testing Focus | 6-8 minutes | Testing Focus |
| Code Quality | 8-10 minutes | Code Quality Improvement |

## Common Workflow Patterns

### 1. New Feature Implementation

```bash
# Example: Adding a new weather widget
npm run coordinator:safe "Add weather widget to main layout with 5-day forecast display"
```

**Expected Flow:**
1. Architecture analysis (2 min) → Impact assessment and dependencies
2. Code implementation (3 min) → Create components and integrate
3. Test creation (2 min) → Unit and integration tests
4. Full validation (2 min) → Complete testing suite

### 2. Bug Investigation and Fixing

```bash
# Example: Fixing data persistence issues
npm run coordinator:safe "Fix packing list items not persisting correctly after page reload"
```

**Expected Flow:**
1. Root cause analysis (2 min) → Identify storage/state issues
2. Fix implementation (3 min) → Correct persistence logic
3. Test fixes (2 min) → Regression tests and validation
4. Impact verification (1 min) → Ensure no side effects

### 3. Quality Improvement

```bash
# Example: Accessibility improvements
npm run coordinator:safe "Improve accessibility compliance across all form components"
```

**Expected Flow:**
1. Analysis (2 min) → Identify compliance gaps
2. Implementation (3 min) → Add ARIA labels, keyboard navigation
3. Test updates (2 min) → Update accessibility tests
4. Validation (2 min) → Run full accessibility audit

## Emergency Procedures

### If Coordinator Hangs or Freezes

1. **Graceful Interruption:**
   ```bash
   # Press Ctrl+C in coordinator terminal
   # Wait 10 seconds for graceful shutdown
   ```

2. **Force Termination:**
   ```bash
   # Kill all Node processes
   npm run cleanup
   
   # Or manually:
   taskkill /F /IM node.exe  # Windows
   pkill node                # Unix/Mac
   ```

3. **System Recovery:**
   ```bash
   # Restart development environment
   npm run cleanup:verbose
   
   # Verify ports are available
   netstat -ano | findstr ":3000"
   netstat -ano | findstr ":5173"
   
   # Restart with clean state
   npm run dev:all
   ```

### If Memory Issues Occur

1. **Check Memory Usage:**
   ```bash
   # Windows
   tasklist /FI "IMAGENAME eq node.exe"
   
   # Unix/Mac
   ps aux | grep node
   ```

2. **Emergency Cleanup:**
   ```bash
   npm run cleanup
   
   # Close all browsers/dev tools
   # Restart terminal/IDE if needed
   ```

## Best Practices

### Pre-Execution Checklist

- [ ] Clear task description with specific, actionable goals
- [ ] Task can be reasonably completed within 10 minutes
- [ ] No other Node processes running unnecessarily
- [ ] Development servers are running if needed
- [ ] Recent backup/commit of current work

### During Execution

- [ ] Monitor coordinator progress reports
- [ ] Watch for memory usage warnings
- [ ] Be ready to abort if no progress for >3 minutes
- [ ] Keep terminal visible to see status updates

### Post-Execution

- [ ] Review completed work for quality
- [ ] Run additional tests if coordinator couldn't complete them
- [ ] Document any incomplete work for future sessions
- [ ] Clean up any leftover processes

## Troubleshooting Quick Reference

| Issue | Quick Fix | Prevention |
|-------|-----------|------------|
| Terminal freezing | Ctrl+C + `npm run cleanup` | Use `npm run coordinator:safe` |
| Memory errors | `npm run cleanup` + restart | Monitor memory during execution |
| Infinite loops | Force kill + check progress | Break tasks into smaller steps |
| Port conflicts | Check `netstat` + kill processes | Clean environment before starting |
| Timeout errors | Use `--timeout` parameter | Realistic time budgeting |

## Advanced Usage

### Custom Timeout Configuration

```bash
# For complex architectural changes
npm run coordinator "major refactoring" --timeout 20

# For quick fixes
npm run coordinator "hotfix critical bug" --timeout 5

# For testing-heavy workflows
npm run coordinator "comprehensive test suite fixes" --timeout 15
```

### Dry Run Mode

```bash
# Preview coordinator execution without running
node scripts/run-coordinator.js "task description" --dry-run
```

### Verbose Monitoring

```bash
# Enhanced logging for debugging
npm run cleanup:verbose
npm run coordinator "task" --verbose
```

## Integration with Development Workflow

### Commit Strategy

```bash
# Before coordinator usage
git add . && git commit -m "WIP: before coordinator execution"

# After coordinator completion
npm run coordinator:safe "implement feature X"
git add . && git commit -m "feat: implement feature X via coordinator"
```

### Testing Integration

```bash
# Run coordinator with comprehensive testing
npm run coordinator:safe "fix component Y and ensure all tests pass"

# Follow up with manual verification
npm run test
npm run test:e2e
npm run build
```

### Documentation Updates

The coordinator automatically updates relevant documentation files:
- `DEVLOG.md` entries for significant changes
- `TROUBLESHOOTING.md` for newly discovered issues
- Code comments and inline documentation

## Support and Troubleshooting

For issues not covered in this guide:

1. **Check Logs:** Review coordinator output for specific error messages
2. **Consult Documentation:** See `TROUBLESHOOTING.md` for detailed issue resolution
3. **Emergency Recovery:** Use `npm run cleanup` and restart development environment
4. **System Status:** Verify all required services (Ollama, backend, frontend) are running

Remember: The coordinator is designed to be safe and recoverable. When in doubt, abort and retry with a more focused task description.