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

## 4. Deep Investigation and Understanding Phase

**Goal: Achieve 95-100% certainty about feature requirements and implementation approach**

### **External Research and Documentation**

- [ ] **Framework Best Practices:** Research current official documentation for React, TypeScript, Vite, Tailwind CSS, and Headless UI
- [ ] **Pattern Validation:** Verify implementation patterns against official examples and community best practices
- [ ] **Accessibility Standards:** Review WCAG 2.1 AA guidelines and modern accessibility patterns for the proposed feature type
- [ ] **Performance Considerations:** Research React performance patterns, lazy loading, and optimization techniques relevant to the feature
- [ ] **Testing Strategies:** Review current testing best practices for the specific feature type using Vitest, React Testing Library, and Playwright

### **SmartPack Integration Research**

- [ ] **Existing Codebase Analysis:** Search for similar features or patterns already implemented in SmartPack
- [ ] **Component Ecosystem:** Identify existing components that could be reused, extended, or serve as implementation models
- [ ] **State Management Patterns:** Analyze current localStorage usage and state management approaches for consistency
- [ ] **API Integration Patterns:** Review existing backend communication patterns if feature requires API integration
- [ ] **Mobile-First Considerations:** Research responsive design patterns that align with SmartPack's mobile-first approach

### **User Experience and Design Research**

- [ ] **UI Pattern Research:** Study modern UI patterns for the specific feature type from design systems and accessibility guides
- [ ] **User Flow Analysis:** Map out complete user interaction flows and edge cases
- [ ] **Cross-Platform Compatibility:** Research patterns that work well across mobile and desktop experiences
- [ ] **Dark Mode Considerations:** Review dark mode implementation patterns and color scheme accessibility

### **Confirmation Protocol**

**Before proceeding with implementation planning, confirm understanding by asking targeted questions:**

- [ ] **Feature Scope:** "Based on my research, I understand this feature should [specific behavior]. Is this correct?"
- [ ] **User Experience:** "I plan to implement this using [specific UI patterns] for accessibility and mobile-first design. Does this align with your vision?"
- [ ] **Implementation Approach:** "I propose [specific technical approach] because [research-backed reasoning]. Do you agree with this direction?"
- [ ] **Integration Points:** "This will integrate with [specific components/systems]. Are you comfortable with these integration points?"
- [ ] **Performance Impact:** "Based on research, I recommend [specific performance optimizations]. Does this fit your expectations?"

**Questions to ask when uncertain:**

- "What specific user behavior do you expect when [scenario]?"
- "Are there any design constraints or brand guidelines I should follow?"
- "How should this feature behave on mobile versus desktop?"
- "What level of accessibility compliance is required for this feature?"
- "Are there any performance requirements or constraints I should consider?"
- "Should this feature integrate with the existing AI suggestions or weather data?"
- "How should this feature handle offline scenarios and localStorage persistence?"

## 5. Implementation Plan Documentation and Approval

**Before proceeding with any code changes:**

### **Step 1: Confirm Implementation Plan**

- [ ] **Present Complete Plan:** "Based on my investigation, here's my complete implementation plan: [detailed plan with specific files, components, data flow, and technical decisions]"
- [ ] **Request Explicit Approval:** "Do you approve this implementation plan before I proceed with development?"
- [ ] **Address Any Concerns:** Continue discussion until you receive clear approval

### **Step 2: Update Project Documentation**

Before writing any code, update the appropriate documentation:

- [ ] **Update CHECKLIST.md:** Record the planned feature implementation in `docs/development/CHECKLIST.md`
- [ ] **Update DEVLOG.md:** Add entry in `docs/development/DEVLOG.md` documenting the feature requirements and planned approach
- [ ] **Update ARCHITECTURE.md:** If the feature affects system architecture, update `docs/development/ARCHITECTURE.md`
- [ ] **Update API Documentation:** If backend changes are involved, update `docs/api/API.md`
- [ ] **Update FILE_ORGANIZATION.md:** If new file patterns are introduced, document them in `docs/development/FILE_ORGANIZATION.md`

### **Step 3: Implementation Readiness Check**

- [ ] **Documentation Complete:** All relevant docs have been updated with the implementation plan
- [ ] **User Approval Confirmed:** User has explicitly approved the specific implementation approach
- [ ] **Dependencies Verified:** All required tools, libraries, and dependencies are confirmed available
- [ ] **Testing Strategy Confirmed:** Clear testing approach is documented and approved
- [ ] **Design Patterns Validated:** UI/UX patterns are confirmed to align with SmartPack design system

**Only proceed to Section 6 (Technical Planning) after completing ALL steps above.**

## 6. Technical Planning and File Organization

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

## 7. Quality and Testing Strategy

- Plan unit tests using Vitest and React Testing Library in `src/__tests__/`
- Design E2E tests using Playwright for user workflow validation
- Include accessibility checks with axe-core and Playwright assertions
- Ensure WCAG 2.1 AA compliance with semantic HTML and ARIA labels
- Plan React.memo implementation for expensive components and lazy loading for performance
- Review `copilotdocs/TESTING_GUIDELINES.md` for current testing standards and patterns

## 8. User Experience and Accessibility

- Ensure mobile-first responsive design with 3-column desktop layout support
- Implement dark mode compatibility following existing patterns
- Maintain consistent design language with current SmartPack UI
- Apply proper error handling with error boundaries
- Ensure keyboard navigation and screen reader compatibility
- Follow loading states and user feedback patterns

## 9. Implementation Execution

- Create or modify files following the planned structure
- Implement components using TypeScript strict mode
- Apply Tailwind CSS utility classes for styling
- Use Headless UI components for accessible interactive elements
- Implement proper error handling with try-catch blocks
- Ensure localStorage integration maintains data persistence
- Add comprehensive JSDoc comments for complex logic

## 10. Validation and Documentation

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
