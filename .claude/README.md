# .claude Directory Structure

## Directory Organization

### Core Files
- `scratchpad.md` - Active session context and worktree tracking
- `README.md` - This file, documenting the directory structure

### Subdirectories

#### `/agents/`
Specialized agent definitions for SmartPack development
- Ship-critical agents (bug-crusher, functional-validator, etc.)
- Ship-quality agents (visual-designer, mobile-ux-specialist, etc.)
- Foundation agents (coordinator, code-fixer, etc.)

#### `/active-worktrees/`
Temporary documentation for active git worktrees
- Contains detailed task tracking for in-progress work
- Files are deleted when worktrees are completed

#### `/config/`
Configuration files
- `settings.local.json` - Local Claude settings

#### `/docs/`
Documentation and processes
- `/worktree-management/` - Worktree workflow documentation
- `/scratchpad-management/` - Scratchpad protocol and rules
- `translate-context.md` - Context preservation workflow
- `TEMP_FILE_MANAGEMENT_SUMMARY.md` - Temp file handling guide

#### `/hooks/`
Git hooks and automation scripts

#### `/scripts/`
Automation and validation scripts
- `/windows/` - PowerShell and batch scripts
- `/unix/` - Shell scripts for Unix/Linux/Mac

## Important Files

### scratchpad.md
The primary context-sharing mechanism between agents. Contains:
- Active worktree tracking
- Current session information
- Ship blocker status
- Agent handoff information

### Active Worktrees
Managed through scratchpad.md and /active-worktrees/ folder:
1. Coordinator creates worktree
2. Details tracked in scratchpad.md
3. Detailed docs in /active-worktrees/
4. Cleaned up when work completes

## Usage Guidelines

1. **Keep scratchpad.md updated** - All agents must read/write session context
2. **Use subdirectories** - Don't clutter root .claude directory
3. **Clean up temp files** - Remove worktree docs when complete
4. **Document changes** - Update this README when adding new structure

## Ship Timeline Context
Current focus: 2-day shipping timeline for SmartPack
Priority: Ship-critical fixes first, quality enhancements second