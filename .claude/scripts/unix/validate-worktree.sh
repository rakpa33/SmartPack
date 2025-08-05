#!/bin/bash
# SmartPack Worktree Validation Script
# Usage: ./validate-worktree.sh [optional-bug-id]

echo "🔍 SmartPack Worktree Validation"
echo "================================"

# Get current directory
current_dir=$(pwd)
echo "📂 Current Directory: $current_dir"

# Check if we're in a worktree
if [[ "$current_dir" == *"SmartPack-fix-"* ]]; then
    echo "✅ WORKTREE: Detected worktree environment"
    
    # Extract bug ID from path
    bug_id=$(echo "$current_dir" | grep -o 'SmartPack-fix-[^/]*' | sed 's/SmartPack-fix-//')
    echo "🏷️  Bug ID: $bug_id"
    
    # Check if we're in the SmartPack subdirectory
    if [[ "$current_dir" == *"/SmartPack" ]]; then
        echo "✅ LOCATION: In SmartPack subdirectory (correct for development)"
    else
        echo "⚠️  WARNING: Not in SmartPack subdirectory. Navigate to: cd SmartPack"
    fi
    
else
    echo "❌ ERROR: Not in a worktree!"
    echo "   Current path should contain 'SmartPack-fix-[bug-id]'"
    echo "   You appear to be in the main repository"
    echo ""
    echo "🚨 CRITICAL: All development work must happen in worktrees!"
    echo "   1. Create worktree: git worktree add ../SmartPack-fix-[bug-id] -b fix/[description]-[date]"
    echo "   2. Navigate to worktree: cd ../SmartPack-fix-[bug-id]/SmartPack"
    echo "   3. Run this script again to validate"
    exit 1
fi

# Check git branch
echo ""
echo "🌿 Git Branch Information:"
current_branch=$(git branch --show-current)
echo "   Current Branch: $current_branch"

if [[ "$current_branch" == "main" ]]; then
    echo "❌ ERROR: On main branch in worktree!"
    echo "   This should not happen. Worktree should have feature branch."
    exit 1
elif [[ "$current_branch" == fix/* ]]; then
    echo "✅ BRANCH: On feature branch (correct for worktree development)"
else
    echo "⚠️  WARNING: Branch name doesn't follow fix/* pattern"
fi

# Check if node_modules exists (dependencies installed)
if [ -d "node_modules" ]; then
    echo "✅ DEPS: Node modules installed"
else
    echo "⚠️  WARNING: Dependencies not installed. Run: npm install"
fi

# Final validation summary
echo ""
echo "📋 VALIDATION SUMMARY:"
if [[ "$current_dir" == *"SmartPack-fix-"*"/SmartPack" ]] && [[ "$current_branch" != "main" ]]; then
    echo "✅ PASSED: Worktree environment is correctly configured"
    echo "   You can safely proceed with development work."
    exit 0
else
    echo "❌ FAILED: Worktree environment validation failed"
    echo "   Fix the issues above before proceeding with development."
    exit 1
fi