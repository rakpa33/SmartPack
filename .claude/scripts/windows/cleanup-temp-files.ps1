# SmartPack Temp Files Cleanup Script
# This script finds and manages temporary test files created in wrong locations

Write-Host "=== SmartPack Temp Files Cleanup ===" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Get-Location
$smartPackDir = Join-Path $projectRoot "SmartPack"
$tempDir = Join-Path $smartPackDir "temp-test-artifacts"

# Define file patterns for temporary test files
$tempFilePatterns = @(
    "*test*.txt",
    "*test*.js", 
    "*test*.png",
    "*test*.log",
    "*test*.html",
    "*playwright-results*",
    "*playwright*.xml",
    "*debug*",
    "*temp*",
    "*screenshot*",
    "*validation*",
    "*audit*",
    "*ship-readiness*",
    "*analysis*.md"
)

# Define legitimate config files that should NOT be flagged
$legitimateFiles = @(
    "package.json",
    "package-lock.json", 
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "playwright.config.ts",
    "eslint.config.js",
    ".eslintrc.json",
    "postcss.config.js", 
    "tailwind.config.js",
    "lighthouserc.json",
    "mcp.json",
    ".gitignore",
    "README.md"
)

Write-Host "Scanning for misplaced temporary files..." -ForegroundColor Yellow
Write-Host ""

$misplacedFiles = @()

# Check SmartPack directory for temp files
foreach ($pattern in $tempFilePatterns) {
    $files = Get-ChildItem -Path $smartPackDir -Filter $pattern -File -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        # Skip if it's in the temp directory (where it should be)
        if ($file.FullName -notmatch "temp-test-artifacts") {
            # Skip legitimate config files
            if ($file.Name -notin $legitimateFiles) {
                $misplacedFiles += $file
            }
        }
    }
}

# Check root directory for temp files  
foreach ($pattern in $tempFilePatterns) {
    $files = Get-ChildItem -Path $projectRoot -Filter $pattern -File -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        # Skip legitimate config files
        if ($file.Name -notin $legitimateFiles) {
            $misplacedFiles += $file
        }
    }
}

if ($misplacedFiles.Count -eq 0) {
    Write-Host "[OK] No misplaced temporary files found!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[!] Found $($misplacedFiles.Count) misplaced temporary files:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($file in $misplacedFiles) {
        $relativePath = $file.FullName.Replace($projectRoot, ".")
        Write-Host "  - $relativePath" -ForegroundColor Red
        
        # Try to identify what created this file
        $content = ""
        try {
            if ($file.Extension -in @(".js", ".txt", ".log", ".html")) {
                $content = Get-Content $file.FullName -TotalCount 5 -ErrorAction SilentlyContinue | Out-String
                if ($content -match "playwright|functional-validator|test") {
                    Write-Host "    (Likely created by functional-validator)" -ForegroundColor Gray
                }
            }
        } catch {
            # Ignore content reading errors
        }
    }
    
    Write-Host ""
    Write-Host "CLEANUP OPTIONS:" -ForegroundColor Cyan
    Write-Host "1. Move files to proper temp directory" -ForegroundColor Gray
    Write-Host "2. Delete files (if confirmed safe)" -ForegroundColor Gray
    Write-Host "3. List files for manual review" -ForegroundColor Gray
    Write-Host ""
    
    # Create temp directory if it doesn't exist
    if (-not (Test-Path $tempDir)) {
        Write-Host "Creating temp directory: $tempDir" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }
    
    $choice = Read-Host "Choose action (1=Move, 2=Delete, 3=List, Enter=Skip)"
    
    switch ($choice) {
        "1" {
            Write-Host ""
            Write-Host "Moving files to temp directory..." -ForegroundColor Yellow
            
            foreach ($file in $misplacedFiles) {
                $destinationPath = Join-Path $tempDir $file.Name
                
                # Handle name conflicts
                $counter = 1
                while (Test-Path $destinationPath) {
                    $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
                    $ext = $file.Extension
                    $destinationPath = Join-Path $tempDir "$nameWithoutExt-$counter$ext"
                    $counter++
                }
                
                try {
                    Move-Item -Path $file.FullName -Destination $destinationPath -Force
                    Write-Host "  Moved: $($file.Name) -> temp-test-artifacts/" -ForegroundColor Green
                } catch {
                    Write-Host "  Failed to move: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
        "2" {
            Write-Host ""
            Write-Host "Deleting temporary files..." -ForegroundColor Yellow
            
            foreach ($file in $misplacedFiles) {
                try {
                    Remove-Item -Path $file.FullName -Force
                    Write-Host "  Deleted: $($file.Name)" -ForegroundColor Green
                } catch {
                    Write-Host "  Failed to delete: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
                }
            }
        }
        "3" {
            Write-Host ""
            Write-Host "File details for manual review:" -ForegroundColor Yellow
            foreach ($file in $misplacedFiles) {
                Write-Host ""
                Write-Host "File: $($file.Name)" -ForegroundColor Cyan
                Write-Host "Path: $($file.FullName)" -ForegroundColor Gray
                Write-Host "Size: $($file.Length) bytes" -ForegroundColor Gray
                Write-Host "Modified: $($file.LastWriteTime)" -ForegroundColor Gray
            }
        }
        default {
            Write-Host ""
            Write-Host "Skipping cleanup. Files remain in place." -ForegroundColor Yellow
        }
    }
}

# Check temp directory usage
Write-Host ""
Write-Host "Checking temp directory..." -ForegroundColor Yellow

if (Test-Path $tempDir) {
    $tempFiles = Get-ChildItem -Path $tempDir -File -ErrorAction SilentlyContinue
    if ($tempFiles.Count -gt 0) {
        Write-Host "[OK] Temp directory contains $($tempFiles.Count) files (proper location)" -ForegroundColor Green
        
        # Show old files that could be cleaned up
        $oldFiles = $tempFiles | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        if ($oldFiles.Count -gt 0) {
            Write-Host "[!] Found $($oldFiles.Count) temp files older than 7 days" -ForegroundColor Yellow
            Write-Host "Consider cleaning up old temp files to save space" -ForegroundColor Gray
        }
    } else {
        Write-Host "[OK] Temp directory is empty" -ForegroundColor Green
    }
} else {
    Write-Host "[!] Temp directory doesn't exist yet" -ForegroundColor Yellow
    Write-Host "Creating: $tempDir" -ForegroundColor Gray
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    Write-Host "[OK] Created temp directory" -ForegroundColor Green
}

Write-Host ""
Write-Host "REMINDER FOR AGENTS:" -ForegroundColor Cyan
Write-Host "- ALWAYS create test files in SmartPack/temp-test-artifacts/" -ForegroundColor Gray
Write-Host "- NEVER create temp files in SmartPack/ or root directory" -ForegroundColor Gray
Write-Host "- Use descriptive names with timestamps" -ForegroundColor Gray
Write-Host "- Clean up after testing when possible" -ForegroundColor Gray

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Cyan