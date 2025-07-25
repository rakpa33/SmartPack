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

## Add more issues as you encounter them!
