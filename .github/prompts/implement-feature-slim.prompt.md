# Implement Feature

**Feature: <DESCRIPTION>**

Systematically implement features following SmartPack architecture.

## 1. Analysis & Planning

- **Feature Scope**: UI-only, backend integration, or full-stack?
- **Architecture Fit**: How does this integrate with existing components?
- **Requirements**: Clear understanding of expected behavior and constraints
- **Dependencies**: Check CHECKLIST.md for related roadmap items

## 2. Investigation & Research

### External Research

- [ ] Framework documentation (React, TypeScript, Tailwind, Headless UI)
- [ ] Accessibility patterns (WCAG 2.1 AA for feature type)
- [ ] Performance considerations for feature type
- [ ] Testing strategies for component category

### SmartPack Integration

- [ ] Similar existing patterns in codebase
- [ ] Component reuse opportunities
- [ ] State management approach (localStorage/context)
- [ ] Mobile-first design requirements

## 3. Implementation Strategy

**For Existing Modifications:**

- Maintain consistency with current patterns
- Preserve user data and backward compatibility
- Leverage existing components and utilities

**For New Features:**

- Follow React functional component patterns
- Use TypeScript strict mode
- Apply Tailwind utilities + Headless UI
- Implement proper accessibility from start

## 4. Technical Planning

### File Organization

```
src/
├── components/     # Domain-organized components
├── hooks/         # Custom business logic
├── types/         # TypeScript interfaces
├── utils/         # Helper functions
└── __tests__/     # Test files
```

### Implementation Checklist

- [ ] TypeScript interfaces defined
- [ ] Core component logic implemented
- [ ] Accessibility attributes added
- [ ] Mobile-responsive design applied
- [ ] Error handling included
- [ ] Tests written (unit + integration)

## 5. Quality Assurance

### Testing Requirements

- Unit tests with React Testing Library
- Integration tests for workflows
- Accessibility validation with axe-core
- Mobile viewport testing

### Code Quality

- [ ] TypeScript compilation successful
- [ ] ESLint passes without warnings
- [ ] Component follows established patterns
- [ ] Performance optimized (React.memo if needed)

## 6. Documentation & Completion

- Update DEVLOG.md with implementation details
- Update CHECKLIST.md progress tracking
- Add to TROUBLESHOOTING.md if issues encountered
- Update API.md if backend changes involved

**Approval Required**: Present complete plan before implementation begins.
