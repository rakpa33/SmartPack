# SmartPack Project Memory

## Project Overview
SmartPack is a travel packing application built with React 18 + TypeScript + Vite + Tailwind CSS. It features AI-powered packing suggestions via Ollama integration, localStorage-based data persistence, and comprehensive accessibility compliance.

**SHIP STATUS**: 2-day maximum shipping timeline - prioritize functional app over perfect implementation.

## Ship-Focused Agent System Architecture

### SHIP-CRITICAL AGENTS (Priority 1 - Must Work for Launch)
- **smartpack-bug-crusher**: Critical bug identification and ship-blocker resolution
- **smartpack-functional-validator**: End-to-end functionality validation and ship readiness assessment  
- **smartpack-ui-polish-specialist**: Beautiful animations, transitions, and visual polish implementation
- **smartpack-ux-flow-optimizer**: User experience flow optimization and workflow enhancement

### SHIP-QUALITY AGENTS (Priority 2 - Enhance User Experience)
- **smartpack-visual-designer**: Professional design system and visual consistency
- **smartpack-mobile-ux-specialist**: Mobile-first experience optimization and touch interactions
- **smartpack-integration-fixer**: API integration reliability and service connection optimization
- **smartpack-performance-enhancer**: Application performance optimization and speed enhancement

### FOUNDATION AGENTS (Priority 3 - Implementation Support)
- **smartpack-coordinator**: SHIP-FOCUSED workflow orchestration and agent coordination
- **smartpack-code-fixer**: Code implementation, bug fixes, and feature development
- **smartpack-architecture-analyzer**: System analysis, dependency issues, and repair planning
- **smartpack-test-specialist**: Focused component testing and test fixes (reduced priority for shipping)
- **smartpack-test-auditor**: Comprehensive system-wide test analysis (reduced priority for shipping)
- **smartpack-context-extractor**: Conversation context extraction for file preservation

### Ship-Focused Agent Workflow Pattern
1. **Information Gathering → Execution → Validation**: Always use information-gathering agents before execution agents
2. **Priority Assessment**: Ship-critical agents get immediate attention, quality agents after critical issues resolved
3. **Scratchpad Integration**: All agents read `C:\Users\Rachel\Desktop\SmartPack\.claude\scratchpad.md` for session context
4. **Progress Tracking**: Agents update progress logs and share findings via scratchpad
5. **Ship Readiness**: functional-validator makes final go/no-go shipping decisions

### Handoff Protocol Examples
- **Bug Fix Flow**: bug-crusher identifies issues → code-fixer implements fixes → functional-validator verifies
- **UX Enhancement Flow**: ux-flow-optimizer designs workflows → ui-polish-specialist implements → mobile-ux-specialist optimizes for touch
- **Design Implementation Flow**: visual-designer creates specs → ui-polish-specialist implements → performance-enhancer optimizes

## Ship-Focused Quality Standards

### SHIP-CRITICAL REQUIREMENTS (Must Have for Launch)
- **Functional Workflows**: All core user journeys work end-to-end (trip creation → AI generation → packing list)
- **No Ship Blockers**: No critical bugs that prevent core functionality
- **Mobile Responsive**: App works on mobile devices with basic touch interactions
- **Data Persistence**: User data saves and loads reliably via localStorage
- **Service Integration**: AI and weather services work with proper fallback when unavailable

### SHIP-QUALITY GOALS (Enhance If Time Permits)
- **Beautiful UI**: Professional visual design with smooth animations and transitions
- **Mobile Optimization**: 44px touch targets, optimized mobile interactions, gesture support
- **Performance**: Fast loading (LCP ≤ 3s for shipping), smooth 60fps interactions
- **Error Handling**: Graceful degradation and user-friendly error messages
- **Accessibility**: Basic screen reader support and keyboard navigation

### FOUNDATION STANDARDS (Post-Ship Implementation)
- **TypeScript Strict Mode**: No `any` types, proper type annotations, null safety
- **WCAG 2.1 AA Compliance**: Full accessibility compliance with automated testing
- **Advanced Performance**: LCP ≤ 2.5s, optimized bundles, advanced optimizations
- **Comprehensive Testing**: Full Vitest + RTL + Playwright + jest-axe coverage
- **Advanced Features**: Complex animations, advanced mobile gestures, PWA features

### Development Patterns
- **Component Architecture**: Functional components with proper TypeScript interfaces
- **State Management**: React Context + custom hooks + localStorage persistence
- **Error Handling**: Comprehensive error boundaries with user-friendly messaging
- **API Integration**: Proper error handling, loading states, timeout management

## Documentation Hierarchy & File Organization

### Documentation Hierarchy Explained
SmartPack uses a **layered documentation system** with specialized files for different purposes:

#### 1. Project Memory (Root Level)
- **`CLAUDE.md`** (this file): Project-wide memory, agent system, quality standards
- **Purpose**: Central source of truth for project guidelines and patterns
- **When to update**: Major architectural decisions, new agent patterns, quality standards

#### 2. Technical Documentation (`docs/` directory)
- **`docs/development/DEVLOG.md`**: Chronological development history
- **`docs/development/TROUBLESHOOTING.md`**: Issue resolution database
- **Purpose**: Detailed technical history and problem-solving patterns
- **When to update**: After completing features, resolving bugs, discovering patterns

#### 3. Navigation Files (Directory-Specific CLAUDE.md)
**CRITICAL - DO NOT DELETE**: These are specialized navigation aids, NOT duplicates
- **`SmartPack/CLAUDE.md`**: Main project navigation, commands, architecture
- **`SmartPack/src/CLAUDE.md`**: Source directory structure and file purposes
- **`SmartPack/src/components/CLAUDE.md`**: Component inventory and patterns
- **`SmartPack/src/hooks/CLAUDE.md`**: Hooks documentation and usage patterns

**Navigation File Benefits**:
- ✅ Reduce token usage by 60-80% for directory exploration
- ✅ Provide instant awareness of available files and patterns
- ✅ Maintain consistency across agent interactions
- ✅ Speed up development by eliminating redundant searches

#### 4. Session Context (`.claude/` directory)
- **`.claude/scratchpad.md`**: Active session context sharing between agents
- **`.claude/agents/`**: Specialized agent definitions and capabilities
- **`.claude/docs/translate-context.md`**: Context extraction workflow
- **Purpose**: Real-time coordination and context preservation
- **When to update**: During active development, before clearing conversations

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

## Ship-Focused Agent Usage Guidelines

### When to Use Each Agent (Priority Order)

#### SHIP-CRITICAL AGENTS (Use First)
- **bug-crusher**: Any broken functionality, navigation issues, workflow problems, user reports of "app not working"
- **functional-validator**: "Are we ready to ship?", end-to-end workflow validation, ship readiness assessment
- **ui-polish-specialist**: "App looks ugly", needs visual enhancement, animation implementation, modern UI feel
- **ux-flow-optimizer**: Users getting stuck, confusing workflows, navigation friction, poor user experience

#### SHIP-QUALITY AGENTS (Use After Critical Issues Resolved)
- **visual-designer**: Design inconsistencies, professional appearance needs, color/typography issues
- **mobile-ux-specialist**: Mobile experience problems, touch interaction issues, responsive design gaps
- **integration-fixer**: API failures, service reliability issues, connection problems, error handling gaps
- **performance-enhancer**: Slow app performance, loading issues, laggy interactions, optimization needs

#### FOUNDATION AGENTS (Use for Implementation Support)
- **coordinator**: Multi-agent coordination, complex workflows, session management, priority assessment
- **code-fixer**: Execute repair plans, implement features, fix bugs (receives work from information-gathering agents)
- **architecture-analyzer**: System analysis, dependency issues, build failures, repair planning
- **test-specialist/test-auditor**: Testing needs (reduced priority for 2-day shipping timeline)
- **context-extractor**: Pre-conversation-clear context preservation

### 2-Day Timeline Validation Requirements
Every ship-focused agent must:
- **Assess Ship Impact**: Is this ship-critical, ship-quality, or foundation work?
- **Read Scratchpad Context**: Understand current session objective and timeline constraints
- **Follow Information → Execution Pattern**: Information-gathering agents work before execution agents
- **Update Progress Clearly**: Specific actions taken, ship-impact assessment, next steps required
- **Validate Against Timeline**: Can this be completed within 2-day deadline?
- **Escalate Blockers**: Immediately flag any issues that could prevent shipping

## Ship-Focused Workflow Patterns

### Ship-Critical Bug Resolution (Priority 1)
1. **bug-crusher**: Identify and document ship-blocking bugs with reproduction steps
2. **code-fixer**: Implement fixes based on bug-crusher findings
3. **functional-validator**: Verify fixes work and assess remaining ship risks
4. **coordinator**: Track progress and escalate any timeline concerns

### UX/UI Enhancement for Shipping (Priority 1)
1. **ux-flow-optimizer**: Analyze user workflows and identify friction points
2. **ui-polish-specialist**: Implement smooth interactions and visual enhancements
3. **mobile-ux-specialist**: Optimize touch interactions and mobile experience
4. **functional-validator**: Validate enhanced user experience works across devices

### Professional Polish Workflow (Priority 2)
1. **visual-designer**: Create professional design system and visual specifications
2. **ui-polish-specialist**: Implement design system with animations and transitions
3. **performance-enhancer**: Optimize visual enhancements for smooth performance
4. **functional-validator**: Ensure polish doesn't break core functionality

### Service Reliability Workflow (Priority 2)
1. **integration-fixer**: Diagnose API reliability issues and implement robust error handling
2. **code-fixer**: Implement integration improvements and fallback mechanisms
3. **performance-enhancer**: Optimize API calls and caching strategies
4. **functional-validator**: Verify service reliability across different failure scenarios

### Emergency Ship-Blocker Response
1. **bug-crusher**: Immediate triage and impact assessment of critical issues
2. **architecture-analyzer**: Root cause analysis if complex system issue
3. **code-fixer**: Rapid implementation of minimal viable fix
4. **functional-validator**: Emergency validation and ship decision update

## Recent Session Summary (2025-08-04)

### Completed Work - Ship-Focused Agent System Implementation
- **Ship-Critical Agent Creation**: 4 new priority agents (bug-crusher, functional-validator, ui-polish-specialist, ux-flow-optimizer)
- **Ship-Quality Agent Creation**: 4 new enhancement agents (visual-designer, mobile-ux-specialist, integration-fixer, performance-enhancer)
- **Agent System Redesign**: Updated coordinator and code-fixer for 2-day shipping timeline focus
- **Documentation Overhaul**: Updated CLAUDE.md with ship-focused priorities and handoff protocols
- **Workflow Optimization**: Established information → execution → validation patterns

### Ship Timeline Commitment
**DEADLINE**: Maximum 2 days to ship functional, beautiful SmartPack application
**PRIORITY**: Ship-critical agents first, quality enhancements second, foundation work post-ship

### Agent Registration Status
- **Ship-Critical Agents**: 4/4 created and ready (bug-crusher, functional-validator, ui-polish-specialist, ux-flow-optimizer)
- **Ship-Quality Agents**: 4/4 created and ready (visual-designer, mobile-ux-specialist, integration-fixer, performance-enhancer)  
- **Foundation Agents**: 6/6 updated for ship-focus (coordinator, code-fixer, architecture-analyzer, test-specialist, test-auditor, context-extractor)

### Next Steps for Shipping
1. **Immediate**: Use bug-crusher to identify any current ship-blocking issues
2. **Priority**: Use functional-validator to assess current ship readiness status
3. **Enhancement**: Use ui-polish-specialist and ux-flow-optimizer to make app beautiful and intuitive
4. **Quality**: Apply ship-quality agents as time permits within 2-day deadline

This ship-focused agent system ensures SmartPack launches as a functional, beautiful travel packing application within the 2-day timeline while maintaining quality standards appropriate for immediate user adoption.