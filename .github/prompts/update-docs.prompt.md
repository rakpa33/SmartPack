# Update Documentation

**Update Documentation: <TRIGGER_EVENT>**

Systematically update SmartPack documentation following established standards.

## 1. Change Analysis

- Identify trigger: pre-commit, feature completion, issue resolution, milestone
- Review recent changes: git diff, conversations, implementation decisions
- Determine affected documents based on scope of changes
- Extract key learnings and technical patterns from recent work

## 2. Context Capture Checklist

For each significant change, document:

- **Problem:** Clear issue statement
- **Solution:** Implementation with code examples
- **Rationale:** Why this approach was chosen
- **Prevention:** How to avoid/detect similar issues

## 3. Documentation Updates

### DEVLOG.md

⚠️ **CRITICAL:** Add entries at TOP (after header), never append to bottom

- Document implementation with technical context (files, functions, code)
- Include root cause analysis and prevention measures
- Cross-reference TROUBLESHOOTING.md and CHECKLIST.md
- Preserve sufficient detail for future maintenance

### TROUBLESHOOTING.md

- Add new issues: Symptom → Root Cause → Solution → Prevention
- Update status of resolved issues with dates
- Document AI assistance patterns and common pitfalls
- Include diagnostic commands and verification steps

### CHECKLIST.md

- Update completion status (mark [x] only when ALL sub-items complete)
- Add enhanced implementation beyond original scope
- Maintain mirror structure with ROADMAP.md
- Document acceptance criteria achievements

### ARCHITECTURE.md

- Update ADRs for significant technical decisions
- Modify building block view for component changes
- Align quality requirements with implementation
- Update cross-references to detailed docs

## 4. Quality Validation

- **Cross-Reference Check:** Verify links between related documents
- **Technical Accuracy:** Test commands and code examples
- **Consistency:** Align terminology across all docs
- **Completeness:** Ensure sufficient context for AI assistance

## 5. Documentation Standards Compliance

- Follow document header standards and update guidelines
- Maintain reverse chronological order in DEVLOG.md
- Use established error categorization in TROUBLESHOOTING.md
- Reference smartpack-documentation.instructions.md for detailed standards
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

## 6. Additional Documentation Updates

### Architecture & API

- Update ARCHITECTURE.md ADRs for decisions
- Modify API.md for endpoint changes
- Update FILE_ORGANIZATION.md for new patterns

### Testing & Commands

- Update TESTING_GUIDE.md with new patterns
- Add new commands to COMMANDS.md
- Document test coverage improvements

## 7. Completion Checklist

- [ ] All relevant documents updated with sufficient technical detail
- [ ] Cross-references synchronized between related documents
- [ ] DEVLOG.md entries added at TOP with prevention measures
- [ ] Technical context preserved for future maintenance
- [ ] Documentation follows established header standards
