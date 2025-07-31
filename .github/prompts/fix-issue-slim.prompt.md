# Fix Issue

**Issue: <DESCRIPTION>**

Systematic approach to resolving SmartPack issues.

## 1. Issue Analysis

- **Symptom**: What is observed/reported?
- **Context**: When does it occur? What triggers it?
- **Scope**: Affects which components/functionality?
- **Priority**: Blocking development vs enhancement

## 2. Investigation Protocol

### Check Known Issues

- Search TROUBLESHOOTING.md for similar symptoms
- Review DEVLOG.md for related recent changes
- Check GitHub issues or external resources

### Diagnostic Steps

```bash
# Environment validation
npm run build
npm run lint
npm test -- --run ComponentName.test.tsx

# Check for hanging processes
tasklist | find "node.exe"
```

### Root Cause Analysis

- Reproduce issue reliably
- Isolate to specific component/function
- Identify why it's occurring (logic, config, environment)

## 3. Solution Implementation

### Fix Strategy

- **Minimal Change**: Smallest fix that resolves root cause
- **Pattern Consistency**: Follow existing SmartPack patterns
- **Testing**: Validate fix with appropriate tests
- **Prevention**: Add safeguards to prevent recurrence

### Code Changes

- Apply TypeScript strict mode
- Maintain accessibility compliance
- Follow mobile-first responsive design
- Use established component patterns

## 4. Validation & Documentation

### Testing Validation

```bash
# Test affected functionality
npm test -- --run path/to/affected/tests

# Build verification
npm run build
```

### Documentation Updates

- Add to TROUBLESHOOTING.md: Symptom → Root Cause → Solution → Prevention
- Update DEVLOG.md with technical context
- Update related docs if patterns changed

## 5. Error Classification

**NEW**: Related to recent changes (fix immediately)
**PRE-EXISTING**: Existing issue (document and prioritize)  
**ENVIRONMENTAL**: Setup/config issue (fix environment)

## Completion Criteria

- [ ] Issue reliably resolved
- [ ] No new issues introduced
- [ ] Tests pass for affected areas
- [ ] Solution documented for future reference
- [ ] Prevention measures implemented
