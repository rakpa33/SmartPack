# SmartPack Development Guidelines

## Core Development Principles

### 1. Ship-Focused Development
- **2-day shipping timeline** - Prioritize functional over perfect
- **MVP First** - Core functionality before enhancements
- **User-Centric** - Focus on user workflows and experience
- **Iterative** - Ship working features, enhance later

### 2. Code Quality Standards
- **TypeScript Strict Mode** - No implicit any types
- **Accessibility First** - WCAG 2.1 AA compliance
- **Mobile First** - Design for mobile, enhance for desktop
- **Performance Aware** - LCP ≤ 2.5s, 60fps interactions

### 3. Development Workflow
- **Test-Driven** - Write tests for critical paths
- **Documentation** - Update DEVLOG.md for significant changes
- **Code Review** - Self-review before committing
- **Incremental** - Small, focused commits

## Agent System Usage

### Information → Execution → Validation Pattern
1. **Information Gathering** - Use analyzer/crusher agents first
2. **Execution** - Code-fixer implements based on analysis
3. **Validation** - Functional-validator verifies implementation

### Agent Prioritization
1. **Ship-Critical** (Priority 1)
   - bug-crusher
   - functional-validator
   - ui-polish-specialist
   - ux-flow-optimizer

2. **Ship-Quality** (Priority 2)
   - visual-designer
   - mobile-ux-specialist
   - integration-fixer
   - performance-enhancer

3. **Foundation** (Priority 3)
   - coordinator
   - code-fixer
   - architecture-analyzer
   - test agents

## Critical Protocols

### File Deletion Workflow (MANDATORY)
1. **READ FIRST** - Always read file before deletion
2. **ASSESS VALUE** - Determine if content needs preservation
3. **EXTRACT CONTEXT** - Preserve valuable content
4. **CONFIRM** - Verify what will be lost
5. **DELETE** - Only after above steps

### Worktree Protocol
1. **Switch to worktree** before making changes
2. **Verify branch** with git branch
3. **Implement in worktree** never in main
4. **UX validation** required before merge
5. **Clean up** after merge

## Testing Strategy

### Test Priorities
1. **Manual Testing** - Verify user workflows
2. **Unit Tests** - Business logic and components
3. **Integration Tests** - Component interactions
4. **E2E Tests** - Complete user journeys
5. **Accessibility Tests** - jest-axe for all components

### Quick Validation
```bash
# Targeted testing for speed
npm test -- --run ComponentName.test.tsx

# Quick quality check
npm run lint && npm run type-check
```

## Performance Guidelines

### Frontend Performance
- **Code Splitting** - Lazy load non-critical components
- **Memoization** - React.memo for expensive renders
- **Debouncing** - 750ms for user inputs
- **Optimistic Updates** - Immediate UI feedback

### Bundle Optimization
- **Tree Shaking** - Remove unused code
- **Dynamic Imports** - Load on demand
- **Asset Optimization** - Compress images, minimize CSS

## Error Handling

### User-Facing Errors
- **Clear Messages** - Explain what went wrong
- **Recovery Actions** - Suggest how to fix
- **Graceful Degradation** - Fall back when possible
- **No Technical Jargon** - User-friendly language

### Development Errors
- **Console Logging** - Development only
- **Error Boundaries** - Catch React errors
- **Try-Catch** - Async operations
- **Type Safety** - Prevent runtime errors

## Security & Privacy

### Data Handling
- **Local Storage Only** - No cloud sync
- **No Analytics** - No tracking
- **Input Sanitization** - Prevent injection
- **No Sensitive Logging** - Never log passwords/tokens

## Documentation Standards

### Code Documentation
- **Self-Documenting Code** - Clear variable/function names
- **Comments** - Only for complex logic
- **JSDoc** - For public APIs
- **Type Definitions** - Document with TypeScript

### Project Documentation
- **DEVLOG.md** - Newest entries at TOP
- **TROUBLESHOOTING.md** - Problem → Solution format
- **README.md** - Setup and usage instructions
- **CLAUDE.md** - Project memory and guidelines

## Git Best Practices

### Commit Guidelines
- **Small Commits** - One logical change
- **Clear Messages** - What and why
- **Present Tense** - "Add feature" not "Added"
- **Reference Issues** - Link to tickets if applicable

### Branch Strategy
- **feature/** - New features
- **fix/** - Bug fixes
- **chore/** - Maintenance tasks
- **Main branch** - Always deployable

## Windows Development Notes

### Line Endings
- Configure Git: `git config core.autocrlf input`
- Project uses LF line endings
- .gitattributes enforces consistency

### Process Management
- Check for hanging processes before testing
- Use `npm run cleanup` to kill Node processes
- PowerShell or Command Prompt both work

### Path Handling
- Use forward slashes in code
- Path aliases configured in tsconfig
- Absolute imports preferred

## Quick Decision Guide

### Should I Write a Test?
- Core user workflow? → YES
- Business logic? → YES
- UI-only change? → Maybe
- Utility function? → YES

### Should I Use an Agent?
- Bug investigation? → bug-crusher
- Code implementation? → code-fixer
- Ship readiness? → functional-validator
- UX improvement? → ux-flow-optimizer

### Should I Document This?
- Breaking change? → YES (DEVLOG)
- New pattern? → YES (CLAUDE.md)
- Bug solution? → YES (TROUBLESHOOTING)
- Minor refactor? → NO

## Common Pitfalls to Avoid

1. **Don't edit main branch** when worktree exists
2. **Don't skip UX validation** before closing worktrees
3. **Don't delete files** without reading first
4. **Don't add complexity** without clear benefit
5. **Don't ignore mobile** experience
6. **Don't break accessibility** for visual improvements
7. **Don't commit** without running lint and type-check