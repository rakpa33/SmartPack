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

## 2. Core Development Documentation Updates

### **DEVLOG.md Updates**

- Document chronological development events with technical context and rationale
- Capture major feature implementations with code changes and architectural decisions
- Record troubleshooting sessions with root cause analysis and resolution strategies
- Note performance improvements, optimization techniques, and measurement results
- Document testing strategy evolution, coverage improvements, and quality enhancements
- Include significant conversations and decision-making processes to preserve context

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

- Capture significant technical discussions and decision-making rationale
- Document alternative approaches considered and reasons for current choices
- Record performance insights, optimization discoveries, and measurement results
- Preserve debugging insights and problem-solving methodologies learned
- Note user experience improvements and design decision evolution

### **Future Reference Preparation**

- Ensure new developers can understand recent changes through documentation
- Document context that might be lost over time (conversations, temporary decisions)
- Create clear breadcrumbs for future development and maintenance
- Establish documentation patterns that scale with project growth

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
