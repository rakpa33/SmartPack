# Feature Implementation Template

**Implement Feature: <FEATURE_DESCRIPTION>**

Systematically analyze, plan, and implement features using SmartPack architecture and modern best practices.

## 1. Feature Analysis and Requirements Gathering

- Analyze the provided feature description, screenshots, or mockups thoroughly
- Identify if this is a modification to existing functionality or a completely new feature
- Determine the scope: UI-only, backend integration, full-stack, or infrastructure changes
- Review `copilotdocs/ARCHITECTURE.md` to understand how this feature fits into SmartPack's mobile-first, single-user design
- Reference `copilotdocs/CHECKLIST.md` to see if this feature aligns with planned roadmap items
- Ask clarifying questions if the feature requirements are ambiguous or incomplete

## 2. SmartPack Architecture Integration

- Assess how the feature integrates with React + TypeScript + Vite + Tailwind CSS + Headless UI stack
- Determine if AWS Lambda (Express/Node) + Ollama AI integration is needed
- Evaluate weather API integration requirements using Open-Meteo API
- Review localStorage persistence patterns for maintaining single-user, offline-capable functionality
- Check `copilotdocs/ARCHITECTURE.md` for component relationships and data flow patterns
- Ensure mobile-first responsive design principles are maintained

## 3. Implementation Strategy Decision

- **For Existing Feature Modifications:**

  - Analyze current implementation patterns and maintain consistency
  - Identify existing components, hooks, and utilities to leverage or modify
  - Preserve existing user data and state management approaches
  - Ensure backward compatibility with localStorage data structures

- **For New Features:**
  - Follow current React functional component patterns with TypeScript strict mode
  - Use modern ES6+ syntax and arrow functions for callbacks
  - Implement Tailwind utility classes and Headless UI components for accessibility
  - Apply React context or custom hooks for shared state management

## 4. Technical Planning and File Organization

- Determine file structure following SmartPack conventions:
  - Components in `src/components/` organized by domain
  - Custom hooks in `src/hooks/`
  - Type definitions in `src/types/`
  - Utilities in `src/utils/`
  - Styles in `src/styles/`
- Choose appropriate technologies and libraries from the approved stack
- Plan component hierarchy and data flow patterns
- Design API integration points if backend communication is required
- Reference `copilotdocs/COMMANDS.md` for available development workflows

## 5. Quality and Testing Strategy

- Plan unit tests using Vitest and React Testing Library in `src/__tests__/`
- Design E2E tests using Playwright for user workflow validation
- Include accessibility checks with axe-core and Playwright assertions
- Ensure WCAG 2.1 AA compliance with semantic HTML and ARIA labels
- Plan React.memo implementation for expensive components and lazy loading for performance
- Review `copilotdocs/TESTING_GUIDELINES.md` for current testing standards and patterns

## 6. User Experience and Accessibility

- Ensure mobile-first responsive design with 3-column desktop layout support
- Implement dark mode compatibility following existing patterns
- Maintain consistent design language with current SmartPack UI
- Apply proper error handling with error boundaries
- Ensure keyboard navigation and screen reader compatibility
- Follow loading states and user feedback patterns

## 7. Implementation Execution

- Create or modify files following the planned structure
- Implement components using TypeScript strict mode
- Apply Tailwind CSS utility classes for styling
- Use Headless UI components for accessible interactive elements
- Implement proper error handling with try-catch blocks
- Ensure localStorage integration maintains data persistence
- Add comprehensive JSDoc comments for complex logic

## 8. Validation and Documentation

- Run unit tests to validate component functionality
- Execute E2E tests to verify user workflows
- Test responsive design across mobile and desktop viewports
- Validate accessibility compliance using axe-core
- Check `copilotdocs/ENVIRONMENT.md` for proper development environment setup
- Update relevant documentation files:
  - `copilotdocs/ARCHITECTURE.md` for architectural changes
  - `copilotdocs/DEVLOG.md` for significant implementation decisions
  - `copilotdocs/CHECKLIST.md` for completed roadmap items

## Implementation Checklist

- [ ] Feature requirements clearly understood and documented
- [ ] Architecture integration plan established
- [ ] File structure and organization determined
- [ ] Component and data flow design completed
- [ ] Quality and testing strategy defined
- [ ] Implementation executed following SmartPack conventions
- [ ] All tests passing (unit, integration, E2E)
- [ ] Accessibility compliance verified
- [ ] Mobile-first responsive design validated
- [ ] Documentation updated appropriately

## Follow-up Questions to Ask User

If any aspect is unclear, ask specific questions about:

- Feature scope and complexity requirements
- UI/UX preferences or constraints
- Performance or accessibility requirements
- Integration points with existing features
- Testing coverage expectations
- Timeline or priority considerations

## Usage

Use this prompt when implementing new features or modifying existing functionality in SmartPack. Provide feature descriptions, screenshots, mockups, or requirements, and Copilot will systematically analyze and implement the feature following SmartPack architecture and best practices.
