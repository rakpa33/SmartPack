# Fix Issue - Claude Workflow

**Issue: <DESCRIPTION>**

Systematic approach to resolving SmartPack issues with Claude.

## 1. Issue Analysis

- **Symptom**: What is observed/reported?
- **Context**: When does it occur? What triggers it?
- **Scope**: Affects which components/functionality?
- **Priority**: Blocking development vs enhancement

## 2. Investigation Protocol

### Check Known Issues & Documentation

- Search TROUBLESHOOTING.md for similar symptoms
- Review DEVLOG.md for related recent changes (newest entries at top)
- Check CLAUDE.md for development context and patterns
- Reference ARCHITECTURE.md for system understanding

### Diagnostic Steps

```bash
# Environment validation (run from SmartPack/SmartPack directory)
npm run build
npm run lint
npm run type-check
npm test -- --run ComponentName.test.tsx

# After each command, always read and analyze the terminal output for errors, warnings, or unexpected results.
# Document and address any issues found before proceeding. Never assume success without explicit confirmation from the terminal output.

# Check for hanging processes
tasklist | find "node.exe"

# Verify Ollama service (if AI-related issue)
curl http://localhost:11434/api/tags
```

### Root Cause Analysis

- Reproduce issue reliably
- Isolate to specific component/function
- Identify why it's occurring (logic, config, environment)

## 3. Solution Implementation

### Claude Development Strategy

- **Documentation-First**: Reference CLAUDE.md and ARCHITECTURE.md before changes
- **Minimal Change**: Smallest fix that resolves root cause
- **Pattern Consistency**: Follow existing SmartPack patterns in codebase
- **Testing**: Validate fix with appropriate tests (unit + accessibility)
- **Prevention**: Add safeguards to prevent recurrence

### Code Changes

- Apply TypeScript strict mode (no implicit any)
- Maintain WCAG 2.1 AA accessibility compliance
- Follow mobile-first responsive design patterns
- Use established component patterns from existing codebase
- Ensure 44px touch targets and proper contrast ratios

## 4. Validation & Documentation

### Testing Validation

```bash
# Test affected functionality (targeted approach)
npm test -- --run path/to/affected/tests

# Full quality gates
npm run lint
npm run type-check
npm run build

# Accessibility validation (if UI changes)
# Check jest-axe tests pass with 0 critical issues
```

### Documentation Updates

- **TROUBLESHOOTING.md**: Add entry with Symptom → Root Cause → Solution → Prevention
- **DEVLOG.md**: Update with technical context (ADD AT TOP, not bottom)
- **CLAUDE.md**: Update if new patterns or conventions established
- Update related docs if architectural patterns changed

## 5. Error Classification & Claude Context

**NEW**: Related to recent changes (fix immediately with full context)
**PRE-EXISTING**: Existing issue (document and prioritize, check DEVLOG.md for history)
**ENVIRONMENTAL**: Setup/config issue (fix environment, update setup docs)

### Claude-Specific Considerations
- Use TodoWrite for complex multi-step fixes
- Reference existing documentation before proposing new approaches
- Maintain reverse chronological order in DEVLOG.md entries
- Follow established testing patterns (RTL + jest-axe + Playwright)

## Completion Criteria

- [ ] Issue reliably resolved with minimal scope
- [ ] No new issues introduced (verified with lint/build/test)
- [ ] Tests pass for affected areas (including accessibility)
- [ ] Solution documented in TROUBLESHOOTING.md for future reference
- [ ] DEVLOG.md updated with technical context (at TOP)
- [ ] Prevention measures implemented and documented
