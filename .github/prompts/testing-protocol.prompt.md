# Testing Protocol for AI Assistance

## Purpose

This document establishes systematic testing protocols for AI assistants working on SmartPack to ensure proper test execution, error analysis, and quality validation.

## Core Principles

1. **Never Ignore Test Output** - Always read and analyze complete test results
2. **Stop and Investigate Hanging Tests** - Don't proceed with unresolved test issues
3. **Categorize Errors Properly** - Distinguish between new, pre-existing, and environmental issues
4. **Use Appropriate Test Scope** - Choose unit vs integration vs full suite based on changes
5. **Monitor Process Health** - Check for hanging Node.js processes before and after testing

## Pre-Testing Checklist

Before running any tests, execute these verification steps:

```bash
# 1. Check for hanging Node.js processes
tasklist | find "node.exe"

# 2. Kill any hanging processes if found
taskkill /F /IM node.exe

# 3. Verify TypeScript compilation
npm run build

# 4. Check for lint errors
npm run lint
```

## Testing Strategy by Change Type

### For UI Component Changes

```bash
# Quick validation approach
npm test -- --run ComponentName.test.tsx
npm run build
```

### For API/Service Changes

```bash
# Test specific services
npm test -- --run src/__tests__/services/
npm test -- --run src/__tests__/integration/ApiName.integration.test.tsx
```

### For State Management Changes

```bash
# Test context and hooks
npm test -- --run src/__tests__/useTripForm.test.tsx
npm test -- --run src/__tests__/hooks/
```

### For Full Validation (Use Sparingly)

```bash
# Full suite with timeout protection
npm test -- --run --reporter=verbose --timeout=30000
```

## Test Execution Monitoring

### Expected Behavior

- **Unit tests**: Complete within 5 seconds
- **Integration tests**: Complete within 30 seconds
- **Clear completion**: Shows "X passed | Y failed" summary
- **No hanging**: No "queued" status for >30 seconds

### Red Flags

- Tests showing "queued" for >30 seconds
- No completion summary after reasonable time
- Console output that stops mid-execution
- Error messages that are ignored or skipped

### Recovery Actions

```bash
# If tests hang
taskkill /F /IM node.exe

# Try targeted testing instead
npm test -- --run src/__tests__/unit/

# Check specific component
npm test -- --run --timeout=10000 failing-test.tsx
```

## Error Analysis Protocol

### Step 1: Error Classification

When tests fail, categorize each error:

1. **NEW FAILURE** - Related to recent code changes
   - Action: MUST FIX before proceeding
   - Priority: HIGH
2. **PRE-EXISTING** - Existing in codebase before changes
   - Action: Document and isolate from current work
   - Priority: MEDIUM (track separately)
3. **ENVIRONMENTAL** - Test setup or configuration issues
   - Action: Fix testing environment
   - Priority: HIGH (blocks development)

### Step 2: Common Error Patterns

#### API Expectation Mismatches

- **Symptom**: "expected spy to be called with arguments" errors
- **Common Causes**:
  - Case sensitivity (e.g., "plane" vs "Plane")
  - Missing fields in API calls
  - Changed data structures
- **Solution**: Update test expectations to match actual implementation

#### Component Evolution Issues

- **Symptom**: Function or UI text not found errors
- **Common Causes**:
  - Component methods renamed (e.g., `generatePackingList` → `generateAISuggestions`)
  - Button text updated (e.g., "Get More Suggestions" → "Get AI Suggestions")
  - State management patterns changed
- **Solution**: Update test selectors and expectations

#### Timeout/Hanging Issues

- **Symptom**: Tests never complete or show "queued"
- **Common Causes**:
  - Unresolved promises
  - Infinite loops
  - Missing async/await
  - Environment setup problems
- **Solution**: Add timeouts, check async patterns, restart environment

### Step 3: Documentation Requirements

Always document:

- Which errors were new vs pre-existing
- What fixes were applied
- Which tests are still failing and why
- Any environmental issues discovered

## Validation Completion Criteria

Before considering any change complete:

1. ✅ **Build Success**: `npm run build` completes without errors
2. ✅ **Lint Clean**: `npm run lint` passes without warnings
3. ✅ **Relevant Tests Pass**: Tests related to the change area pass
4. ✅ **No New Failures**: No new test failures introduced by changes
5. ✅ **Error Analysis Complete**: All test failures properly categorized
6. ✅ **Documentation Updated**: Changes reflected in relevant docs

## Common Mistakes to Avoid

1. **Proceeding with hanging tests** - Always investigate and resolve
2. **Ignoring error messages** - Read full stack traces and error details
3. **Running full test suite for small changes** - Use targeted testing
4. **Not checking for hanging processes** - Always verify clean environment
5. **Skipping build verification** - Always ensure compilation succeeds
6. **Not categorizing test failures** - Distinguish new from pre-existing issues
7. **Batch testing without incremental validation** - Test changes incrementally

## Emergency Procedures

### If Tests Completely Hang

1. `taskkill /F /IM node.exe`
2. Restart terminal/IDE
3. Try unit tests only: `npm test -- --run src/__tests__/unit`
4. If still failing, check environment setup

### If All Tests Fail

1. Check recent changes with `git diff`
2. Verify dependencies: `npm install --legacy-peer-deps`
3. Try build first: `npm run build`
4. Test basic functionality manually

### If Integration Tests Consistently Fail

1. Document known issues in TROUBLESHOOTING.md
2. Use unit tests for validation
3. Test main functionality manually in browser
4. Focus on build success and TypeScript compliance

## Success Metrics

- **Fast Feedback**: Unit tests provide <5 second validation
- **Clean Environment**: No hanging processes between test runs
- **Proper Error Handling**: All test failures properly investigated
- **Incremental Progress**: Changes validated step-by-step
- **Documentation Accuracy**: Testing docs reflect current reality

This protocol ensures systematic, reliable testing practices that catch issues early while avoiding time-wasting test hangs and unresolved errors.
