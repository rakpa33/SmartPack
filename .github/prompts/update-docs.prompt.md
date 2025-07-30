# Update Documentation Template

**Update Documentation: <TRIGGER_EVENT>**

Systematically update all relevant documentation to capture recent changes, learnings, and conversations before committing code or completing development milestones.

## 1. Change Analysis and Documentation Scope Assessment

- Identify the trigger event: pre-commit, feature completion, issue resolution, or milestone completion
- Analyze recent code changes, conversations, and development activities since last documentation update
- Determine which documents need updates based on the scope of changes
- Review git diff and recent file modifications to understand implementation details
- Identify new patterns, architectural decisions, or significant learnings from recent work
- Assess cross-document relationships that may need synchronization

## 2. Systematic Context Capture from Recent Sessions

### **Conversation Analysis and Context Extraction**

Before updating individual documents, systematically extract and categorize important context from recent development sessions:

#### **Technical Problem-Solution Patterns**

- Identify specific technical problems encountered and their proven solutions
- Document systematic debugging approaches that successfully resolved issues
- Record error patterns and their categorization (NEW/PRE-EXISTING/ENVIRONMENTAL)
- Capture diagnostic techniques and validation procedures that worked

#### **Development Methodology Insights**

- Extract systematic approaches to testing, validation, and quality assurance
- Document AI assistance patterns that proved effective vs problematic approaches
- Record workflow improvements and process optimizations discovered
- Capture time-saving techniques and efficiency improvements

#### **Architecture and Implementation Evolution**

- Identify architectural decisions made during conversations and their rationale
- Document component design patterns and integration approaches discovered
- Record state management strategies and data flow solutions implemented
- Capture performance optimization techniques and their measured results

#### **Tool Usage and Configuration Insights**

- Extract framework-specific configurations and optimization techniques
- Document testing tool usage patterns and debugging approaches
- Record development environment insights and setup optimizations
- Capture CLI command patterns and automation opportunities

### **Context Preservation Checklist**

For each significant conversation topic, ensure the following context is captured:

- **What was the problem/challenge?** (Clear problem statement)
- **What approaches were tried?** (Including failed attempts and why they didn't work)
- **What was the final solution?** (Detailed implementation with code examples where relevant)
- **Why was this solution chosen?** (Decision rationale and trade-offs considered)
- **What was learned?** (Insights for future similar situations)
- **How to prevent/detect this in future?** (Prevention strategies and early warning signs)

## 3. Core Development Documentation Updates

### **DEVLOG.md Updates**

- **Chronological Context:** Document development events with complete technical context and conversation rationale
- **Feature Implementation:** Capture not just what was implemented, but why decisions were made and what alternatives were considered
- **Troubleshooting Sessions:** Record complete problem-solution cycles with root cause analysis and prevention strategies
- **Performance Work:** Document optimization techniques, measurement results, and the methodology used to achieve improvements
- **Testing Evolution:** Include testing strategy changes, coverage improvements, and reliability enhancement approaches
- **Conversation Insights:** Preserve significant technical discussions, AI assistance patterns, and development methodology discoveries
- **Context Continuity:** Ensure entries provide enough context for future developers to understand decision evolution

### **TROUBLESHOOTING.md Updates**

- **Systematic Problem Documentation:** Add new issues with complete symptom → diagnosis → solution → prevention workflow
- **AI Assistance Issues:** Document AI-specific problems (test hanging, error ignoring, incomplete validation) with proven solutions
- **Development Environment Issues:** Record setup problems, configuration challenges, and dependency management solutions
- **Testing and Quality Issues:** Include test execution problems, error categorization techniques, and validation procedures
- **Integration Challenges:** Document API integration issues, external service problems, and connectivity solutions
- **Cross-Reference Solutions:** Link solutions to relevant COMMANDS.md commands and DEVLOG.md implementation context

### **TESTING_GUIDE.md Updates**

- **Protocol Evolution:** Update testing protocols based on lessons learned from recent sessions
- **Error Analysis Improvements:** Enhance error categorization and systematic analysis methodologies
- **Tool Usage Insights:** Document testing tool optimizations and configuration improvements discovered
- **Quality Assurance Patterns:** Include new validation procedures and quality gate implementations
- **AI Testing Assistance:** Document AI assistance patterns for testing that proved effective or problematic

### **ARCHITECTURE.md Updates**

- Update component relationships and data flow patterns based on recent implementations
- Document new architectural decisions with rationale and trade-off analysis
- Revise system integration points (AI, weather API, localStorage) if modified
- Update quality requirements and metrics based on recent improvements
- Revise risk assessment and technical debt tracking
- Ensure arc42 template sections remain current and comprehensive

### **CHECKLIST.md Updates**

- Mark completed features and milestones with accurate status updates
- Add new tasks or deliverables identified during recent development
- Update acceptance criteria based on implementation learnings
- Cross-reference completed items with ROADMAP.md phase alignment
- Convert recent achievements into testable criteria for future reference
- Update progress indicators and completion percentages

## 3. Implementation and Technical Documentation Updates

### **Feature-Specific Implementation Guides**

- Update `OLLAMA_IMPLEMENTATION.md` and `OLLAMA_SETUP.md` for AI-related changes
- Revise `HEROICONS_IMPLEMENTATION.md` for UI component updates
- Update `FILE_ORGANIZATION.md` for structural or standards changes
- Modify other implementation guides based on recent feature work

### **TROUBLESHOOTING.md Updates**

- Document new issues encountered with symptoms, root causes, and verified solutions
- Update resolution strategies based on successful debugging sessions
- Add prevention strategies for recurring problems identified
- Cross-reference solutions with COMMANDS.md and DEVLOG.md entries
- Update debugging procedures and diagnostic techniques learned

### **COMMANDS.md Updates**

- Add new scripts, CLI operations, or development workflow commands discovered
- Update existing command documentation based on recent usage and improvements
- Document new testing, deployment, or debugging command patterns
- Include AI/Ollama integration commands learned during development

## 4. Testing and Quality Documentation Updates

### **Testing Documentation Updates**

- Update `TESTING_GUIDE.md` with new test patterns, utilities, or methodologies learned
- Revise `TESTING_STANDARDS.md` if new best practices were discovered or implemented
- Update `TEST_UTILITIES.md` with new helper functions or testing patterns
- Document test coverage improvements and performance optimization results

### **Quality and Standards Updates**

- Update `SECURITY.md` if security-related changes or learnings occurred
- Revise standards documents based on new conventions adopted
- Update environment and deployment documentation for configuration changes

## 5. Cross-Reference Synchronization and Consistency Checks

### **Document Cross-References**

- Ensure CHECKLIST.md progress aligns with ROADMAP.md phases and milestones
- Cross-reference DEVLOG.md entries with corresponding ARCHITECTURE.md updates
- Align TROUBLESHOOTING.md solutions with COMMANDS.md reference commands
- Verify implementation guides reference current ARCHITECTURE.md patterns
- Update ONBOARDING.md if new setup procedures or workflow changes occurred

### **Content Consistency Verification**

- Check that technical details are consistent across related documents
- Verify that version numbers, framework versions, and dependency information match
- Ensure that architectural decisions are consistently represented
- Validate that troubleshooting procedures align with current implementation

## 6. Knowledge Preservation and Context Capture

### **Conversation and Learning Documentation**

- **Technical Discussions:** Capture significant technical discussions, decision-making rationale, and alternative approaches considered
- **Problem-Solving Sessions:** Document debugging processes, root cause analysis, and solution discovery methods
- **Architecture Decisions:** Record why specific patterns were chosen, trade-offs considered, and future implications
- **Performance Insights:** Document optimization discoveries, measurement results, and performance improvement strategies
- **User Experience Evolution:** Note UX improvements, design decisions, and usability findings
- **Integration Learnings:** Capture API integration insights, external service patterns, and connectivity solutions

### **Critical Context Preservation (MANDATORY)**

#### **AI Assistant Context**

- Document AI assistance patterns that worked well (prompt engineering, debugging approaches, systematic methodologies)
- Record common AI assistance mistakes and how to avoid them (test hanging, error ignoring, incomplete analysis)
- Preserve systematic approaches developed (testing protocols, error categorization, validation procedures)

#### **Development Workflow Context**

- Document development environment nuances, setup gotchas, and configuration discoveries
- Record testing patterns that work/don't work in SmartPack's specific architecture
- Preserve troubleshooting methodologies and diagnostic procedures that proved effective

#### **Technical Implementation Context**

- Document React context patterns, localStorage strategies, and state management approaches specific to SmartPack
- Record TypeScript configuration insights, path alias solutions, and compilation optimizations
- Preserve API integration patterns, error handling strategies, and fallback mechanisms

#### **Quality Assurance Context**

- Document test execution patterns, hanging test solutions, and reliable testing approaches
- Record error categorization methods (NEW/PRE-EXISTING/ENVIRONMENTAL) and resolution strategies
- Preserve validation procedures and quality gate implementations

### **Historical Context and Evolution Tracking**

#### **Decision Evolution Documentation**

- Record how architectural decisions evolved through conversations and implementation
- Document what was tried before current solutions and why changes were made
- Preserve context about temporary solutions vs permanent architectural choices

#### **Problem Pattern Recognition**

- Document recurring problem patterns and their systematic solutions
- Record common failure modes and proven resolution approaches
- Preserve diagnostic techniques that successfully identified root causes

#### **Tool and Framework Evolution**

- Document how tool usage evolved (testing frameworks, development tools, AI assistance patterns)
- Record framework version decisions and compatibility insights
- Preserve configuration optimizations and performance improvements discovered

### **Future Reference Preparation**

#### **New Developer Onboarding Context**

- Ensure new developers understand not just what to do, but why decisions were made
- Document the evolution from initial implementation to current mature patterns
- Preserve context about what approaches were tried and abandoned (with reasons)

#### **Conversation Continuity**

- Create comprehensive context so new chat sessions can pick up where previous ones left off
- Document the current state of all major components and their implementation rationale
- Preserve ongoing challenges, known limitations, and planned improvements

#### **Maintenance and Extension Context**

- Document extension points and how to safely modify existing functionality
- Record testing strategies for validating changes to core components
- Preserve architectural constraints and design principles that should guide future changes

## 7. Documentation Quality and Completeness Review

### **Content Review**

- Verify all recent major changes are documented with appropriate detail level
- Check that code examples and references are current and accurate
- Ensure documentation follows established comment header standards
- Validate that cross-references and links are functional and relevant

### **Update Metadata**

- Update "Last Updated" timestamps on modified documents
- Increment version numbers where applicable
- Update contributor information if new patterns or major contributions occurred
- Ensure document purposes remain aligned with current content

## 8. Final Validation and Preparation for Commit

### **Documentation Completeness Check**

- Verify no significant changes or learnings were missed
- Confirm all trigger events (features, fixes, milestones) are properly documented
- Validate that future developers will have sufficient context to continue work
- Ensure documentation supports debugging, onboarding, and maintenance activities

### **Cross-Document Integrity**

- Perform final consistency check across all updated documents
- Verify that architectural decisions are coherently represented
- Confirm that implementation guides align with current codebase state
- Validate that roadmap and checklist remain synchronized

---

**COMPLETION CRITERIA:**

- ✅ All relevant documents updated with recent changes and learnings
- ✅ Cross-references synchronized and consistent across documentation
- ✅ Significant conversations and decisions preserved for future reference
- ✅ Technical context captured with sufficient detail for maintenance and onboarding
- ✅ Documentation patterns maintain established standards and comment headers
- ✅ Future development path clearly documented and accessible
