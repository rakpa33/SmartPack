# PowerShell script to update all agent files to use temp files instead of scratchpad

$agentsToUpdate = @(
    "smartpack-visual-designer.md",
    "smartpack-mobile-ux-specialist.md", 
    "smartpack-integration-fixer.md",
    "smartpack-performance-enhancer.md",
    "smartpack-architecture-analyzer.md",
    "smartpack-test-specialist.md",
    "smartpack-test-auditor.md",
    "smartpack-integrity-auditor.md"
)

$updatesMade = @()

foreach ($agentFile in $agentsToUpdate) {
    $filePath = ".claude\agents\$agentFile"
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $originalContent = $content
        
        # Pattern 1: Update Progress Log section
        $content = $content -replace '### Step (\d+): Update Progress Log[\s\S]*?```markdown[\s\S]*?```', @'
### Step $1: Update Progress in Temp Files NOT Scratchpad
**CRITICAL**: Use temp files in .claude/active-worktrees/ for detailed updates

**WORKTREE DOCUMENTATION**:
1. **Check scratchpad** for active worktree entry and task-id
2. **Navigate to temp file**: `.claude/active-worktrees/[task-id].md`
3. **Update temp file** with detailed progress:
```markdown
## Agent Progress Log
### [TIMESTAMP] - Agent Analysis
**STATUS**: [ANALYZING/IMPLEMENTING/TESTING/COMPLETE]
**ACTIONS TAKEN**: [Detailed actions and findings]
**CURRENT PROGRESS**: [Specific status]
```

**SCRATCHPAD UPDATES** (minimal, tracking only):
- ✅ **Only update status field** in worktree entry
- ❌ **DON'T add detailed logs** to scratchpad
- ✅ **Keep scratchpad under 200 lines**
'@

        # Pattern 2: Update Scratchpad with Results section
        $content = $content -replace '### Step (\d+): Update Scratchpad with Results[\s\S]*?(?=###|$)', @'
### Step $1: Update Temp File and Scratchpad Tracker
**TEMP FILE UPDATES** (detailed documentation):
Update `.claude/active-worktrees/[task-id].md` with:
- Complete analysis and findings
- Detailed implementation notes
- Testing results and validation
- Recommendations for next steps

**SCRATCHPAD UPDATES** (minimal tracking only):
- Update worktree status field only
- Add one-line summary to worktree entry
- Keep entry under 5 lines total

'@
        
        if ($content -ne $originalContent) {
            Set-Content $filePath $content -NoNewline
            $updatesMade += $agentFile
            Write-Host "✅ Updated: $agentFile" -ForegroundColor Green
        } else {
            Write-Host "⏭️ Already updated or no matching pattern: $agentFile" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ File not found: $filePath" -ForegroundColor Red
    }
}

Write-Host "" -ForegroundColor White
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Total agents processed: $($agentsToUpdate.Count)" -ForegroundColor White
Write-Host "Successfully updated: $($updatesMade.Count)" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "Updated agents:" -ForegroundColor White
foreach ($agent in $updatesMade) {
    Write-Host "  - $agent" -ForegroundColor Green
}