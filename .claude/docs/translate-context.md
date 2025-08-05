# Context Translation Script

## Purpose
This script provides a repeatable way to extract key context from conversations and translate it to appropriate project files before clearing conversation history.

## Usage
Run this process before clearing any significant conversation to preserve valuable insights and maintain project continuity.

## Execution Steps

### Step 1: Run Context Extraction
```
Use the smartpack-context-extractor agent to analyze the current conversation and session:
- Review scratchpad.md for completed work
- Extract key decisions and technical learnings
- Identify reusable patterns and best practices
- Categorize context for appropriate file destinations
```

### Step 2: Update Project Files
Based on the context extraction report, update:

#### CLAUDE.md (Project Memory)
- Add new agent usage patterns
- Update quality standards or requirements
- Include new workflow patterns discovered
- Enhance development guidelines

#### docs/development/DEVLOG.md
- Add chronological entry for the session
- Include technical changes and implementations  
- Document major decisions and their rationale
- List modified files and impact assessment

#### docs/development/TROUBLESHOOTING.md
- Add new issue patterns discovered
- Include resolution strategies developed
- Document prevention measures identified
- Update diagnostic procedures

#### Agent Documentation
- Refine agent specializations based on usage
- Update validation protocols that were improved
- Enhance external references discovered
- Improve input/output specifications

### Step 3: Clean Active Session
- Move completed tasks from scratchpad.md to appropriate documentation
- Reset scratchpad.md for next session
- Archive important conversation snippets if needed
- Update any agent configurations refined during the session

## Template Commands

### Context Extraction Command
```
"Run the smartpack-context-extractor agent to analyze our current conversation and session. Extract key decisions, technical learnings, workflow patterns, and any context that should be preserved before clearing this conversation. Provide a structured report with specific file updates needed."
```

### File Update Command  
```
"Based on the context extraction report, update [CLAUDE.md/DEVLOG.md/TROUBLESHOOTING.md] with the following extracted context: [specific content from extraction report]"
```

### Session Cleanup Command
```
"Clean up the scratchpad.md file by moving completed work to appropriate documentation and resetting it for the next session. Preserve any ongoing context that might be needed."
```

## Real-World Examples

### Example 1: Bug Fix Pattern Extraction
**Context**: Save button disabled issue resolved after finding default form validation error
**Extraction**:
```markdown
TROUBLESHOOTING.md Entry:
### Save Button Permanently Disabled
**Symptom**: Save button remains disabled even with valid form input
**Root Cause**: Default form state initializes destinations as [''] (array with empty string) 
**Solution**: Change destinations = [''] to destinations = [] in TripDetailsEditForm.tsx
**Prevention**: Always initialize form arrays as empty [] not with empty strings ['']
**Testing**: Verify form validation logic with all required fields populated
```

### Example 2: Agent Learning Preservation
**Context**: Integrity auditor incorrectly deleted navigation CLAUDE.md files
**Extraction**:
```markdown
Agent Update (smartpack-integrity-auditor.md):
### PROTECTED FILES - DO NOT DELETE
- Navigation CLAUDE.md files in src/, components/, hooks/ directories
- Purpose: Reduce token usage, provide quick navigation
- Action: PRESERVE these files, they are NOT duplicates
- Requirement: Read file contents before any deletion recommendation
```

### Example 3: Session Summary Template
**Context**: Completed 2-day shipping deadline validation
**Extraction**:
```markdown
DEVLOG.md Entry:
### [2025-08-05] Ship Readiness Validation Complete
**Agents Used**: functional-validator, bug-crusher, code-fixer
**Key Achievement**: Resolved save button blocker, validated ship readiness
**Technical Changes**:
- Fixed TripDetailsEditForm.tsx line 22: destinations = []
- Updated test validation to include all required form fields
- Confirmed application ready for 2-day shipping deadline
**Files Modified**: 
- src/components/TripDetailsEditForm.tsx
- playwright/ship-readiness-validation.spec.ts
**Impact**: Core workflow functional, app ready for launch
```

## Validation Checklist

Before clearing conversation:
- [ ] Context extraction completed and reviewed
- [ ] CLAUDE.md updated with new patterns/guidelines
- [ ] DEVLOG.md entry added for session work
- [ ] TROUBLESHOOTING.md updated with new insights
- [ ] Agent documentation refined as needed
- [ ] Scratchpad.md cleaned and reset
- [ ] Important conversation snippets archived
- [ ] All file updates verified and saved

## Best Practices

### What to Extract
- **Major Decisions**: Architecture choices, technology selections, process changes
- **Technical Solutions**: Bug fixes, integration patterns, optimization strategies
- **Process Improvements**: Better workflows, enhanced validation, quality upgrades
- **Lessons Learned**: What worked well, what didn't, prevention strategies

### What NOT to Extract
- Routine task completion without broader insights
- Temporary debugging steps that aren't reusable
- Conversation artifacts that don't add long-term value
- Overly specific details that won't generalize

### File Selection Guidelines
- **CLAUDE.md**: Persistent patterns, standards, and guidelines that apply across sessions
- **DEVLOG.md**: Chronological technical history with specific implementation details
- **TROUBLESHOOTING.md**: Issue resolution patterns that could recur
- **Agent docs**: Specialization improvements and usage pattern refinements

## Future Enhancements

Consider automating this process with:
- Custom Claude Code commands or aliases
- Script integration with git hooks
- Automated file update suggestions
- Context extraction quality validation

This translation process ensures valuable conversation insights are preserved and accessible for future development sessions, maintaining continuity and building institutional knowledge.