# SmartPack Project Memory

## Project Overview
SmartPack is a travel packing application built with React 18 + TypeScript + Vite + Tailwind CSS. It features AI-powered packing suggestions via Ollama integration, localStorage-based data persistence, and comprehensive accessibility compliance.

## Agent System Architecture

### Specialized Agents
- **smartpack-coordinator**: Session management and agent recommendation
- **smartpack-test-specialist**: Focused component testing and test fixes
- **smartpack-test-auditor**: Comprehensive system-wide test analysis
- **smartpack-architecture-analyzer**: System analysis and repair planning
- **smartpack-code-fixer**: Code implementation and bug fixes
- **smartpack-context-extractor**: Conversation context extraction for file preservation (Note: May need registration in Claude Code system)

### Agent Workflow Pattern
1. All agents read `C:\Users\Rachel\Desktop\SmartPack\.claude\scratchpad.md` for session context
2. Agents update progress logs and share findings via scratchpad
3. Context flows naturally between agents through shared file
4. Session cleanup moves completed work to appropriate documentation

## Quality Standards

### Code Requirements
- **TypeScript Strict Mode**: No `any` types, proper type annotations, null safety
- **Accessibility**: WCAG 2.1 AA compliance, 44px touch targets, keyboard navigation
- **Performance**: LCP ≤ 2.5s, optimized bundles, efficient rendering
- **Testing**: Vitest + React Testing Library + Playwright + jest-axe
- **Mobile-First**: Responsive design with proper touch interaction

### Development Patterns
- **Component Architecture**: Functional components with proper TypeScript interfaces
- **State Management**: React Context + custom hooks + localStorage persistence
- **Error Handling**: Comprehensive error boundaries with user-friendly messaging
- **API Integration**: Proper error handling, loading states, timeout management

## File Organization

### Documentation Structure
- `CLAUDE.md`: Project memory (this file)
- `docs/development/DEVLOG.md`: Chronological development history
- `docs/development/TROUBLESHOOTING.md`: Issue resolution database
- `.claude/scratchpad.md`: Active session context sharing
- `.claude/agents/`: Specialized agent definitions

### Context Preservation Protocol
Before clearing conversations, use the context translation system:
1. **Extract Context**: Use smartpack-context-extractor agent to analyze conversation
2. **Update Files**: Based on extraction report, update:
   - CLAUDE.md: New patterns, guidelines, quality standards
   - DEVLOG.md: Technical changes and implementation history
   - TROUBLESHOOTING.md: New issue patterns and resolutions
   - Agent docs: Refined specializations and usage patterns
3. **Clean Session**: Reset scratchpad.md for next session
4. **Validate**: Ensure all valuable insights are preserved

**Reference**: See `.claude/translate-context.md` for detailed workflow instructions and template commands.

## Technology Stack

### Frontend
- React 18 with TypeScript (strict mode)
- Vite for build tooling and development server
- Tailwind CSS for styling with Headless UI components
- localStorage for data persistence (no cloud sync)

### Testing
- Vitest for unit and integration testing
- React Testing Library for component testing
- Playwright for E2E and browser automation
- jest-axe for accessibility compliance testing

### AI Integration
- Ollama service for local AI suggestions
- Proper error handling and fallback mechanisms
- User-friendly loading states and error messaging

## Agent Usage Guidelines

### When to Use Each Agent
- **Coordinator**: Multi-step workflows, agent selection, session setup
- **Test Specialist**: Component-specific testing, test fixes, targeted coverage
- **Test Auditor**: System-wide test analysis, comprehensive coverage reports
- **Architecture Analyzer**: Build failures, system issues, repair planning
- **Code Fixer**: Implementation, bug fixes, feature development
- **Context Extractor**: Pre-conversation-clear context preservation

### Validation Requirements
Every agent must:
- Read scratchpad.md first for context
- Update progress logs with specific actions taken
- Provide verifiable deliverables before marking work complete
- Include validation protocols to prevent claiming incomplete work
- Reference up-to-date external documentation

## Common Workflow Patterns

### Testing Focus Workflow
1. Test Auditor: Comprehensive analysis and gap identification
2. Test Specialist: Implement missing tests and fix failures
3. Architecture Analyzer: Check for architectural issues revealed by tests
4. Code Fixer: Fix functional bugs discovered through testing

### Bug Resolution Workflow
1. Architecture Analyzer: Root cause analysis and repair planning
2. Code Fixer: Implement fixes following structured repair plan
3. Test Specialist: Add regression tests and fix broken tests
4. Test Auditor: Verify system-wide impact and validate fixes

### Feature Development Workflow
1. Architecture Analyzer: Impact assessment and integration planning
2. Code Fixer: Feature implementation with proper TypeScript typing
3. Test Specialist: Component-specific test coverage
4. Test Auditor: System-wide validation and coverage verification

## Recent Session Summary (2025-08-03)

### Completed Work
- **Agent System Overhaul**: Complete redesign of all 6 SmartPack agents with clear specializations
- **Context Translation System**: Created repeatable workflow for preserving conversation insights
- **Token Optimization**: Implemented scratchpad-based context sharing for efficiency
- **Documentation**: Established CLAUDE.md, updated DEVLOG.md and TROUBLESHOOTING.md
- **Validation**: 5 of 6 agents successfully registered (context-extractor needs restart)

### Key Discovery
New agents may need Claude Code restart to register properly. Existing agents auto-register correctly.

This memory serves as the foundation for all SmartPack development sessions, ensuring consistency and quality across conversation boundaries.