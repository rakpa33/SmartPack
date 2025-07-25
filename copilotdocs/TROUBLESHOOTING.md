# Troubleshooting Guide for SmartPack

Document common issues and their solutions here. Update this file as you encounter new problems.

## Common Issues

### Ollama not running

- **Symptom:** AI suggestions fail or timeout.
- **Solution:** Ensure Ollama is installed and running locally. See project README or onboarding for setup.

### AWS CLI authentication error

- **Symptom:** Lambda deploys or S3 uploads fail.
- **Solution:** Run `aws configure` and check your credentials/profile.

### Playwright test fails on Windows

- **Symptom:** E2E tests fail with OS-specific errors.
- **Solution:** Check Playwright docs for Windows setup. Try `npx playwright install`.

### Tailwind or Vite build errors

- **Symptom:** Frontend fails to build or hot reload.
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again.

### TypeScript: Cannot find type definition file for 'minimatch'

- **Symptom:** TypeScript error: `Cannot find type definition file for 'minimatch'` at the top of your project files.
- **Solutions:**
  1. Ensure no `"types": ["minimatch"]` entry exists in any `tsconfig*.json` file (including global/user-level configs).
  2. Add the following to your `package.json` to force a compatible version:
     ```json
     "overrides": {
       "@types/minimatch": "5.1.2"
     }
     ```
  3. Delete `node_modules` and all lockfiles, then run `npm install` again.
  4. Restart your editor/IDE and the TypeScript server.
  5. Check for global `@types/minimatch` with `npm ls -g @types/minimatch` and uninstall if found.
  6. Search for global/user-level `tsconfig.json` files and remove any `types` array referencing `minimatch`.
  7. Disable all non-essential editor extensions and check for workspace `.vscode/settings.json` overrides.
  8. Try a different editor or machine to rule out local config issues.
  9. **If all else fails, install minimatch as a direct dependency:**
     ```bash
     npm install minimatch
     ```
     This resolved the error in some cases, even if minimatch was not directly required in code.
- **Reference:** See [strapi/strapi#23906](https://github.com/strapi/strapi/pull/23906) for upstream fix status.

## Add more issues as you encounter them!
