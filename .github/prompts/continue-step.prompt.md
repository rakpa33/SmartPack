# Continue Step Template

**Continue with Step <STEP_NUMBER>**

Systematically continue development work on a specific roadmap step with comprehensive context gathering and planning.

## 1. Context Gathering

- Gather context of the <STEP_NUMBER> from `copilotdocs/ROADMAP.md` and `copilotdocs/CHECKLIST.md`
- Review prior conversations to ensure continuity if applicable
- Check `copilotdocs/DEVLOG.md` for recent changes or issues that might affect this step
- Review `copilotdocs/TROUBLESHOOTING.md` for known issues related to this step
- Check current progress status and any blockers from previous work

## 2. Requirements Analysis

- Reference relevant files for this step from the roadmap
- State acceptance criteria for completion based on roadmap specifications
- List dependencies or prerequisites that must be met
- Identify any changed requirements since the step was originally planned
- Verify step aligns with current project architecture and goals

## 3. Technical Planning

- Review `copilotdocs/ARCHITECTURE.md` for architecture and design patterns
- Consider best practices for the languages and frameworks used in the project
- Check `copilotdocs/COMMANDS.md` for relevant development commands and scripts
- Review `copilotdocs/TESTING_GUIDELINES.md` for testing requirements and patterns
- Plan implementation approach considering existing codebase patterns

## 4. Quality Considerations

- Consider error handling strategies and edge cases
- Plan performance optimization opportunities
- Ensure accessibility and security requirements are addressed
- Consider maintainability and code quality standards
- Plan for proper documentation and comments

## 5. Testing Strategy

- Define unit tests needed for new functionality
- Plan integration tests for component interactions
- Consider E2E tests for user workflows
- Ensure test coverage meets project standards
- Plan for both positive and negative test scenarios

## 6. Documentation Updates

- Plan updates to `copilotdocs/CHECKLIST.md` to match `copilotdocs/ROADMAP.md`
- Prepare to document significant changes or decisions in `copilotdocs/DEVLOG.md`
- Identify any architecture documentation updates needed
- Plan command documentation updates if new scripts are added

## 7. Execution Planning

- Summarize objectives, planned files, and planned tests
- Break down the step into actionable sub-tasks
- Identify the logical order of implementation
- Plan for incremental progress with validation checkpoints
- Each checklist item should clearly describe steps and validation tests

## 8. Validation Criteria

- Define how completion will be measured and validated
- Plan testing approach to verify step completion
- Ensure deliverables match roadmap expectations
- Prepare verification checklist for quality assurance

## Final Action

State the first action item to continue **Phase <PHASE_NUMBER> Step <STEP_NUMBER>** and only wait for user confirmation before writing code.

## Usage

Replace `<STEP_NUMBER>` and `<PHASE_NUMBER>` with actual values when using this prompt.
