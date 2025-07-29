# Troubleshoot Tests Template

**Troubleshoot Test Issues**

Systematically diagnose and resolve testing problems using structured debugging approaches.

## 1. Initial Assessment and Context Gathering

- Document the specific test failure symptoms and error messages
- Identify which tests are failing (unit, integration, E2E)
- Determine if failures are consistent or intermittent
- Check recent code changes that might have introduced the issues
- Gather relevant error logs and stack traces for analysis

## 2. Environment and Configuration Analysis

- Verify `copilotdocs/ENVIRONMENT.md` for proper test environment setup
- Check all testing dependencies and their versions
- Validate test database and external service configurations
- Ensure test environment isolation and proper cleanup
- Review CI/CD pipeline configuration for testing stages

## 3. Test Framework and Tooling Review

- Reference `copilotdocs/TESTING_GUIDELINES.md` for current testing standards
- Check `copilotdocs/COMMANDS.md` for proper test execution commands
- Validate test framework configuration (Jest, Vitest, Playwright, etc.)
- Review test setup and teardown procedures
- Verify test data management and mocking strategies

## 4. Code and Logic Analysis

- Examine failing test code for syntax errors or logical issues
- Review the code under test for recent changes or bugs
- Check test assertions and expectations for accuracy
- Validate test data and mock configurations
- Analyze test coverage and identify gaps

## 5. Systematic Debugging Approach

- Run tests in isolation to identify specific failure points
- Use debugging tools and verbose output for detailed analysis
- Implement temporary logging to trace execution flow
- Test individual components or functions independently
- Verify test dependencies and import statements

## 6. Common Issues Investigation

- Check `copilotdocs/TROUBLESHOOTING.md` for known testing issues and solutions
- Look for timing issues in asynchronous tests
- Validate browser compatibility for E2E tests
- Check for resource conflicts or memory issues
- Review network connectivity and external service dependencies

## 7. Solution Implementation and Validation

- Apply fixes based on root cause analysis
- Update test configuration or code as needed
- Verify fixes resolve the original issues without introducing new ones
- Run comprehensive test suite to ensure no regressions
- Update documentation if new patterns or solutions are discovered

## 8. Quality Assurance and Prevention

- Update `copilotdocs/TESTING_GUIDELINES.md` with lessons learned
- Add or improve test cases to prevent similar issues
- Review and enhance test automation and reliability
- Document troubleshooting steps in `copilotdocs/TROUBLESHOOTING.md`
- Implement monitoring or alerts for test reliability

## Validation Checklist

- [ ] All previously failing tests now pass
- [ ] No new test failures introduced
- [ ] Test execution time remains reasonable
- [ ] Test reliability and stability improved
- [ ] Documentation updated with solutions and preventive measures

## Usage

Use this prompt when Copilot needs to systematically diagnose and resolve test failures or testing-related issues in the project.
