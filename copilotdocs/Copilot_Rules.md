<!-- Always rules (project constitution for AI) 

Consistant prompt: CoPilot, please follow the rules in Copilot_Rules.md for all code, commits, and workflow in this repo. Reference Implementation_Plan.md for all project steps and deliverables.

-->

# SmartPack – Copilot Always Rules

1. **Reference the plan**  
   - Always load and consult `Implementation_Plan.md` for the current phase, step, and deliverables.

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
   - After major milestones or hard-to-solve issues, append a summary (decisions, changes, fixes) to `Devlog.md`.  
   - Update `Checklist.md` to reflect completed features/milestones, mirroring the structure of `Implementation_Plan.md`.

9. **Phase/step gate**  
   - Always pause and get user confirmation before moving to the next phase or step.  
   - Clearly state what comes next per the Implementation Plan.

10. **Clarification loop**  
    - If anything is unclear, request clarification or point to relevant docs instead of guessing.

11. **Code quality**  
    - Keep code commented, readable, and maintainable.