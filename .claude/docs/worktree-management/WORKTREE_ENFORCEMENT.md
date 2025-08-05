# Git Worktree Enforcement Guidelines for SmartPack Agents

## Overview
This document defines the mandatory worktree workflow that all SmartPack agents MUST follow when working on bug fixes. This ensures parallel development, clean git history, and isolated testing environments.

## CRITICAL REQUIREMENT
**ALL bug fixes MUST use git worktrees. No exceptions.**

## Agent-Specific Enforcement Rules

### smartpack-bug-crusher
**MANDATORY ACTIONS:**
1. **Before ANY bug investigation**: Check if worktree already exists for the bug
2. **After bug confirmation**: IMMEDIATELY create worktree before documenting fix plan
3. **Worktree naming**: `../SmartPack-fix-[bug-id]` with branch `fix/[description]-[YYYYMMDD]`
4. **Scratchpad update**: MUST update ACTIVE WORKTREES section before handing off to code-fixer
5. **Validation**: Include worktree location in all bug reports

**ENFORCEMENT CHECKLIST:**
```markdown
- [ ] Checked for existing worktree: `git worktree list`
- [ ] Created new worktree: `git worktree add ...`
- [ ] Updated scratchpad ACTIVE WORKTREES section
- [ ] Included worktree location in bug report
- [ ] Set status to READY-FOR-FIX before handoff
```

### smartpack-code-fixer
**MANDATORY ACTIONS:**
1. **NEVER work on main branch** for bug fixes
2. **Before ANY code changes**: Verify worktree exists and navigate to it
3. **If no worktree**: STOP and request bug-crusher to create one
4. **Update status**: Change worktree status to IN-PROGRESS in scratchpad
5. **After fix**: Update status to TESTING for functional-validator

**ENFORCEMENT CHECKLIST:**
```markdown
- [ ] Verified worktree exists in scratchpad
- [ ] Navigated to worktree: `cd ../SmartPack-fix-[bug-id]/SmartPack`
- [ ] Updated worktree status to IN-PROGRESS
- [ ] Implemented fix in worktree (NOT main)
- [ ] Updated worktree status to TESTING
```

### smartpack-functional-validator
**MANDATORY ACTIONS:**
1. **Test in worktree first**: Never test fixes directly on main
2. **Verify worktree status**: Only test worktrees marked as TESTING
3. **After successful validation**: Update status to READY-TO-MERGE
4. **After failed validation**: Update status back to READY-FOR-FIX with notes

**ENFORCEMENT CHECKLIST:**
```markdown
- [ ] Located worktree in TESTING status
- [ ] Navigated to worktree for testing
- [ ] Ran all validation tests in worktree
- [ ] Updated status based on results
- [ ] Added testing notes to scratchpad
```

### smartpack-coordinator
**MANDATORY ACTIONS:**
1. **Monitor worktree compliance**: Check all agents are using worktrees
2. **Enforce workflow**: Reject any bug fixes attempted on main branch
3. **Track worktrees**: Maintain overview of all active worktrees
4. **Coordinate merges**: Ensure proper merge order for READY-TO-MERGE worktrees
5. **Cleanup management**: Track and remove merged worktrees

**ENFORCEMENT CHECKLIST:**
```markdown
- [ ] Verified all bug fixes have associated worktrees
- [ ] Checked scratchpad for worktree documentation
- [ ] Coordinated merge order for ready worktrees
- [ ] Initiated cleanup for merged worktrees
- [ ] Updated agent instructions if violations found
```

## Worktree Workflow Stages

### Stage 1: Bug Discovery (bug-crusher)
```bash
# Create worktree immediately after bug confirmation
git worktree add ../SmartPack-fix-auth-002 -b fix/auth-token-expired-20250805
cd ../SmartPack-fix-auth-002/SmartPack
npm install  # If needed
```

### Stage 2: Implementation (code-fixer)
```bash
# Navigate to assigned worktree
cd ../SmartPack-fix-auth-002/SmartPack
# Implement fix
# Commit changes
git add -A
git commit -m "fix: resolve auth token expiration issue"
```

### Stage 3: Validation (functional-validator)
```bash
# Test in worktree
cd ../SmartPack-fix-auth-002/SmartPack
npm run dev  # Test locally
npm test     # Run tests
```

### Stage 4: Merge (coordinator)
```bash
# From main branch
git merge fix/auth-token-expired-20250805
# Clean up
git worktree remove ../SmartPack-fix-auth-002
```

## Monitoring and Compliance

### Daily Worktree Check
Run the monitoring script to verify compliance:
```powershell
powershell -ExecutionPolicy Bypass -File .claude\monitor-worktrees.ps1
```

### Violation Consequences
1. **First violation**: Warning and re-education on worktree workflow
2. **Second violation**: Coordinator intervention required for all future fixes
3. **Third violation**: Agent workflow privileges revoked

## Common Worktree Commands

### Check existing worktrees
```bash
git worktree list
```

### Create new worktree
```bash
git worktree add ../SmartPack-fix-[bug-id] -b fix/[description]-[YYYYMMDD]
```

### Remove worktree after merge
```bash
git worktree remove ../SmartPack-fix-[bug-id]
```

### Clean up stale worktree references
```bash
git worktree prune
```

## Scratchpad Documentation Requirements

Each worktree MUST be documented in scratchpad with:
- Bug ID
- Branch name
- Worktree location
- Current status
- Assigned agent
- Priority level
- Creation timestamp
- Last update timestamp
- Root cause summary
- Fix plan summary

## Emergency Override
Only the coordinator can approve working directly on main branch, and only for:
1. Critical production hotfixes needed within 1 hour
2. Single-line fixes with zero risk
3. Documentation-only changes

All overrides must be documented with justification.

---

**Remember**: Worktrees ensure clean, parallel development. No worktree = No fix!