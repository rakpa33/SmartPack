# SmartPack Git Worktree Monitor Script
# This script monitors and reports on active git worktrees for the SmartPack project

Write-Host "=== SmartPack Git Worktree Monitor ===" -ForegroundColor Cyan
Write-Host ""

# Get the current directory
$currentDir = Get-Location

# Check if we're in a git repository
try {
    $gitStatus = git status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Not in a git repository!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: Git not found or not in a git repository!" -ForegroundColor Red
    exit 1
}

# List all worktrees
Write-Host "Active Git Worktrees:" -ForegroundColor Yellow
Write-Host "--------------------"
$worktrees = git worktree list --porcelain

$worktreeCount = 0
$currentWorktree = @{}

foreach ($line in $worktrees) {
    if ($line -match '^worktree (.+)') {
        if ($currentWorktree.Count -gt 0) {
            # Display the previous worktree
            $worktreeCount++
            Write-Host ""
            Write-Host "Worktree #$worktreeCount" -ForegroundColor Green
            Write-Host "  Path: $($currentWorktree.path)"
            Write-Host "  Branch: $($currentWorktree.branch)"
            Write-Host "  Commit: $($currentWorktree.commit)"
            
            # Check if it's a fix branch
            if ($currentWorktree.branch -match 'fix/(.+)') {
                Write-Host "  Type: Bug Fix Branch" -ForegroundColor Magenta
                Write-Host "  Fix: $($matches[1])" -ForegroundColor Magenta
            }
        }
        $currentWorktree = @{ path = $matches[1] }
    }
    elseif ($line -match '^HEAD (.+)') {
        $currentWorktree.commit = $matches[1]
    }
    elseif ($line -match '^branch (.+)') {
        $currentWorktree.branch = $matches[1]
    }
}

# Display the last worktree
if ($currentWorktree.Count -gt 0) {
    $worktreeCount++
    Write-Host ""
    Write-Host "Worktree #$worktreeCount" -ForegroundColor Green
    Write-Host "  Path: $($currentWorktree.path)"
    Write-Host "  Branch: $($currentWorktree.branch)"
    Write-Host "  Commit: $($currentWorktree.commit)"
    
    if ($currentWorktree.branch -match 'fix/(.+)') {
        Write-Host "  Type: Bug Fix Branch" -ForegroundColor Magenta
        Write-Host "  Fix: $($matches[1])" -ForegroundColor Magenta
    }
}

Write-Host ""
Write-Host "Total worktrees: $worktreeCount" -ForegroundColor Yellow

# Check scratchpad for documented worktrees
Write-Host ""
Write-Host "Checking Scratchpad Documentation..." -ForegroundColor Yellow
Write-Host "-----------------------------------"

$scratchpadPath = Join-Path $currentDir ".claude\scratchpad.md"
if (Test-Path $scratchpadPath) {
    $scratchpadContent = Get-Content $scratchpadPath -Raw
    
    # Find the ACTIVE WORKTREES section
    if ($scratchpadContent -match '## ACTIVE WORKTREES') {
        # Count documented worktrees using the new format
        $documentedWorktrees = [regex]::Matches($scratchpadContent, '#### Worktree: ([^\n]+)')
        
        if ($documentedWorktrees.Count -eq 0) {
            Write-Host "ACTIVE WORKTREES section found but no worktrees documented" -ForegroundColor Yellow
            Write-Host "This is normal when no bugs are being actively worked on" -ForegroundColor Gray
        } else {
            Write-Host "Documented worktrees in scratchpad: $($documentedWorktrees.Count)" -ForegroundColor Green
            foreach ($match in $documentedWorktrees) {
                Write-Host "  - Worktree: $($match.Groups[1].Value)"
            }
        }
    } else {
        Write-Host "ACTIVE WORKTREES section not found in scratchpad!" -ForegroundColor Red
    }
} else {
    Write-Host "Scratchpad not found at: $scratchpadPath" -ForegroundColor Red
}

# Compare actual vs documented
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "--------"
Write-Host "Actual git worktrees: $worktreeCount"
if ($worktreeCount -eq 0) {
    Write-Host "WARNING: No worktrees are currently active!" -ForegroundColor Yellow
    Write-Host "Bug agents should create worktrees for isolated bug fixes." -ForegroundColor Yellow
}

# Check for SmartPack-fix-* directories in parent
Write-Host ""
Write-Host "Checking for worktree directories in parent folder..." -ForegroundColor Yellow
$parentDir = Split-Path $currentDir -Parent
$fixDirs = Get-ChildItem -Path $parentDir -Directory -Filter "SmartPack-fix-*" -ErrorAction SilentlyContinue

if ($fixDirs) {
    Write-Host "Found $($fixDirs.Count) SmartPack-fix-* directories:" -ForegroundColor Green
    foreach ($dir in $fixDirs) {
        Write-Host "  - $($dir.Name)"
    }
} else {
    Write-Host "No SmartPack-fix-* directories found in parent folder" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Monitor Complete ===" -ForegroundColor Cyan