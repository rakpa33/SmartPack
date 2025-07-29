# Safe File Deletion Template

**Safely delete file: <FILE_PATH>**

Before deleting any file, perform these comprehensive safety checks:

## 1. Reference Analysis

- Search the entire codebase for references to this file using grep/search
- Check for imports, requires, or include statements that reference this file
- Look for relative and absolute path references
- Search for the filename (with and without extension) in all file types
- Check configuration files (package.json, tsconfig.json, etc.) for references

## 2. Documentation Cross-References

- Check all documentation files in `copilotdocs/` for links or references
- Review `copilotdocs/ARCHITECTURE.md` for architectural dependencies
- Check `copilotdocs/COMMANDS.md` for command references to this file
- Review `copilotdocs/TROUBLESHOOTING.md` for troubleshooting references
- Verify `copilotdocs/CHECKLIST.md` doesn't depend on this file
- Check `copilotdocs/DEVLOG.md` for historical context about the file

## 3. Build System Analysis

- Check if the file is referenced in build scripts or configuration
- Verify it's not part of the deployment pipeline
- Check webpack, Vite, or other bundler configurations
- Review test configurations that might depend on this file

## 4. Git and Version Control

- Check if the file is tracked in git
- Consider if deletion should be committed or if file should be gitignored instead
- Review if the file contains important historical information

## 5. Dependency Analysis

- Determine if other files functionally depend on this file
- Check for indirect dependencies through module loading
- Verify no runtime dependencies exist

## 6. Safety Validation

- Confirm the file is not critical system configuration
- Verify it's not part of the core application functionality
- Check if it's a duplicate or obsolete file
- Ensure there's a backup or the content exists elsewhere if needed

## 7. Deletion Process

Only proceed with deletion if ALL safety checks pass:

- Document the reason for deletion
- Use appropriate deletion command for the operating system
- Confirm successful deletion
- Update any documentation that referenced the deleted file

## 8. Post-Deletion Verification

- Run tests to ensure nothing is broken
- Check that the application still builds and runs correctly
- Verify no broken references remain

## Safety Guidelines

- **NEVER delete without thorough analysis**
- **When in doubt, move to a backup location first**
- **Always document the deletion reason**
- **Update references and documentation after deletion**

## Usage

Replace `<FILE_PATH>` with the actual file path you want to delete. The assistant will perform all safety checks before proceeding with deletion.
