# SmartPack Scratchpad Management Rules

## 🚨 **CRITICAL PROBLEM SOLVED**
**Issue**: Scratchpad grew to 1017 lines with conflicting ship assessments and duplicate content
**Solution**: Comprehensive cleanup and management system implemented

## ✅ **MANDATORY RULES FOR ALL AGENTS**

### **1. Size Management**
- ✅ **KEEP UNDER 200 LINES** - If over 200 lines, immediately run cleanup
- ❌ **NEVER just append** - Update existing sections instead
- 🔄 **Archive completed work** to DEVLOG.md when sessions end

### **2. Content Organization**
- 📝 **UPDATE sections**, don't create new ones
- 🗂️ **Use existing structure**: Current Status → Worktrees → Ship Status → Tasks → Progress Log
- 🧹 **Remove outdated information** when adding new content

### **3. Ship Status Management**
- ⚠️ **ONE ship status only** - Update existing, don't add conflicting assessments
- 📅 **Always include timestamp** when updating ship status
- 🎯 **Clear rationale** for any status changes

### **4. Progress Log Management**
- 📆 **Latest entries at top** of progress log
- 🗄️ **Archive old entries** (>7 days) to DEVLOG.md
- ✏️ **Consolidate similar entries** instead of creating duplicates

## 🛠 **SCRATCHPAD WORKFLOW FOR AGENTS**

### **Before Writing:**
```bash
# Check scratchpad size
powershell -c "(Get-Content '.claude\scratchpad.md').Length"

# If >200 lines, run cleanup
powershell -ExecutionPolicy Bypass -File .claude\scratchpad-cleanup.ps1
```

### **When Writing:**
1. **Read entire scratchpad first**
2. **Find existing section to update**
3. **Replace/update content instead of appending**
4. **Keep additions concise and relevant**
5. **Remove outdated information**

### **Section-Specific Rules:**

#### **CURRENT SESSION STATUS**
- ✅ **Update**: Timeline, objective, priority
- ❌ **Don't add**: New session blocks

#### **ACTIVE WORKTREES**
- ✅ **Update**: Existing worktree statuses
- ✅ **Add**: New worktrees with full info
- ❌ **Don't keep**: MERGED or RESOLVED worktrees (archive them)

#### **CURRENT SHIP STATUS**
- ✅ **Update**: Single ship status with timestamp
- ❌ **Don't add**: Conflicting assessments
- ❌ **Don't keep**: Outdated status sections

#### **ACTIVE TASKS**
- ✅ **Update**: Task statuses (pending → in progress → completed)
- ✅ **Move**: Completed tasks to bottom or archive
- ❌ **Don't duplicate**: Similar tasks

#### **AGENT PROGRESS LOG**
- ✅ **Add**: New entries at TOP
- ✅ **Limit**: Keep only current session entries
- ❌ **Don't append**: At bottom (causes bloat)

## 📋 **AGENT-SPECIFIC GUIDELINES**

### **All Testing Agents** (functional-validator, test-specialist, test-auditor)
- **Update ship status** - don't create multiple assessments
- **Archive test results** to temp-test-artifacts/ folder
- **Consolidate findings** instead of listing every test

### **Bug-Crusher**
- **Close resolved bugs** - don't keep documenting fixed issues
- **Update worktree status** when investigation complete
- **Archive bug reports** to DEVLOG.md when resolved

### **Code-Fixer**
- **Update existing bug entries** with fix status
- **Don't create new sections** for each fix
- **Mark tasks completed** when done

### **Coordinator**
- **Monitor scratchpad size** before recommending agents
- **Enforce cleanup** if scratchpad >200 lines
- **Consolidate agent findings** instead of preserving everything

## 🔄 **MAINTENANCE SCHEDULE**

### **Daily** (Coordinator responsibility):
```bash
# Check scratchpad size
powershell -c "(Get-Content '.claude\scratchpad.md').Length"

# Run cleanup if needed
powershell -ExecutionPolicy Bypass -File .claude\scratchpad-cleanup.ps1
```

### **Weekly** (End of major sessions):
1. Archive completed work to DEVLOG.md
2. Remove resolved worktrees
3. Clean up outdated progress entries
4. Reset for new session focus

### **Emergency** (If >500 lines):
1. **STOP all agent work immediately**
2. **Run cleanup script with backup**
3. **Extract only essential current information**
4. **Resume with clean scratchpad**

## 🚨 **WARNING SIGNS TO WATCH FOR**

### **Size Issues:**
- Scratchpad >200 lines
- Agents complaining about "finding relevant information"
- Multiple conflicting ship assessments

### **Content Issues:**
- Duplicate bug reports
- Conflicting ship status sections
- Outdated worktree information
- Progress entries older than current session

### **Formatting Issues:**
- Inconsistent timestamp formats
- Missing section headers
- Unstructured content blocks

## 📜 **TEMPLATES FOR CONSISTENT FORMATTING**

### **Progress Log Entry:**
```markdown
### [YYYY-MM-DD HH:MM] - [Agent Name] [Action Summary] [STATUS]
**AGENT**: [AgentName]
**STATUS**: [IN_PROGRESS/COMPLETE/BLOCKED]
**ACTIONS TAKEN**: [Specific actions in 1-2 lines]
**CURRENT PROGRESS**: [Where things stand now]
```

### **Ship Status Update:**
```markdown
## CURRENT SHIP STATUS
**Status**: [GO/NO-GO/CONDITIONAL/IN-PROGRESS]
**Confidence**: [HIGH/MEDIUM/LOW] (%)
**Last Updated**: [YYYY-MM-DD HH:MM]
**Updated By**: [agent-name]

### Ship Assessment:
[Brief assessment in 1-2 lines]

### Ship Blockers:
[List current blockers or "None identified"]
```

### **Worktree Entry:**
```markdown
#### Worktree: [bug-id]
- **Bug ID**: [bug-id]
- **Branch**: fix/[description]-[YYYYMMDD]
- **Location**: ../SmartPack-fix-[bug-id]
- **Status**: [INVESTIGATING/READY-FOR-FIX/IN-PROGRESS/TESTING/READY-TO-MERGE]
- **Assigned To**: [current-agent]
- **Priority**: [SHIP-BLOCKER/HIGH/LOW]
- **Last Updated**: [YYYY-MM-DD HH:MM]
```

---

## **Summary: Clean Scratchpad = Effective Development** ✅

With these rules enforced, the scratchpad will remain:
- **📏 Under 200 lines** - manageable size
- **🎯 Single source of truth** - no conflicting information  
- **📅 Current and relevant** - outdated content archived
- **🏗️ Well-structured** - consistent formatting and organization

**Result**: Agents can quickly understand current status and contribute effectively without confusion or duplication.