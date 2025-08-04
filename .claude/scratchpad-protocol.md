# Scratchpad Management Protocol

## Purpose
Ensure scratchpad context stays relevant and useful for ship-focused agent coordination while preserving valuable insights in permanent project files.

## Automated Clearing Triggers

### When to Clear Scratchpad:
1. **Size threshold**: >500 lines of content
2. **Session boundaries**: Major topic/objective changes
3. **Completion markers**: All active agents report objectives complete
4. **Time-based**: End of development sessions or daily work

### Before Clearing Process:
1. **Extract valuable context** using `smartpack-context-extractor`
2. **Update permanent files** with insights and patterns
3. **Preserve current session context** that's still relevant
4. **Clear outdated/completed content**

## Content Management Strategy

### Always Preserve:
- Current session objectives and progress
- Active agent coordination context
- Ship timeline and readiness status
- Unresolved issues requiring follow-up

### Archive to Permanent Files:
- **CLAUDE.md**: New patterns, workflows, quality standards
- **DEVLOG.md**: Technical changes and implementations
- **TROUBLESHOOTING.md**: Issue patterns and resolutions
- **Agent docs**: Enhanced specializations and protocols

### Safe to Clear:
- Completed debugging sessions
- Resolved issue investigations
- Outdated context from previous sessions
- Verbose agent outputs no longer needed

## Standard Scratchpad Template

```markdown
# SmartPack Session Context - [Date]

## Current Objectives
- [ ] Objective 1
- [ ] Objective 2

## Ship Status
- **Readiness**: [GO/NO-GO]
- **Critical Issues**: [List or None]
- **Timeline**: [Days remaining]

## Active Agent Context
- **Primary Agent**: [Current agent type]
- **Objective**: [What they're working on]
- **Status**: [Progress indicator]

## Recent Achievements
- Achievement 1 (timestamp)
- Achievement 2 (timestamp)

## Next Steps
1. Step 1
2. Step 2

---
[Previous session context cleared on [timestamp]]
```

## Usage Commands

### To clear scratchpad systematically:
1. Run: `smartpack-context-extractor` to extract insights
2. Update permanent files based on extraction report
3. Reset scratchpad with current template
4. Update current session status

### Regular maintenance:
- Check scratchpad size weekly
- Extract context after major bug fixes or feature completions
- Clear completed context at end of development sessions

This protocol ensures the ship-focused agent system always has clean, relevant context while preserving valuable insights for future development sessions.