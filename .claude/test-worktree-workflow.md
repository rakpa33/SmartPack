# Test Worktree Workflow - Sample Bug Fix

## Test Scenario: localStorage Contamination in Integration Tests

### Bug Details
- **Bug ID**: test-local-storage-001
- **Description**: Integration tests are failing due to localStorage contamination between tests
- **Severity**: HIGH (affects test reliability)
- **Location**: Integration test files mentioned in scratchpad

### Worktree Workflow Test Steps

#### 1. Create Worktree (bug-crusher role)
```bash
git worktree add ../SmartPack-fix-test-local-storage-001 -b fix/localstorage-test-contamination-20250804
```

#### 2. Update Scratchpad
Add to Active Worktrees section:
```markdown
| Bug ID | Branch | Location | Status | Assigned To | Summary |
|--------|--------|----------|--------|-------------|---------|
| test-local-storage-001 | fix/localstorage-test-contamination-20250804 | ../SmartPack-fix-test-local-storage-001 | INVESTIGATING | bug-crusher | Integration test localStorage contamination |
```

#### 3. Investigation Phase
- Navigate to worktree
- Reproduce the test failures
- Identify root cause: Tests not cleaning localStorage between runs
- Document fix plan: Add beforeEach/afterEach hooks to clear localStorage

#### 4. Handoff to code-fixer
Update status to READY-FOR-FIX and assign to code-fixer

#### 5. Implementation Phase (code-fixer role)
- Implement localStorage cleanup in test setup
- Run tests in worktree to verify fix
- Update status to TESTING

#### 6. Validation Phase (functional-validator role)
- Run full test suite in worktree
- Verify no regressions
- Update status to READY-TO-MERGE

#### 7. Merge Process
```bash
# Return to main repo
cd ../../SmartPack
git checkout main

# Merge the fix
git merge fix/localstorage-test-contamination-20250804

# Clean up
git worktree remove ../SmartPack-fix-test-local-storage-001
git branch -d fix/localstorage-test-contamination-20250804
```

### Benefits Demonstrated
- **Isolation**: Fix developed without affecting main branch
- **Parallel Work**: Other bugs could be fixed simultaneously
- **Safe Testing**: Full validation before merge
- **Clean History**: Only working solutions merged

### Next Steps
1. Run through this workflow with actual agents
2. Document any issues or improvements needed
3. Update agent instructions based on learnings