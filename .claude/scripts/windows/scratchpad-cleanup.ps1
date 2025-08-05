# SmartPack Scratchpad Cleanup and Reset Script
# This script backs up the current scratchpad and creates a clean, organized version

Write-Host "=== SmartPack Scratchpad Cleanup ===" -ForegroundColor Cyan
Write-Host ""

$scratchpadPath = ".claude\scratchpad.md"
$backupPath = ".claude\scratchpad-backup-$(Get-Date -Format 'yyyyMMdd-HHmm').md"

# Check if scratchpad exists
if (-not (Test-Path $scratchpadPath)) {
    Write-Host "[X] Scratchpad not found at: $scratchpadPath" -ForegroundColor Red
    exit 1
}

# Get current scratchpad stats
$currentLines = (Get-Content $scratchpadPath).Length
Write-Host "Current scratchpad size: $currentLines lines" -ForegroundColor Yellow

if ($currentLines -gt 200) {
    Write-Host "[!] Scratchpad is oversized (>200 lines)" -ForegroundColor Yellow
    Write-Host "This indicates agents are not managing content properly" -ForegroundColor Gray
} else {
    Write-Host "[OK] Scratchpad size is manageable" -ForegroundColor Green
}

Write-Host ""
Write-Host "CLEANUP OPTIONS:" -ForegroundColor Cyan
Write-Host "1. Backup current scratchpad and create clean template" -ForegroundColor Gray
Write-Host "2. Extract key information and reset" -ForegroundColor Gray
Write-Host "3. Archive to DEVLOG.md and reset" -ForegroundColor Gray
Write-Host "4. Cancel (no changes)" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Choose action (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Creating backup and clean template..." -ForegroundColor Yellow
        
        # Create backup
        Copy-Item $scratchpadPath $backupPath
        Write-Host "Backup created: $backupPath" -ForegroundColor Green
        
        # Create clean template
        $cleanTemplate = @"
# SmartPack Agent Scratchpad

## SESSION INSTRUCTIONS
This file serves as the shared context and communication hub for all SmartPack agents. Each agent should:
1. Read this file first to understand current session context
2. Update sections below (don't just append)
3. Keep content concise and current
4. Archive completed work to DEVLOG.md when session ends

---

## CURRENT SESSION STATUS
**Date**: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
**Objective**: [Current session goal]
**Priority**: [SHIP-CRITICAL/HIGH/MEDIUM/LOW]
**Timeline**: [Target completion]

---

## ACTIVE WORKTREES
<!-- Track all active Git worktrees for parallel bug fixing -->
<!-- REQUIRED: All bug fixes MUST use worktrees for isolation -->

### Worktree Creation Template:
``````bash
git worktree add ../SmartPack-fix-[bug-id] -b fix/[bug-description]-[YYYYMMDD]
``````

### Active Worktrees:
<!-- Update this section whenever creating/updating worktrees -->
*No active worktrees*

---

## CURRENT SHIP STATUS
**Status**: [GO/NO-GO/CONDITIONAL/IN-PROGRESS]
**Confidence**: [HIGH/MEDIUM/LOW] (%)
**Last Updated**: $(Get-Date -Format 'yyyy-MM-dd HH:mm')

### Ship Blockers:
*None identified*

### Working Features:
*To be assessed*

---

## ACTIVE TASKS
<!-- Current session tasks only -->

### Pending:
- [ ] [Task description]

### In Progress:
- [ ] [Task description] (Agent: [agent-name])

### Completed:
- [x] [Task description]

---

## AGENT PROGRESS LOG
<!-- Keep only current session entries -->

### [$(Get-Date -Format 'yyyy-MM-dd HH:mm')] - Session Start
**Session**: New session started with clean scratchpad
**Previous Content**: Archived to $backupPath

---

## NOTES
<!-- Current session notes and context -->

---
**END OF SCRATCHPAD - Keep under 200 lines**
"@

        $cleanTemplate | Out-File -FilePath $scratchpadPath -Encoding utf8
        Write-Host "Clean scratchpad template created" -ForegroundColor Green
    }
    
    "2" {
        Write-Host ""
        Write-Host "Extracting key information and resetting..." -ForegroundColor Yellow
        
        # Read current content
        $content = Get-Content $scratchpadPath -Raw
        
        # Extract key information (basic version)
        $worktrees = @()
        if ($content -match "(?s)## ACTIVE WORKTREES.*?(?=##|$)") {
            $worktreeSection = $matches[0]
            $worktreeMatches = [regex]::Matches($worktreeSection, "#### Worktree: ([^\n]+)")
            foreach ($match in $worktreeMatches) {
                $worktrees += $match.Groups[1].Value
            }
        }
        
        # Determine ship status (get the latest assessment)
        $shipStatus = "UNKNOWN"
        if ($content -match "(?s)SHIP RECOMMENDATION.*?(\*\*[^*]+\*\*)") {
            $shipStatus = $matches[1] -replace "\*", ""
        }
        
        # Create backup
        Copy-Item $scratchpadPath $backupPath
        Write-Host "Backup created: $backupPath" -ForegroundColor Green
        
        # Create template with extracted info
        $extractedTemplate = @"
# SmartPack Agent Scratchpad

## CURRENT SESSION STATUS
**Date**: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
**Objective**: Continue SmartPack development and ship readiness assessment
**Timeline**: Ship within 2-day deadline
**Previous Session**: Archived to $backupPath

---

## ACTIVE WORKTREES
### Active Worktrees:
$(if ($worktrees.Count -gt 0) { 
    $worktrees | ForEach-Object { "- **$_**: [Status to be updated]" }
} else { 
    "*No active worktrees*" 
})

---

## CURRENT SHIP STATUS
**Status**: $shipStatus
**Last Updated**: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
**Note**: Status extracted from previous session - needs verification

### Ship Assessment:
*Requires fresh assessment by functional-validator*

---

## ACTIVE TASKS
### Pending:
- [ ] Verify current ship status with fresh assessment
- [ ] Update worktree statuses
- [ ] Resolve any remaining ship blockers

---

## AGENT PROGRESS LOG

### [$(Get-Date -Format 'yyyy-MM-dd HH:mm')] - Scratchpad Reset
**Action**: Cleaned oversized scratchpad ($currentLines lines)
**Backup**: $backupPath
**Status**: Ready for organized development session

---
**END OF SCRATCHPAD**
"@

        $extractedTemplate | Out-File -FilePath $scratchpadPath -Encoding utf8
        Write-Host "Scratchpad reset with extracted key information" -ForegroundColor Green
    }
    
    "3" {
        Write-Host ""
        Write-Host "Archiving to DEVLOG.md and resetting..." -ForegroundColor Yellow
        
        # Archive to DEVLOG (simplified version)
        $devlogPath = "docs\development\DEVLOG.md"
        $archiveEntry = @"

## [$(Get-Date -Format 'yyyy-MM-dd HH:mm')] - Scratchpad Archive
**Content**: Archived oversized scratchpad ($currentLines lines)
**Backup**: $backupPath  
**Summary**: Multiple ship readiness assessments, worktree management, and development progress

"@
        
        if (Test-Path $devlogPath) {
            Add-Content -Path $devlogPath -Value $archiveEntry
            Write-Host "Content archived to DEVLOG.md" -ForegroundColor Green
        } else {
            Write-Host "DEVLOG.md not found - creating backup only" -ForegroundColor Yellow
        }
        
        # Create backup and clean template
        Copy-Item $scratchpadPath $backupPath
        Write-Host "Backup created: $backupPath" -ForegroundColor Green
        
        # Use clean template from option 1
        $cleanTemplate = @"
# SmartPack Agent Scratchpad

## CURRENT SESSION STATUS
**Date**: $(Get-Date -Format 'yyyy-MM-dd HH:mm')
**Objective**: SmartPack development - ship readiness focus
**Priority**: SHIP-CRITICAL
**Timeline**: Ship within 2-day deadline

---

## ACTIVE WORKTREES
*Content reset - agents should update with current worktrees*

---

## CURRENT SHIP STATUS
**Status**: REQUIRES_ASSESSMENT
**Note**: Previous session archived - needs fresh ship readiness evaluation

---

## ACTIVE TASKS
### Pending:
- [ ] Assess current application state
- [ ] Update worktree status
- [ ] Perform ship readiness validation

---

## AGENT PROGRESS LOG

### [$(Get-Date -Format 'yyyy-MM-dd HH:mm')] - Clean Session Start
**Action**: Reset scratchpad after archiving $currentLines lines
**Previous Session**: Archived to DEVLOG.md and $backupPath

---
**END OF SCRATCHPAD**
"@

        $cleanTemplate | Out-File -FilePath $scratchpadPath -Encoding utf8
        Write-Host "Clean scratchpad created with archived content" -ForegroundColor Green
    }
    
    "4" {
        Write-Host ""
        Write-Host "No changes made to scratchpad" -ForegroundColor Gray
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "Invalid choice. No changes made." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "IMPORTANT REMINDERS FOR AGENTS:" -ForegroundColor Cyan
Write-Host "- Keep scratchpad under 200 lines" -ForegroundColor Gray
Write-Host "- Update sections instead of just appending" -ForegroundColor Gray
Write-Host "- Archive completed work to DEVLOG.md" -ForegroundColor Gray
Write-Host "- Maintain one clear ship status section" -ForegroundColor Gray
Write-Host "- Use consistent formatting and timestamps" -ForegroundColor Gray

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Cyan