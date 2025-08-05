@echo off
REM SmartPack Worktree Validation Script (Windows)
REM Usage: validate-worktree.bat

echo 🔍 SmartPack Worktree Validation
echo ================================

REM Get current directory
set "current_dir=%CD%"
echo 📂 Current Directory: %current_dir%

REM Check if we're in a worktree
echo %current_dir% | findstr "SmartPack-fix-" >nul
if %errorlevel%==0 (
    echo ✅ WORKTREE: Detected worktree environment
    
    REM Check if we're in the SmartPack subdirectory
    echo %current_dir% | findstr "\SmartPack$" >nul
    if %errorlevel%==0 (
        echo ✅ LOCATION: In SmartPack subdirectory correct for development
    ) else (
        echo ⚠️  WARNING: Not in SmartPack subdirectory. Navigate to: cd SmartPack
    )
) else (
    echo ❌ ERROR: Not in a worktree!
    echo    Current path should contain 'SmartPack-fix-[bug-id]'
    echo    You appear to be in the main repository
    echo.
    echo 🚨 CRITICAL: All development work must happen in worktrees!
    echo    1. Create worktree: git worktree add ../SmartPack-fix-[bug-id] -b fix/[description]-[date]
    echo    2. Navigate to worktree: cd ../SmartPack-fix-[bug-id]/SmartPack
    echo    3. Run this script again to validate
    exit /b 1
)

REM Check git branch
echo.
echo 🌿 Git Branch Information:
for /f "tokens=*" %%i in ('git branch --show-current') do set "current_branch=%%i"
echo    Current Branch: %current_branch%

if "%current_branch%"=="main" (
    echo ❌ ERROR: On main branch in worktree!
    echo    This should not happen. Worktree should have feature branch.
    exit /b 1
) else (
    echo ✅ BRANCH: On feature branch correct for worktree development
)

REM Check if node_modules exists
if exist "node_modules" (
    echo ✅ DEPS: Node modules installed
) else (
    echo ⚠️  WARNING: Dependencies not installed. Run: npm install
)

REM Final validation summary
echo.
echo 📋 VALIDATION SUMMARY:
echo %current_dir% | findstr "SmartPack-fix-.*\\SmartPack$" >nul
if %errorlevel%==0 (
    if not "%current_branch%"=="main" (
        echo ✅ PASSED: Worktree environment is correctly configured
        echo    You can safely proceed with development work.
        exit /b 0
    )
)

echo ❌ FAILED: Worktree environment validation failed
echo    Fix the issues above before proceeding with development.
exit /b 1