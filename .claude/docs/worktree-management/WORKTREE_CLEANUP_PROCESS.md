# SmartPack Worktree Cleanup Process

## Overview
This document outlines the process for cleaning up completed worktrees and preserving valuable information.

## When to Clean Up Worktrees

Clean up worktrees when:
- Work is marked as RESOLVED in the temp document
- Changes have been successfully merged to main branch
- No further work is needed on the specific issue
- Temp document contains valuable insights to preserve

## Cleanup Process Steps

### 1. Information Extraction

Before deleting any documents, extract valuable information:

#### From Temp Document → TROUBLESHOOTING.md
- Bug descriptions and root causes
- Resolution steps that worked
- Common error patterns discovered
- Debugging techniques used

Example:
```markdown
## Chrome Autocomplete False Positive (2025-08-05)
**Issue**: Conflicting test results showing Chrome autocomplete failure
**Root Cause**: Testing methodology differences between agents
**Resolution**: Manual verification proved functionality working correctly
**Key Learning**: Always verify with multiple testing approaches
```

#### From Temp Document → DEVLOG.md
- Technical implementation details
- Code changes made
- Architecture decisions
- Performance improvements

Example:
```markdown
### 2025-08-05 - Chrome Compatibility Resolution
- Implemented comprehensive cross-browser testing suite
- Added manual verification scripts for visual confirmation
- Confirmed Nominatim API integration working across all browsers
```

#### From Temp Document → CLAUDE.md
- New patterns discovered
- Updated guidelines or standards
- Agent coordination improvements
- Quality standards refinements

### 2. Git Worktree Cleanup

```bash
# Navigate to main repository
cd C:\Users\Rachel\Desktop\SmartPack

# Verify on main branch
git checkout main

# Merge if not already done
git merge fix/[description]-[YYYYMMDD]

# Remove worktree
git worktree remove ../SmartPack-[task-id]

# Delete branch
git branch -d fix/[description]-[YYYYMMDD]

# Prune worktree references
git worktree prune
```

### 3. Scratchpad Update

Update the scratchpad tracker:

1. **Move to Recently Completed**:
   ```markdown
   ## Recently Completed Worktrees
   
   ### [2025-08-05] chrome-compatibility-validation
   - **Branch**: fix/chrome-autocomplete-validation-20250805
   - **Purpose**: Resolved Chrome autocomplete false positive
   - **Result**: Confirmed working, testing methodology issue identified
   - **Documentation**: Updated TROUBLESHOOTING.md with resolution
   ```

2. **Remove from Active Worktrees section**

### 4. Delete Temp Document

After confirming all valuable information is preserved:

```bash
# Delete the temp document
rm .claude/active-worktrees/[task-id].md

# Verify deletion
ls .claude/active-worktrees/
```

## Information Preservation Guidelines

### What to Preserve

**Always Preserve**:
- Bug resolution patterns
- Successful troubleshooting approaches
- Architecture insights
- Performance optimization techniques
- Agent coordination improvements

**Consider Preserving**:
- Interesting edge cases
- Testing methodologies
- Integration patterns
- Error handling approaches

**Don't Preserve**:
- Routine progress updates
- Standard implementation details
- Temporary debugging output
- Agent conversation logs

### Where to Preserve

| Information Type | Destination File | Section |
|-----------------|------------------|---------|
| Bug fixes & resolutions | TROUBLESHOOTING.md | Specific issue section |
| Technical changes | DEVLOG.md | Date-based entry |
| New patterns/guidelines | CLAUDE.md | Relevant section |
| Test methodologies | docs/testing/TEST_STRATEGIES.md | Methodology section |
| Performance insights | docs/performance/OPTIMIZATION.md | Technique section |

## Automation Support

The coordinator agent should:
1. Identify completed worktrees (status: RESOLVED)
2. Extract key information categories
3. Suggest appropriate documentation locations
4. Execute cleanup commands
5. Verify successful cleanup

## Cleanup Checklist

- [ ] Read entire temp document for valuable insights
- [ ] Extract bug resolutions to TROUBLESHOOTING.md
- [ ] Add technical changes to DEVLOG.md
- [ ] Update patterns/guidelines in CLAUDE.md
- [ ] Merge branch to main (if not done)
- [ ] Remove git worktree
- [ ] Delete git branch
- [ ] Update scratchpad tracker
- [ ] Delete temp document
- [ ] Verify cleanup with `git worktree list`

## Common Issues

### Worktree Not Removable
```bash
# Force remove if necessary
git worktree remove --force ../SmartPack-[task-id]
```

### Branch Has Unmerged Changes
```bash
# Check for unmerged changes
git log main..fix/[description]-[YYYYMMDD]

# Force delete if changes are not needed
git branch -D fix/[description]-[YYYYMMDD]
```

### Temp Document Already Deleted
- Check Recently Completed section in scratchpad for summary
- Review git log for commit messages
- Check documentation files for already-preserved information