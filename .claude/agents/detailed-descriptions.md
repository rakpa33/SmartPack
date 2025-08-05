# SmartPack Agent Detailed Descriptions

## Ship-Critical Agents

### smartpack-bug-crusher
**Purpose**: Critical bug identification and ship-blocker resolution
**When to use**: 
- App crashes or core functionality broken
- Features not working as expected
- Ship-blocking issues reported
**Special Capability**: Creates git worktrees for isolated bug investigation
**Output**: Bug report with reproduction steps, root cause, fix requirements, and worktree location

### smartpack-functional-validator
**Purpose**: End-to-end functionality validation and ship readiness
**When to use**:
- Need GO/NO-GO shipping decision
- Verify all workflows function correctly
- Final validation before ship
**Special Capability**: Tests fixes in git worktrees before approving merge
**Output**: Ship readiness assessment with confidence level and any blockers

### smartpack-ui-polish-specialist
**Purpose**: Beautiful animations, transitions, and visual polish
**When to use**:
- App looks unprofessional or unfinished
- Need smooth animations and transitions
- Visual enhancements required
**Output**: Implemented visual improvements with before/after comparison

### smartpack-ux-flow-optimizer
**Purpose**: User experience flow optimization
**When to use**:
- Users getting confused or stuck
- Workflow feels clunky or inefficient
- Navigation issues reported
**Output**: Optimized user flows with friction points resolved

## Ship-Quality Agents

### smartpack-visual-designer
**Purpose**: Professional design system and visual consistency
**When to use**:
- Need cohesive design language
- Visual inconsistencies across app
- Professional appearance needed
**Output**: Design specifications and style guide

### smartpack-mobile-ux-specialist
**Purpose**: Mobile-first experience optimization
**When to use**:
- Mobile experience not optimal
- Touch interactions need work
- Responsive design issues
**Output**: Mobile-optimized interface with proper touch targets

### smartpack-integration-fixer
**Purpose**: API integration reliability
**When to use**:
- AI/weather services failing
- API errors or timeouts
- Need robust error handling
**Output**: Reliable integrations with proper fallbacks

### smartpack-performance-enhancer
**Purpose**: Application performance optimization
**When to use**:
- App feels slow or laggy
- Long loading times
- Performance bottlenecks
**Output**: Optimized performance metrics and improvements

## Foundation Agents

### smartpack-coordinator
**Purpose**: Multi-agent workflow orchestration
**When to use**:
- Complex tasks requiring multiple agents
- Timeline management needed
- Session coordination required
**Special Capability**: Manages multiple active worktrees and merge priorities
**Output**: Coordinated workflow with timeline tracking

### smartpack-code-fixer
**Purpose**: Code implementation and bug fixes
**When to use**:
- Implementing fixes from other agents
- Feature development
- Code changes needed
**Special Capability**: Works within git worktrees for isolated bug fixing
**Output**: Implemented code changes with validation in isolated environment

### smartpack-architecture-analyzer
**Purpose**: System analysis and repair planning
**When to use**:
- Build failures or dependency issues
- Complex system problems
- Architecture questions
**Output**: System analysis with repair plan

### smartpack-test-specialist
**Purpose**: Focused component testing
**When to use**:
- Specific test failures
- New component tests needed
- Test fixes required
**Output**: Working tests for specific components

### smartpack-test-auditor
**Purpose**: Comprehensive test analysis
**When to use**:
- Full test suite audit needed
- Coverage analysis
- Test infrastructure issues
**Output**: Complete test audit with recommendations

### smartpack-context-extractor
**Purpose**: Conversation context preservation
**When to use**:
- Before clearing conversation history
- Important patterns to preserve
- Session insights to document
**Output**: Extracted context for permanent files