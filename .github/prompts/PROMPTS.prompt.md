<!--
Smartpack_Prompts.prompt.md
This file defines the workflow, rules, and prompt templates for working with Copilot Chat on the SmartPack project.

Last updated: July 24, 2025

How to Use:
- **Copy the bolded header and its content into chat** to trigger that workflow. Fill in any <PLACEHOLDER> as needed.
- **See `.github/COPILOT_INSTRUCTIONS.md` for project-wide AI coding and workflow guidelines.**
- **See `copilotdocs/COMMANDS.md` for all frequently used development, testing, and deployment commands. Always update this file whenever you add, remove, or change a commonly used command or script.**
- **See `copilotdocs/ONBOARDING.md` for setup and onboarding steps.**
- **See `copilotdocs/TROUBLESHOOTING.md` for common issues and solutions.**
- **See `copilotdocs/ENVIRONMENT.md` for required environment variables and usage.**
- **See `copilotdocs/ARCHITECTURE.md` for a high-level system overview.**
- **The project roadmap is in `.github/prompts/ROADMAP.md`.**
- **Table of Contents:**
  - Kickoff Phase <PHASE_NUMBER> Step <STEP_NUMBER>:
  - Proceed with Phase <PHASE_NUMBER> Step <STEP_NUMBER>:
  - Approved. Generate code and tests.
  - Troubleshoot Failing Tests:
  - Prepare Commit and Checklist Update:
  - Refresh Project Context:
  - Propose Deviation or Scope Change:
  - Request New Feature:
  - End-of-Day Wrap-up:
  - Custom Request for Phase <PHASE_NUMBER> Step <STEP_NUMBER>:
- **Each section includes bullets for:**
  - Referencing relevant files
  - Acceptance criteria
  - Dependencies/prerequisites
  - User confirmation
  - Documentation updates (where relevant)
  - Rollback plan or summary of changes (where relevant)
- **Project Rules:** Copilot will always follow the rules in the 'Copilot Always Rules' section below. You do not need to reference these unless you want to remind Copilot of a specific rule.
- **Prompt Templates:** When you want Copilot to follow a specific workflow (e.g., start a new phase, troubleshoot, request a commit), copy/paste or reference the relevant section header in your chat message.
- **Quick Nudges:** Use the single-line prompts at the bottom for fast reminders.
- **You can always ask Copilot to 'refresh context' or 'summarize progress' using the Refresh Project Context section.**
- **Prompt file location:** `.github/prompts/PROMPTS.md`

-->

---

# Copilot Always Rules

1. **Reference the plan**
   - Always load and consult `ROADMAP.md` (located in `.github/prompts/ROADMAP.md`) for the current phase, step, and deliverables.
2. **Explain first**
   - Before coding, explain in plain language **what** you will do and **why**. Wait for user approval.
3. **Generate code + comments**
   - Produce the necessary code with clear, helpful inline comments for troubleshooting.
4. **Generate tests automatically**
   - Create/update unit, integration, and/or E2E tests that verify each deliverable meets the acceptance criteria.
5. **Pass tests before completion**
   - A step is complete only when **all** relevant tests pass.
6. **Commit workflow**
   - After tests pass, generate a descriptive commit message + step checklist.
   - Prompt the user for approval before committing.
7. **Error handling**
   - If code or tests fail, stop, summarize what was attempted, and ask the user for direction or external references.
8. **Logging**
   - After major milestones or hard-to-solve issues, append a summary (decisions, changes, fixes) to `DEVLOG.md`.
   - Update `CHECKLIST.md` to reflect completed features/milestones, mirroring the structure of `ROADMAP.md`.
9. **Phase/step gate**
   - Always pause and get user confirmation before moving to the next phase or step.
   - Clearly state what comes next per the Implementation Plan.
10. **Clarification loop**
    - If anything is unclear, request clarification or point to relevant docs instead of guessing.
11. **Code quality**
    - Keep code commented, readable, and maintainable.
12. **Prompt suggestion**
    - If the user gives a command and there is a relevant or related prompt in `PROMPTS.md`, ask the user if they want you to execute that prompt before proceeding.
13. **Prompt visibility**
    - Use an emoji or symbol at the start of any prompt or question you give the user for visibility.
    - Use the same emoji for the same type of request (e.g., ✅ for approval, 🚦 for confirmation, 🛠️ for troubleshooting, 🔄 for refresh, etc.) to ensure consistency and quick recognition.
    - Do not bold or italicize the emoji or prompt.

---

# Prompt Templates

<!-- Copy and paste the bolded header (including the colon) into chat to trigger the workflow. Fill in any <PLACEHOLDER> as needed. -->

---

**Kickoff Phase <PHASE_NUMBER> Step <STEP_NUMBER>:**

- Hi Copilot Chat. Please load and obey the rules above and follow the roadmap in `ROADMAP.md`.
- Summarize objectives, planned files, and planned tests.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Ensure `CHECKLIST.md` updates match the `ROADMAP.md` for easier comparison.
- Update `CHECKLIST.md` with what needs to be done to complete <PHASE_NUMBER> <STEP_NUMBER>.
- State the first action item to execute **Phase <PHASE_NUMBER> Step <STEP_NUMBER>** and only wait for user confirmation before writing code.

---

**Proceed with Phase <PHASE_NUMBER> Step <STEP_NUMBER>:**

- Proceed with **Phase <PHASE_NUMBER> Step <STEP_NUMBER>** now.
- Summarize objectives, planned files, and planned tests.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Ensure `CHECKLIST.md` updates match the `ROADMAP.md` for easier comparison.
- Update `CHECKLIST.md` with what needs to be done to complete <PHASE_NUMBER> <STEP_NUMBER>.
- State the first action item to execute **Phase <PHASE_NUMBER> Step <STEP_NUMBER>** and only wait for user confirmation before writing code.

---

**Approved. Generate code and tests.**

---

**Troubleshoot Failing Tests:**

- Summarize the failing tests and suspected root cause.
- Suggest at least two fixes and ask for my choice.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Remember to log the outcome in `DEVLOG.md` if this is a major issue.
- Ask for user confirmation before applying a fix.

---

**Prepare Commit and Checklist Update:**

- Update `CHECKLIST.md` for this step and create new checklist items for expected next steps if not already represented or update for accuracy. Ensure checklist matches `ROADMAP.md`. Checklist items should contain details of steps taken to complete the step-- including tests to validate step/phase is complete.
- update all files in `#file:copilotdocs` based on what we've done (e.g., `DEVLOG.md`, `CHECKLIST.md`, `TROUBLESHOOTING.md`, etc.).
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Briefly describe how to revert changes if something goes wrong.
- Note if any documentation (`README.md`, `DEVLOG.md`, `CHECKLIST.md`, etc.) should be updated as part of this step.

---

**Refresh Project Context:**

- Refresh your context from the rules above, `ROADMAP.md`, and the latest `DEVLOG.md`.
- Summarize what has been completed so far and what’s next.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.

---

**Propose Deviation or Scope Change:**

- We’re deviating from the plan: <DESCRIBE_CHANGE>.
- Update `ROADMAP.md` (if permanent) and make a `DEVLOG.md` entry explaining why.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Ask for user confirmation before coding.

---

**Request New Feature:**

- Add a new feature: <FEATURE_DESCRIPTION>.
- Tell me which phase/step this fits into or propose a new step.
- Draft required code and tests, then await approval.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Ask for user confirmation before coding.

---

**End-of-Day Wrap-up:**

- Generate a `DEVLOG.md` summary of today’s work (major milestones, issues, resolutions) and a progress snapshot in `CHECKLIST.md`.
- Do not commit until I confirm.
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Note if any documentation (README, DEVLOG, CHECKLIST, etc.) should be updated as part of this step.
- Provide a summary of what was changed and why.

---

**Custom Request for Phase <PHASE_NUMBER> Step <STEP_NUMBER>:**

- <DESCRIBE_YOUR_REQUEST_OR_WORKFLOW_HERE>
- Reference relevant files for this step.
- State acceptance criteria for completion.
- List dependencies or prerequisites.
- Ask for user confirmation before proceeding.

---
