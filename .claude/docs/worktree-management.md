# Worktree Management Guide for SmartPack Agents

## Overview
When agents need to create temporary files during bug investigation or feature development, they must use the `.claude/active-worktrees/` directory structure to keep the main codebase clean.

## Directory Structure
```
.claude/
├── active-worktrees/      # All temporary agent work files
│   ├── [task-id]/         # Task-specific directory
│   │   ├── debug-*.js     # Debug scripts
│   │   ├── test-*.js      # Test scripts
│   │   ├── *.png          # Screenshots
│   │   ├── *.xml          # Test results
│   │   └── notes.md       # Task-specific notes
│   └── README.md          # This guide
└── scratchpad.md          # Active session context
```

## Worktree Protocol for Agents

### 1. Creating a Worktree Directory
When starting a new investigation or task that requires temporary files:

```bash
# Create task-specific directory
mkdir -p .claude/active-worktrees/[task-id]

# Example:
mkdir -p .claude/active-worktrees/save-button-fix
mkdir -p .claude/active-worktrees/chrome-validation
```

### 2. File Creation Rules

#### ✅ CREATE in `.claude/active-worktrees/[task-id]/`:
- Debug scripts (debug-*.js)
- Test scripts (test-*.js, validate-*.js)
- Investigation logs (*.log)
- Screenshots (*.png)
- Test results (*.xml, *.json)
- Task-specific notes (notes.md, findings.md)
- Temporary data files (*.tmp, *.cache)

#### ❌ NEVER CREATE in `SmartPack/SmartPack/`:
- Any debug scripts
- Test output files
- Screenshots
- Investigation logs
- Temporary files of any kind

### 3. Working with Temporary Files

```bash
# Good - Create debug script in worktree directory
cat > .claude/active-worktrees/save-button-fix/debug-validation.js << 'EOF'
// Debug script for save button validation
const validateForm = require('../../SmartPack/src/utils/validation');
// ... debug code
EOF

# Good - Save test results in worktree directory
npm test > .claude/active-worktrees/save-button-fix/test-results.log

# Bad - DON'T create in main codebase
# cat > SmartPack/debug-script.js  # ❌ WRONG
# npm test > SmartPack/results.xml  # ❌ WRONG
```

### 4. Worktree Lifecycle

#### Phase 1: Creation
```bash
# 1. Create worktree directory
mkdir -p .claude/active-worktrees/[task-id]

# 2. Update scratchpad.md with worktree entry
echo "### [task-id]" >> .claude/scratchpad.md
echo "- **Created**: $(date +%Y-%m-%d)" >> .claude/scratchpad.md
echo "- **Status**: ACTIVE" >> .claude/scratchpad.md
echo "- **Agent**: [agent-name]" >> .claude/scratchpad.md
```

#### Phase 2: Active Work
```bash
# All temporary files go in the worktree directory
cd .claude/active-worktrees/[task-id]

# Create investigation files
touch debug-script.js
touch test-results.log
touch findings.md
```

#### Phase 3: Completion
```bash
# 1. Extract valuable findings to permanent docs
# - Add to TROUBLESHOOTING.md if bug fix
# - Add to DEVLOG.md if implementation
# - Update CLAUDE.md if new patterns

# 2. Clean up or archive worktree
# Option A: Archive if valuable
mv .claude/active-worktrees/[task-id] .claude/archived-worktrees/

# Option B: Delete if no longer needed
rm -rf .claude/active-worktrees/[task-id]

# 3. Update scratchpad.md status
# Mark as COMPLETE or ARCHIVED
```

### 5. Agent-Specific Guidelines

#### bug-crusher
```bash
# Create investigation worktree
mkdir -p .claude/active-worktrees/bug-[id]
cd .claude/active-worktrees/bug-[id]

# Debug scripts and findings go here
touch debug-root-cause.js
touch reproduction-steps.md
touch fix-recommendations.md
```

#### functional-validator
```bash
# Create validation worktree
mkdir -p .claude/active-worktrees/validation-[date]
cd .claude/active-worktrees/validation-[date]

# Test results and screenshots go here
touch playwright-results.xml
touch manual-validation-*.png
touch ship-readiness-report.md
```

#### code-fixer
```bash
# Use existing worktree from bug-crusher
cd .claude/active-worktrees/bug-[id]

# Add implementation notes
touch implementation-notes.md
touch before-after-diff.txt
```

### 6. File Naming Conventions

Use clear, descriptive names with prefixes:
- `debug-*.js` - Debug scripts
- `test-*.js` - Test scripts
- `validate-*.js` - Validation scripts
- `fix-*.patch` - Code fixes
- `before-*.txt` - State before changes
- `after-*.txt` - State after changes
- `screenshot-*.png` - Visual evidence
- `log-*.txt` - Execution logs
- `report-*.md` - Investigation reports

### 7. Cleanup Protocol

#### Daily Cleanup
- Review all worktrees older than 2 days
- Archive valuable investigations
- Delete completed tasks with no historical value

#### Per-Session Cleanup
- Before ending a session, agents should:
  1. Document findings in permanent files
  2. Clean up temporary files
  3. Update scratchpad.md with completion status

### 8. Git Ignore Configuration

Ensure `.gitignore` includes:
```
# Agent worktrees
.claude/active-worktrees/
.claude/archived-worktrees/
```

## Examples

### Example 1: Bug Investigation
```bash
# bug-crusher investigating save button issue
mkdir -p .claude/active-worktrees/save-button-disabled
cd .claude/active-worktrees/save-button-disabled

# Create debug script
cat > debug-validation.js << 'EOF'
const form = { tripName: 'Test', destinations: [''] };
console.log('Validation result:', validateTripForm(form));
EOF

# Run and save results
node debug-validation.js > validation-results.log

# Document findings
cat > findings.md << 'EOF'
## Root Cause
Default destinations = [''] causes permanent validation failure
## Fix
Change to destinations = [] in TripDetailsEditForm.tsx:22
EOF
```

### Example 2: Test Validation
```bash
# functional-validator running tests
mkdir -p .claude/active-worktrees/ship-validation-20250805
cd .claude/active-worktrees/ship-validation-20250805

# Run tests and save results
npm test 2>&1 | tee test-results.log
npx playwright test --reporter=json > playwright-results.json

# Take screenshots
npx playwright test --screenshot=only --output=screenshots/

# Create report
cat > ship-readiness.md << 'EOF'
## Ship Validation Results
- Core functionality: ✅ PASS
- Mobile responsive: ✅ PASS
- Save button: ✅ FIXED
EOF
```

## Enforcement

Agents MUST follow this protocol. The coordinator agent will:
1. Monitor for files created outside worktree directories
2. Request cleanup if violations detected
3. Update agent instructions if patterns emerge

## Benefits

1. **Clean Codebase**: No temporary files cluttering SmartPack/
2. **Organized Work**: Each task has its own workspace
3. **Easy Cleanup**: Simple to remove completed work
4. **Better Tracking**: Clear view of active investigations
5. **Git Clean**: Temporary files never enter version control