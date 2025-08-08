# SmartPack Documentation Directory Navigation

**DOCUMENTATION INDEX - DO NOT DELETE**

This navigation file provides quick access to all project documentation without deep directory traversal, reducing token usage for documentation lookups.

**Purpose**: Documentation structure, quick reference guide, document catalog
**Status**: Essential navigation file for project documentation

## Directory Purpose

The `docs/` directory contains comprehensive project documentation organized by domain. All documentation follows a structured format for easy navigation and maintenance.

## Documentation Structure

### `/development/` - Development Documentation

Core development resources for building and maintaining SmartPack.

- **`ARCHITECTURE.md`** - System architecture following arc42 template
  - Component diagrams
  - Data flow documentation
  - Technology decisions
  - System constraints

- **`DEVLOG.xml`** - Development history (reverse chronological)
  - Feature implementations
  - Bug fixes and resolutions
  - Technical decisions
  - Performance improvements

- **`CHECKLIST.md`** - Current development progress
  - Task completion status
  - Sprint planning
  - Feature readiness
  - Ship criteria

- **`ROADMAP.md`** - Future development plans
  - Phase definitions
  - Feature priorities
  - Timeline estimates
  - MVP requirements

- **`TROUBLESHOOTING.md`** - Problem resolution guide
  - Common issues and solutions
  - Error patterns
  - Debug procedures
  - Recovery steps

- **`ENVIRONMENT.md`** - Development environment setup
  - Prerequisites
  - Installation steps
  - Configuration
  - Tool requirements

- **`COMMANDS.md`** - Common command reference
  - Development commands
  - Testing commands
  - Build commands
  - Deployment procedures

- **`DEPLOYMENT.md`** - Deployment procedures
  - AWS Lambda setup
  - Production configuration
  - CI/CD pipeline
  - Release process

- **`SECURITY.md`** - Security guidelines
  - Best practices
  - Vulnerability management
  - Data protection
  - Authentication plans

- **`FILE_ORGANIZATION.md`** - Project structure guide
  - Directory layout
  - Naming conventions
  - Code organization
  - Asset management

- **`ONBOARDING.md`** - New developer guide
  - Getting started
  - Project overview
  - Key concepts
  - First tasks

### `/testing/` - Testing Documentation

Comprehensive testing strategies and guidelines.

- **`TESTING_GUIDE.md`** - Overall testing strategy
  - Test pyramid approach
  - Coverage goals
  - Testing philosophy
  - Quality gates

- **`TESTING_STANDARDS.md`** - Testing requirements
  - Acceptance criteria
  - Test case standards
  - Coverage requirements
  - Performance benchmarks

- **`TESTING_GUIDELINES.md`** - How to write tests
  - Unit test patterns
  - Integration test strategies
  - E2E test scenarios
  - Mock data management

- **`TEST_UTILITIES.md`** - Testing helper documentation
  - Utility functions
  - Mock generators
  - Assertion helpers
  - Setup procedures

### `/api/` - API Documentation

Backend service and integration documentation.

- **`API.md`** - API endpoint reference
  - Endpoint specifications
  - Request/response formats
  - Authentication
  - Error codes

### Design Documentation

- **`UX_UI_DESIGN_SYSTEM.md`** - Design patterns and standards
  - Component library
  - Color system
  - Typography
  - Spacing guidelines

- **`UX_UI_ASSESSMENT_GUIDE.md`** - UX quality guidelines
  - Usability criteria
  - Accessibility standards
  - Performance metrics
  - Mobile considerations

### Implementation Guides

- **`OLLAMA_IMPLEMENTATION.md`** - AI integration guide
  - Ollama setup
  - Model selection
  - Prompt engineering
  - Error handling

- **`OLLAMA_SETUP.md`** - Ollama installation
  - System requirements
  - Installation steps
  - Configuration
  - Troubleshooting

- **`HEROICONS_IMPLEMENTATION.md`** - Icon system guide
  - Icon usage patterns
  - Import methods
  - Sizing guidelines
  - Accessibility

- **`RESTRUCTURING_SUMMARY.md`** - Recent refactoring documentation
  - Architecture changes
  - Migration guides
  - Breaking changes
  - Update procedures

## Documentation Standards

### File Naming Conventions
- `UPPERCASE.md` - Primary documentation files
- `lowercase.xml` - Structured data files
- `kebab-case.md` - Supplementary docs
- `DEVLOG.xml` - Special structured format

### Content Organization
1. **Title** - Clear, descriptive heading
2. **Purpose** - Why this document exists
3. **Overview** - High-level summary
4. **Details** - Comprehensive content
5. **Examples** - Practical demonstrations
6. **References** - Related documents

### Update Guidelines
- **DEVLOG.xml** - Add entries at TOP (reverse chronological)
- **CHECKLIST.md** - Update status in place
- **TROUBLESHOOTING.md** - Add new issues with solutions
- **Other docs** - Update sections as needed

## Quick Reference

### For New Developers
1. Start with `ONBOARDING.md`
2. Read `ARCHITECTURE.md` for system overview
3. Review `ENVIRONMENT.md` for setup
4. Check `ROADMAP.md` for current priorities

### For Testing
1. Read `TESTING_GUIDE.md` for strategy
2. Follow `TESTING_GUIDELINES.md` for writing tests
3. Use `TEST_UTILITIES.md` for helpers
4. Check `TESTING_STANDARDS.md` for requirements

### For Deployment
1. Follow `DEPLOYMENT.md` procedures
2. Check `SECURITY.md` requirements
3. Review `API.md` for endpoints
4. Verify with `CHECKLIST.md`

### For Troubleshooting
1. Check `TROUBLESHOOTING.md` first
2. Review `DEVLOG.xml` for similar issues
3. Consult `ARCHITECTURE.md` for system design
4. Use `COMMANDS.md` for debug commands

## Document Status

### Active Documents (Frequently Updated)
- `DEVLOG.xml` - Updated with each significant change
- `CHECKLIST.md` - Updated during development
- `TROUBLESHOOTING.md` - Updated when issues arise

### Stable Documents (Occasionally Updated)
- `ARCHITECTURE.md` - Updated for major changes
- `ROADMAP.md` - Updated per sprint/phase
- `TESTING_GUIDE.md` - Updated for strategy changes

### Reference Documents (Rarely Updated)
- `ENVIRONMENT.md` - Updated for tool changes
- `COMMANDS.md` - Updated for new commands
- `FILE_ORGANIZATION.md` - Updated for structure changes

## Integration with Development

### Documentation-Driven Development
1. Update docs before implementing features
2. Document decisions in `DEVLOG.xml`
3. Track progress in `CHECKLIST.md`
4. Plan ahead in `ROADMAP.md`

### Documentation Review Process
1. Review docs during code review
2. Ensure docs match implementation
3. Update troubleshooting for new issues
4. Keep examples current

## Finding Information

### By Topic
- **Architecture**: `ARCHITECTURE.md`, `FILE_ORGANIZATION.md`
- **Setup**: `ENVIRONMENT.md`, `ONBOARDING.md`, `OLLAMA_SETUP.md`
- **Development**: `DEVLOG.xml`, `CHECKLIST.md`, `COMMANDS.md`
- **Testing**: All files in `/testing/`
- **Design**: `UX_UI_*.md` files
- **API**: `API.md`, backend integration docs
- **Problems**: `TROUBLESHOOTING.md`, `DEVLOG.xml`

### By Task
- **Starting development**: `ONBOARDING.md` → `ENVIRONMENT.md`
- **Adding features**: `ROADMAP.md` → `ARCHITECTURE.md` → `CHECKLIST.md`
- **Fixing bugs**: `TROUBLESHOOTING.md` → `DEVLOG.xml`
- **Writing tests**: `TESTING_GUIDELINES.md` → `TEST_UTILITIES.md`
- **Deploying**: `DEPLOYMENT.md` → `SECURITY.md` → `API.md`

## Documentation Maintenance

### Regular Updates
- Update `DEVLOG.xml` for all significant changes
- Keep `CHECKLIST.md` current with progress
- Add new issues to `TROUBLESHOOTING.md`
- Review and update quarterly

### Quality Checks
- Ensure examples work
- Verify commands are current
- Check links are valid
- Remove outdated information