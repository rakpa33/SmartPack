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
  1. Ensure no `"types": ["minimatch"]` entry exists in any `tsconfig*.json` file.
  2. If you see this error, install the `minimatch` package:
     ```sh
     npm install minimatch
     ```
  3. If you still see the error, try adding the following to your `package.json` to force a compatible version:
     ```json
     "overrides": {
       "@types/minimatch": "5.1.2"
     }
     ```
  4. Delete `node_modules` and all lockfiles, then run `npm install` again.
  5. Restart your editor/IDE and the TypeScript server.
  6. If the error persists, check for dependencies that may require an older version and update them if possible.
- **Reference:** See [strapi/strapi#23906](https://github.com/strapi/strapi/pull/23906) for upstream fix status.

## Add more issues as you encounter them!
