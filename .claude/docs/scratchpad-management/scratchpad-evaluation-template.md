# Scratchpad Context Evaluation Template

## Standard Scratchpad Evaluation Protocol
Use this template for all SmartPack specialized agents:

```markdown
### Step 1: Scratchpad Context Evaluation
Read `C:\Users\Rachel\Desktop\SmartPack\.claude\scratchpad.md` and evaluate:
- **Size Check**: If >500 lines, archive completed content to permanent files
- **Relevance Check**: Identify outdated content not related to current session
- **Completion Check**: Move completed [AGENT_WORK_TYPE] to DEVLOG.md
- **Context Preservation**: Keep only active [AGENT_CONTEXT] and current session context

**Before proceeding, if scratchpad is oversized or contains completed content:**
1. Extract valuable insights (completed [AGENT_WORK_TYPE], patterns, solutions)
2. Archive to `docs/development/DEVLOG.md` with timestamp
3. Move [AGENT_SPECIFIC_PATTERNS] to permanent documentation
4. Reset scratchpad to current session template

### Step 2: Read Current Session Context
After scratchpad evaluation, understand:
- Current session objective and shipping timeline
- [AGENT_SPECIFIC_CONTEXT_ITEMS]
```

## Agent-Specific Replacements

### Bug Crusher
- AGENT_WORK_TYPE: bug investigations
- AGENT_CONTEXT: issues and current session context
- AGENT_SPECIFIC_PATTERNS: resolution patterns to `docs/development/TROUBLESHOOTING.md`
- AGENT_SPECIFIC_CONTEXT_ITEMS: Active agent findings and bug reports, Critical functional issues blocking ship, User-reported problems and symptoms

### Functional Validator
- AGENT_WORK_TYPE: validation reports
- AGENT_CONTEXT: testing requirements
- AGENT_SPECIFIC_PATTERNS: validation patterns
- AGENT_SPECIFIC_CONTEXT_ITEMS: Feature completion status and validation requirements, Previous validation attempts and results, Critical functionality that must work for shipping

### Code Fixer
- AGENT_WORK_TYPE: implementations and fixes
- AGENT_CONTEXT: implementation tasks
- AGENT_SPECIFIC_PATTERNS: coding patterns and solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: Bug fix assignments and implementation requirements, Code modification tasks and priorities, Ship-critical functionality to implement

### UI Polish Specialist
- AGENT_WORK_TYPE: UI implementations
- AGENT_CONTEXT: design tasks
- AGENT_SPECIFIC_PATTERNS: UI patterns and component solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: UI/UX enhancement requirements, Animation and transition tasks, Visual polish priorities for shipping

### UX Flow Optimizer
- AGENT_WORK_TYPE: workflow optimizations
- AGENT_CONTEXT: UX improvement tasks
- AGENT_SPECIFIC_PATTERNS: workflow patterns and UX solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: User workflow friction points, Navigation and flow improvements needed, UX optimization priorities

### Visual Designer
- AGENT_WORK_TYPE: design implementations
- AGENT_CONTEXT: design system tasks
- AGENT_SPECIFIC_PATTERNS: design patterns and system guidelines
- AGENT_SPECIFIC_CONTEXT_ITEMS: Design system requirements, Visual consistency needs, Professional design standards

### Mobile UX Specialist
- AGENT_WORK_TYPE: mobile optimizations
- AGENT_CONTEXT: mobile UX tasks
- AGENT_SPECIFIC_PATTERNS: mobile UX patterns and solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: Mobile experience requirements, Touch interaction improvements, Responsive design optimization needs

### Integration Fixer
- AGENT_WORK_TYPE: integration fixes
- AGENT_CONTEXT: API and service tasks
- AGENT_SPECIFIC_PATTERNS: integration patterns and reliability solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: API integration issues, Service reliability requirements, Error handling and fallback needs

### Performance Enhancer
- AGENT_WORK_TYPE: performance optimizations
- AGENT_CONTEXT: performance tasks
- AGENT_SPECIFIC_PATTERNS: optimization patterns and performance solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: Performance bottlenecks identified, Optimization priorities for shipping, Speed and efficiency requirements

### Architecture Analyzer
- AGENT_WORK_TYPE: system analysis
- AGENT_CONTEXT: architecture tasks
- AGENT_SPECIFIC_PATTERNS: architecture patterns and system solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: System architecture issues, Dependency problems, Build and integration failures

### Test Specialist
- AGENT_WORK_TYPE: focused testing
- AGENT_CONTEXT: specific test tasks
- AGENT_SPECIFIC_PATTERNS: testing patterns and solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: Component testing requirements, Specific test failures to fix, Targeted testing needs

### Test Auditor
- AGENT_WORK_TYPE: comprehensive testing
- AGENT_CONTEXT: system-wide test tasks
- AGENT_SPECIFIC_PATTERNS: testing patterns and coverage solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: Test infrastructure analysis needs, Coverage reporting requirements, System-wide test validation

### Coordinator
- AGENT_WORK_TYPE: coordination activities
- AGENT_CONTEXT: workflow management tasks
- AGENT_SPECIFIC_PATTERNS: coordination patterns and workflow solutions
- AGENT_SPECIFIC_CONTEXT_ITEMS: Agent coordination requirements, Timeline management needs, Priority assessment tasks

### Context Extractor
- AGENT_WORK_TYPE: context analysis
- AGENT_CONTEXT: conversation analysis tasks
- AGENT_SPECIFIC_PATTERNS: context patterns and extraction methods
- AGENT_SPECIFIC_CONTEXT_ITEMS: Conversation analysis requirements, Context preservation needs, Documentation update tasks