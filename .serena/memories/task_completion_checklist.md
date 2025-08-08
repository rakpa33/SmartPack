# Task Completion Checklist

## Before Marking Any Task Complete

### 1. Code Quality Checks
```bash
# Run linting and auto-fix any issues
npm run lint:fix
npm run lint

# Verify TypeScript types
npm run type-check
```

### 2. Testing Requirements
```bash
# Run relevant tests
npm test -- --run AffectedComponent.test.tsx

# For larger changes, run full test suite
npm test

# Check test coverage if needed
npm run test:coverage
```

### 3. Build Verification
```bash
# Ensure production build works
npm run build
```

### 4. Manual Testing
- [ ] Test the feature/fix in the browser
- [ ] Check both desktop and mobile viewports
- [ ] Verify keyboard navigation works
- [ ] Test with screen reader if accessibility-related
- [ ] Check error scenarios and edge cases

### 5. Documentation Updates
- [ ] Update DEVLOG.md with changes (add at TOP of file)
- [ ] Update relevant documentation if APIs changed
- [ ] Add/update comments for complex logic
- [ ] Update README if setup steps changed

## Specific Scenarios

### After Adding New Component
1. Component has TypeScript props interface
2. Component has corresponding test file
3. Test includes accessibility checks (jest-axe)
4. Component is responsive (mobile-first)
5. Component follows existing patterns

### After Modifying API/Backend
1. Backend server still starts (`npm run lambda:dev`)
2. API endpoints tested manually
3. Error handling verified
4. TypeScript types updated if needed
5. Integration tests pass

### After Fixing a Bug
1. Root cause identified and documented
2. Fix tested with original reproduction steps
3. Regression test added if applicable
4. TROUBLESHOOTING.md updated with solution
5. No new issues introduced

### After Performance Optimization
1. Performance metrics measured before/after
2. No functionality regression
3. Mobile performance verified
4. Bundle size impact checked

## Final Verification

### Development Environment
```bash
# Both servers should run without errors
npm run dev:all

# No console errors in browser
# Check browser DevTools console
```

### Git Checklist
- [ ] All changes reviewed (`git diff`)
- [ ] Only intended files modified (`git status`)
- [ ] Commit message is clear and descriptive
- [ ] No secrets or sensitive data in code

## Common Issues to Check

### Windows-Specific
- Line endings are LF (not CRLF)
- No hanging Node processes before testing
- File paths use forward slashes in code

### React/TypeScript
- No TypeScript errors
- No React warnings in console
- Props properly typed
- No any types unless absolutely necessary

### Accessibility
- Interactive elements have proper ARIA labels
- Color contrast meets WCAG standards
- Focus states visible
- Keyboard navigation works

### Performance
- No unnecessary re-renders
- Large lists virtualized if needed
- Images optimized
- Bundle size reasonable

## Quality Gates

A task is NOT complete if:
- ❌ TypeScript errors exist
- ❌ ESLint errors exist (warnings may be acceptable)
- ❌ Tests are failing
- ❌ Build is broken
- ❌ Console shows errors
- ❌ Feature doesn't work on mobile
- ❌ Accessibility is broken

## Agent-Specific Requirements

When using the SmartPack agent system:
1. Information-gathering agents must complete analysis first
2. Execution agents implement based on gathered information
3. Validation agents verify the implementation
4. Update scratchpad.md with progress
5. Follow the agent handoff protocols in CLAUDE.md