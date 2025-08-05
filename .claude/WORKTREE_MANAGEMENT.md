# SmartPack Git Worktree Management Guide

## Overview
This guide outlines the git worktree workflow for SmartPack agents to enable parallel bug fixing and isolated development.

## Why Git Worktrees?
- **Parallel Development**: Work on multiple bugs simultaneously without branch switching
- **Isolation**: Each bug fix happens in its own directory with independent file state
- **Safe Experimentation**: Test risky fixes without affecting the main codebase
- **Clean Merges**: Only merge verified, working solutions

## Worktree Workflow

### 1. Bug Discovery (bug-crusher)
When a bug is identified:
```bash
# Create worktree with descriptive naming
git worktree add ../SmartPack-fix-[bug-id] -b fix/[bug-description]-[YYYYMMDD]

# Example:
git worktree add ../SmartPack-fix-nav-001 -b fix/navigation-broken-20250804
```

### 2. Documentation in Scratchpad
Add to the scratchpad Active Worktrees section:
```markdown
## Active Worktrees
- **Bug ID**: nav-001
- **Branch**: fix/navigation-broken-20250804
- **Location**: ../SmartPack-fix-nav-001
- **Status**: INVESTIGATING
- **Assigned To**: bug-crusher → code-fixer
- **Root Cause**: Navigation state not persisting after refresh
- **Fix Plan**: Update localStorage sync in navigation hook
```

### 3. Implementation (code-fixer)
Navigate to worktree and implement fix:
```bash
cd ../SmartPack-fix-nav-001
cd SmartPack
npm install  # If needed
npm run dev  # Test locally
```

### 4. Validation
Before merge, ensure:
- All tests pass: `npm test`
- No linting errors: `npm run lint:fix`
- Type checking passes: `npm run type-check`
- Build succeeds: `npm run build`

### 5. Merge Process
After validation:
```bash
# Return to main repository
cd ../../SmartPack
git checkout main

# Merge the fix
git merge fix/navigation-broken-20250804

# Clean up worktree
git worktree remove ../SmartPack-fix-nav-001
git branch -d fix/navigation-broken-20250804
```

## Worktree Status Definitions
- **INVESTIGATING**: Bug is being analyzed
- **READY-FOR-FIX**: Root cause identified, ready for implementation
- **IN-PROGRESS**: Fix is being implemented
- **TESTING**: Fix is complete, undergoing validation
- **READY-TO-MERGE**: All tests pass, approved for merge
- **MERGED**: Fix has been merged to main branch

## Multiple Parallel Worktrees
Agents can maintain multiple worktrees for different bugs:
```
SmartPack/                    # Main repository
├── SmartPack-fix-nav-001/   # Navigation bug fix
├── SmartPack-fix-api-002/   # API integration fix
└── SmartPack-fix-ui-003/    # UI rendering issue
```

## Best Practices
1. **Descriptive Names**: Use clear bug descriptions in branch names
2. **Status Updates**: Keep scratchpad updated with worktree status
3. **Clean Up**: Remove worktrees after successful merge
4. **One Bug Per Worktree**: Don't mix unrelated fixes
5. **Test in Isolation**: Verify fix works before merge

## Common Commands
```bash
# List all worktrees
git worktree list

# Remove a worktree
git worktree remove ../SmartPack-fix-[bug-id]

# Prune stale worktree information
git worktree prune

# Check worktree status
cd ../SmartPack-fix-[bug-id] && git status
```

## Agent Responsibilities

### bug-crusher
- Creates worktree for each bug
- Documents in scratchpad
- Provides root cause and fix plan

### code-fixer
- Works within assigned worktree
- Implements fix in isolation
- Updates status during implementation

### functional-validator
- Tests fix in worktree before merge
- Approves merge readiness
- Verifies no regressions

### coordinator
- Tracks multiple active worktrees
- Manages merge priorities
- Ensures cleanup after merge