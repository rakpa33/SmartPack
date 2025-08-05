# SmartPack Git Worktree Monitoring Guide

## Quick Check Commands

### Monitor Current Worktrees
```powershell
# Run the comprehensive monitoring script
powershell -ExecutionPolicy Bypass -File .claude\monitor-worktrees.ps1
```

### Validate Before Bug Fix
```powershell
# Validate worktree exists before code changes
powershell -ExecutionPolicy Bypass -File .claude\validate-worktree.ps1 -BugId "bug-001"
```

### Check Git Worktrees Directly
```bash
# List all active worktrees
git worktree list

# List worktrees with detailed info
git worktree list --porcelain
```

## What to Look For

### 🟢 Healthy Worktree Usage
- **Monitoring Script Shows**: Multiple worktrees for different bugs
- **Scratchpad Documents**: All worktrees properly tracked in ACTIVE WORKTREES section
- **Status Flow**: INVESTIGATING → READY-FOR-FIX → IN-PROGRESS → TESTING → READY-TO-MERGE
- **Directory Structure**: ../SmartPack-fix-* directories exist in parent folder

### 🟡 Warning Signs
- **No Worktrees**: Only main branch shown in `git worktree list`
- **Undocumented Worktrees**: Git shows worktrees but scratchpad doesn't track them
- **Stale Worktrees**: Worktrees in MERGED status that haven't been cleaned up
- **Direct Main Work**: Commits to main branch for bug fixes

### 🔴 Critical Issues
- **Bug Fixes on Main**: Code changes committed directly to main for bug fixes
- **Missing Documentation**: Active worktrees not documented in scratchpad
- **Validation Failures**: validate-worktree.ps1 fails for active bugs
- **Broken Workflow**: Code-fixer working without worktree validation

## Monitoring Schedule

### Daily Checks (Recommended)
1. Run monitoring script to verify worktree compliance
2. Check scratchpad for proper documentation
3. Review any stale worktrees for cleanup

### Before Each Bug Fix Session
1. Run validation script for the specific bug
2. Verify worktree exists and is documented
3. Confirm status is appropriate for next agent

### After Each Bug Fix Completion
1. Update worktree status in scratchpad
2. Coordinate merge when status reaches READY-TO-MERGE
3. Clean up merged worktrees

## Common Monitoring Scenarios

### Scenario 1: New Bug Reported
**Expected Workflow**:
1. Bug-crusher creates worktree immediately
2. Monitoring shows new worktree in INVESTIGATING status
3. Scratchpad documents the new worktree
4. Status progresses through workflow stages

**Red Flags**:
- Bug fix attempted without worktree creation
- Worktree exists but not documented in scratchpad
- Direct commits to main branch for the bug

### Scenario 2: Bug Fix in Progress
**Expected Workflow**:
1. Validation script passes for the bug ID
2. Worktree shows IN-PROGRESS status
3. Code-fixer working in worktree directory
4. Commits made to fix branch, not main

**Red Flags**:
- Code-fixer working on main branch
- Validation script fails for active bug
- No progress updates in scratchpad

### Scenario 3: Bug Fix Complete
**Expected Workflow**:
1. Worktree status updated to READY-TO-MERGE
2. Functional-validator tests in worktree
3. Coordinator manages merge to main
4. Worktree cleaned up after successful merge

**Red Flags**:
- Merged worktrees left uncleaned
- Status not updated after completion
- Multiple worktrees in READY-TO-MERGE causing conflicts

## Automated Monitoring Integration

### Add to CI/CD Pipeline
```yaml
# Add to build workflow
- name: Check Worktree Compliance
  run: powershell -ExecutionPolicy Bypass -File .claude\monitor-worktrees.ps1
```

### Pre-commit Hook Integration
```bash
#!/bin/sh
# Add to .git/hooks/pre-commit
if git diff --cached --name-only | grep -E '\.(ts|tsx|js|jsx)$' > /dev/null; then
    if ! powershell -ExecutionPolicy Bypass -File .claude\validate-current-branch.ps1; then
        echo "ERROR: Bug fixes must use worktrees!"
        exit 1
    fi
fi
```

### Daily Automated Reports
```powershell
# Schedule this to run daily
$report = powershell -ExecutionPolicy Bypass -File .claude\monitor-worktrees.ps1
Send-MailMessage -To "team@example.com" -Subject "SmartPack Worktree Status" -Body $report
```

## Troubleshooting Guide

### Issue: No Worktrees Found
**Diagnosis**: `git worktree list` only shows main branch
**Solution**: Agents not following worktree protocol
**Action**: Re-educate agents on mandatory worktree usage

### Issue: Undocumented Worktrees
**Diagnosis**: Git shows worktrees but scratchpad doesn't
**Solution**: Agents creating worktrees but not documenting
**Action**: Enforce scratchpad update requirement

### Issue: Stale Worktrees
**Diagnosis**: Old worktrees left after merge
**Solution**: Cleanup process not followed
**Action**: Run `git worktree prune` and update documentation

### Issue: Validation Failures
**Diagnosis**: validate-worktree.ps1 fails for active bugs
**Solution**: Worktree/documentation mismatch
**Action**: Recreate worktree or update documentation

## Compliance Metrics

Track these metrics weekly:
- **Worktree Usage Rate**: % of bug fixes using worktrees
- **Documentation Accuracy**: % of worktrees properly documented
- **Cleanup Efficiency**: Average time from merge to worktree removal
- **Validation Success Rate**: % of validation checks passing

Target goals:
- 100% worktree usage for bug fixes
- 100% documentation accuracy
- < 24 hours for cleanup after merge
- > 95% validation success rate

---

**Remember**: Consistent monitoring ensures clean, parallel development workflows!