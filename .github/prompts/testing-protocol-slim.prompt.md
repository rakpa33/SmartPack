# Testing Protocol

Systematic testing approach for SmartPack development with proper error analysis.

## Pre-Testing Setup

```bash
# Check for hanging processes
tasklist | find "node.exe"

# Clean environment if needed
taskkill /F /IM node.exe

# Verify build and lint
npm run build && npm run lint
```

## Testing Strategy

### Quick Validation (Prefer for Development)

```bash
# Single component
npm test -- --run ComponentName.test.tsx

# Specific directory
npm test -- --run src/__tests__/unit/

# Pattern matching
npm test -- --run --testNamePattern="user workflow"
```

### Full Validation (Use Sparingly)

```bash
# Complete test suite with monitoring
npm test -- --run --reporter=verbose --timeout=30000
```

## Error Classification

**NEW Failures** (Must Fix)

- Related to recent changes
- Priority: HIGH

**PRE-EXISTING** (Document & Track)

- Existing before changes
- Priority: MEDIUM

**ENVIRONMENTAL** (Fix Setup)

- Infrastructure/config issues
- Priority: HIGH

## Monitoring & Recovery

### Expected Behavior

- Unit tests: <5 seconds
- Integration: <30 seconds
- Clear pass/fail summary

### Red Flags

- "Queued" status >30 seconds
- No completion summary
- Console output stops

### Recovery Actions

```bash
# Kill hanging processes
taskkill /F /IM node.exe

# Try targeted testing
npm test -- --run src/__tests__/unit/
```

## Validation Criteria

Before considering changes complete:

- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Relevant tests pass
- [ ] No new test failures
- [ ] Errors properly categorized
- [ ] Documentation updated
