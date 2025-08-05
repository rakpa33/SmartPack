# SmartPack Worktree Compliance Checker
# This script prevents bug fixes from being committed to main branch
# Usage: Run before any code changes to ensure worktree compliance

Write-Host "=== SmartPack Worktree Compliance Check ===" -ForegroundColor Cyan
Write-Host ""

# Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow

# Check if we're on main branch
if ($currentBranch -eq "main") {
    Write-Host ""
    Write-Host "[X] COMPLIANCE VIOLATION!" -ForegroundColor Red
    Write-Host "You are attempting to work on the main branch." -ForegroundColor Red
    Write-Host ""
    Write-Host "MANDATORY WORKTREE POLICY:" -ForegroundColor Yellow
    Write-Host "- ALL bug fixes MUST use isolated git worktrees" -ForegroundColor Gray
    Write-Host "- NEVER commit bug fixes directly to main branch" -ForegroundColor Gray
    Write-Host "- Main branch is only for merging completed fixes" -ForegroundColor Gray
    Write-Host ""
    
    # Check scratchpad for any active bugs that need worktrees
    $scratchpadPath = Join-Path (Get-Location) ".claude\scratchpad.md"
    if (Test-Path $scratchpadPath) {
        $scratchpadContent = Get-Content $scratchpadPath -Raw
        
        # Look for active bug investigations
        if ($scratchpadContent -match "SHIP BLOCKER|CRITICAL|IN PROGRESS") {
            Write-Host "ACTIVE BUG WORK DETECTED:" -ForegroundColor Red
            Write-Host "The scratchpad shows active bug investigation work." -ForegroundColor Red
            Write-Host "This work MUST be done in a dedicated worktree!" -ForegroundColor Red
            Write-Host ""
        }
    }
    
    Write-Host "REQUIRED ACTIONS:" -ForegroundColor Yellow
    Write-Host "1. Identify the bug you're working on (e.g., 'blur-handler-001')" -ForegroundColor Gray
    Write-Host "2. Create a worktree for this bug:" -ForegroundColor Gray
    $dateStr = Get-Date -Format 'yyyyMMdd'
    Write-Host ("   git worktree add ../SmartPack-fix-[bug-id] -b fix/[description]-" + $dateStr) -ForegroundColor Cyan
    Write-Host "3. Navigate to the worktree:" -ForegroundColor Gray
    Write-Host "   cd ../SmartPack-fix-[bug-id]/SmartPack" -ForegroundColor Cyan
    Write-Host "4. Update scratchpad ACTIVE WORKTREES section" -ForegroundColor Gray
    Write-Host "5. Work in the isolated environment" -ForegroundColor Gray
    Write-Host ""
    Write-Host "COMPLIANCE CHECK FAILED!" -ForegroundColor Red
    Write-Host "Create worktree before proceeding with bug fixes." -ForegroundColor Red
    
    exit 1
}

# Check if we're on a fix branch
if ($currentBranch -match '^fix/') {
    Write-Host "[OK] Working on fix branch: $currentBranch" -ForegroundColor Green
    
    # Verify this branch has a corresponding worktree
    $worktrees = git worktree list --porcelain
    $branchFound = $false
    
    foreach ($line in $worktrees) {
        if ($line -match "^branch refs/heads/$currentBranch") {
            $branchFound = $true
            break
        }
    }
    
    if ($branchFound) {
        Write-Host "[OK] Branch has corresponding worktree" -ForegroundColor Green
        Write-Host ""
        Write-Host "COMPLIANCE CHECK PASSED!" -ForegroundColor Green
        Write-Host "You may proceed with bug fix development." -ForegroundColor Green
        exit 0
    } else {
        Write-Host "[X] WARNING: Fix branch without worktree!" -ForegroundColor Yellow
        Write-Host "Fix branch exists but no corresponding worktree found." -ForegroundColor Yellow
        Write-Host "This may indicate incomplete worktree setup." -ForegroundColor Yellow
        exit 1
    }
}

# If we're on any other branch
Write-Host "[?] Working on branch: $currentBranch" -ForegroundColor Yellow
Write-Host "Ensure this is appropriate for your current work." -ForegroundColor Yellow
Write-Host ""
Write-Host "COMPLIANCE CHECK: CONDITIONAL PASS" -ForegroundColor Yellow
Write-Host "Non-main branch detected - proceed with caution." -ForegroundColor Yellow

exit 0