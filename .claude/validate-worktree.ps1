# SmartPack Worktree Validation Script
# This script validates that a worktree exists before allowing code fixes
# Usage: powershell -ExecutionPolicy Bypass -File .claude\validate-worktree.ps1 -BugId "nav-001"

param(
    [Parameter(Mandatory=$true)]
    [string]$BugId
)

Write-Host "=== SmartPack Worktree Validator ===" -ForegroundColor Cyan
Write-Host "Validating worktree for Bug ID: $BugId" -ForegroundColor Yellow
Write-Host ""

$validationPassed = $true
$worktreeFound = $false
$worktreePath = ""
$worktreeBranch = ""

# Check git worktrees
Write-Host "Checking git worktrees..." -ForegroundColor Yellow
$worktrees = git worktree list --porcelain

$currentWorktree = @{}
foreach ($line in $worktrees) {
    if ($line -match '^worktree (.+)') {
        if ($currentWorktree.Count -gt 0 -and $currentWorktree.path -match "SmartPack-fix-$BugId") {
            $worktreeFound = $true
            $worktreePath = $currentWorktree.path
            $worktreeBranch = $currentWorktree.branch
            break
        }
        $currentWorktree = @{ path = $matches[1] }
    }
    elseif ($line -match '^branch (.+)') {
        $currentWorktree.branch = $matches[1]
    }
}

# Final check for last worktree
if (-not $worktreeFound -and $currentWorktree.Count -gt 0 -and $currentWorktree.path -match "SmartPack-fix-$BugId") {
    $worktreeFound = $true
    $worktreePath = $currentWorktree.path
    $worktreeBranch = $currentWorktree.branch
}

if ($worktreeFound) {
    Write-Host "[OK] Worktree found!" -ForegroundColor Green
    Write-Host "  Path: $worktreePath" -ForegroundColor Gray
    Write-Host "  Branch: $worktreeBranch" -ForegroundColor Gray
} else {
    Write-Host "[X] No worktree found for bug ID: $BugId" -ForegroundColor Red
    $validationPassed = $false
}

# Check scratchpad documentation
Write-Host ""
Write-Host "Checking scratchpad documentation..." -ForegroundColor Yellow

$scratchpadPath = Join-Path (Get-Location) ".claude\scratchpad.md"
$scratchpadValid = $false

if (Test-Path $scratchpadPath) {
    $scratchpadContent = Get-Content $scratchpadPath -Raw
    
    # Check if bug is documented in ACTIVE WORKTREES section
    if ($scratchpadContent -match "Bug ID\*\*:\s*$BugId") {
        Write-Host "[OK] Bug documented in scratchpad" -ForegroundColor Green
        
        # Extract status - simplified regex
        $pattern = "Bug ID.*?$BugId.*?Status.*?:\s*(\w+)"
        if ($scratchpadContent -match $pattern) {
            $status = $matches[1].Trim()
            Write-Host "  Current Status: $status" -ForegroundColor Gray
            
            if ($status -eq "READY-FOR-FIX" -or $status -eq "IN-PROGRESS") {
                $scratchpadValid = $true
            } else {
                Write-Host "  [!] Warning: Status should be READY-FOR-FIX or IN-PROGRESS for code fixes" -ForegroundColor Yellow
                Write-Host "  Current status is: $status" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "[X] Bug not documented in scratchpad ACTIVE WORKTREES section" -ForegroundColor Red
        $validationPassed = $false
    }
} else {
    Write-Host "[X] Scratchpad not found!" -ForegroundColor Red
    $validationPassed = $false
}

# Final validation result
Write-Host ""
Write-Host "=== Validation Result ===" -ForegroundColor Cyan

if ($validationPassed -and $worktreeFound -and $scratchpadValid) {
    Write-Host "[OK] VALIDATION PASSED" -ForegroundColor Green
    Write-Host ""
    Write-Host "You may proceed with code fixes in worktree:" -ForegroundColor Green
    Write-Host "cd $worktreePath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Remember to:" -ForegroundColor Cyan
    Write-Host "1. Update worktree status to IN-PROGRESS in scratchpad" -ForegroundColor Gray
    Write-Host "2. Work only in the worktree, not on main branch" -ForegroundColor Gray
    Write-Host "3. Update status to TESTING when fix is complete" -ForegroundColor Gray
    
    exit 0
} else {
    Write-Host "[X] VALIDATION FAILED" -ForegroundColor Red
    Write-Host ""
    Write-Host "Cannot proceed with code fixes. Issues found:" -ForegroundColor Red
    
    if (-not $worktreeFound) {
        Write-Host "- No git worktree exists for bug ID: $BugId" -ForegroundColor Red
        Write-Host "  Ask bug-crusher to create worktree first" -ForegroundColor Yellow
    }
    
    if (-not $scratchpadValid) {
        Write-Host "- Scratchpad documentation missing or invalid" -ForegroundColor Red
        Write-Host "  Ensure bug is documented with READY-FOR-FIX status" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Required worktree creation command:" -ForegroundColor Yellow
    $dateStr = Get-Date -Format 'yyyyMMdd'
    Write-Host ("git worktree add ../SmartPack-fix-" + $BugId + " -b fix/[description]-" + $dateStr) -ForegroundColor Gray
    
    exit 1
}