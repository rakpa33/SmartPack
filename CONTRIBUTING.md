<!--
This file provides guidelines for contributing to SmartPack.
Keep this comment at the top; do not overwrite or remove it when updating the document.

DOCUMENT PURPOSE:
- Define development workflow and contribution standards
- Establish code quality requirements and review processes
- Guide new contributors through setup and submission procedures
- Maintain project consistency and quality standards

HOW TO UPDATE:
1. WORKFLOW CHANGES: Update when development processes, tools, or standards change
2. TOOL UPDATES: Modify when adding new linting rules, testing frameworks, or development tools
3. PROCESS REFINEMENT: Adjust guidelines based on contributor feedback and project evolution
4. STANDARDS EVOLUTION: Update coding standards and best practices as they mature
5. REGULAR REVIEW: Review quarterly or when onboarding new team members

FORMATTING RULES:
- Use clear step-by-step instructions for setup and submission processes
- Include code examples for common patterns and standards
- Reference specific files, commands, and tools with proper formatting
- Maintain sections for different types of contributions (features, bugs, docs)
- Keep prerequisites and setup instructions up-to-date with current project state
-->

# Contributing to SmartPack

Thank you for your interest in contributing to SmartPack! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Documentation Guidelines](#documentation-guidelines)

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js** (LTS version - currently v20.14.0)
- **npm** (v10.7.0 or higher)
- **Ollama** (for AI functionality testing)
- **AWS CLI** (for deployment-related contributions)
- **Git** (for version control)

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/smartpack.git
   cd smartpack
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up Ollama** (required for AI features):
   ```bash
   ollama pull llama3.1:8b
   ollama serve
   ```
5. **Start development environment**:

   ```bash
   # Terminal 1: Backend
   npm run lambda:dev

   # Terminal 2: Frontend
   npm run dev
   ```

### Project Structure

```
SmartPack/
├── src/                    # Frontend React components
├── lambda/                 # Backend API server
├── copilotdocs/           # Project documentation
├── __tests__/             # Test files
├── .github/               # GitHub workflows and templates
└── public/                # Static assets
```

## Development Workflow

### Branch Naming Convention

- **Features**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-change`
- **Refactoring**: `refactor/description-of-change`

### Commit Message Format

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```
feat(ai): add smart quantity calculations for trip duration
fix(checklist): resolve localStorage persistence bug
docs(api): update endpoint documentation with new examples
test(suggestions): add comprehensive unit tests for AI panel
```

## Code Standards

### TypeScript Guidelines

- **Strict Mode**: All new code must pass TypeScript strict mode
- **Type Safety**: Avoid `any` types; use proper interfaces and types
- **Naming**: Use PascalCase for components, camelCase for functions and variables

```typescript
// ✅ Good
interface TripDetails {
  name: string;
  startDate: string;
  destinations: string[];
}

const calculateDuration = (startDate: string, endDate: string): number => {
  // Implementation
};

// ❌ Avoid
const data: any = {};
const calculate_duration = () => {};
```

### React Component Guidelines

- **Functional Components**: Use function components with hooks
- **Props Interface**: Define interfaces for all component props
- **Error Boundaries**: Implement error handling for user-facing components

```typescript
interface PackingListProps {
  items: ChecklistItem[];
  onItemToggle: (id: string) => void;
}

const PackingList: React.FC<PackingListProps> = ({ items, onItemToggle }) => {
  // Component implementation
};
```

### CSS and Styling

- **Tailwind CSS**: Use Tailwind utility classes for styling
- **Component Styles**: Keep component-specific styles close to components
- **Accessibility**: Ensure proper color contrast and keyboard navigation

### ESLint and Prettier

- **Linting**: Run `npm run lint` before committing
- **Formatting**: Code is automatically formatted with Prettier
- **Pre-commit**: Husky hooks enforce linting and formatting

## Testing Requirements

### Test Coverage Requirements

- **Unit Tests**: All new utility functions and API services
- **Integration Tests**: Critical user workflows and component interactions
- **E2E Tests**: Key user journeys and AI functionality

### Testing Standards

1. **Test File Location**: Place tests in `__tests__/` directory
2. **Naming Convention**: `ComponentName.test.tsx` or `functionality.test.ts`
3. **Test Structure**: Use AAA pattern (Arrange, Act, Assert)

```typescript
describe('PackingList Component', () => {
  beforeEach(() => {
    localStorage.clear(); // Prevent test contamination
  });

  it('should add new items to the checklist', () => {
    // Arrange
    const mockItems = [
      /* test data */
    ];

    // Act
    render(<PackingList items={mockItems} />);

    // Assert
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Unit and integration tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage

# Watch mode during development
npm run test:watch
```

## Pull Request Process

### Before Submitting

1. **Code Quality Checklist**:

   - [ ] All tests pass (`npm test`)
   - [ ] Linting passes (`npm run lint`)
   - [ ] TypeScript compiles without errors (`npm run build`)
   - [ ] Manual testing completed
   - [ ] Documentation updated if needed

2. **AI Functionality Testing**:
   - [ ] Test with Ollama running (AI mode)
   - [ ] Test with Ollama disabled (fallback mode)
   - [ ] Verify error handling and user feedback

### Pull Request Template

When creating a PR, include:

- **Description**: Clear description of changes and motivation
- **Type of Change**: Feature, bug fix, documentation, etc.
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking Changes**: Any breaking changes and migration notes

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one approving review required
3. **Testing**: Reviewer tests functionality manually
4. **Documentation**: Ensure relevant docs are updated

## Documentation Guidelines

### Documentation Types

- **Code Comments**: Document complex logic and business rules
- **API Documentation**: Update `API.md` for endpoint changes
- **Architecture Changes**: Update `ARCHITECTURE.md` for system changes
- **Development Log**: Add entries to `DEVLOG.md` for significant changes

### Documentation Standards

- **Clarity**: Write for developers unfamiliar with the codebase
- **Examples**: Include code examples and usage patterns
- **Cross-References**: Link related documentation and external resources
- **Currency**: Keep documentation up-to-date with code changes

### Updating Documentation

Follow the multi-document update order:

1. **DEVLOG.md**: Add detailed implementation notes
2. **Architecture/API docs**: Update technical specifications
3. **CHECKLIST.md**: Update high-level progress tracking

## AI and Ollama Contributions

### AI Feature Development

- **Local Testing**: Always test with actual Ollama instance
- **Fallback Behavior**: Ensure graceful degradation when AI unavailable
- **Prompt Engineering**: Document prompt changes and reasoning
- **Performance**: Monitor AI response times and optimize prompts

### AI Testing Requirements

- **Unit Tests**: Mock Ollama responses for consistent testing
- **Integration Tests**: Test with real AI when possible
- **Error Scenarios**: Test network failures and AI unavailability
- **Quality Validation**: Verify AI output quality and relevance

## Getting Help

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check `copilotdocs/` for detailed project information
- **Testing**: See `TESTING_GUIDELINES.md` for comprehensive testing info

## Recognition

Contributors are recognized in:

- **CHANGELOG.md**: For significant contributions
- **GitHub Contributors**: Automatic recognition for merged PRs
- **Release Notes**: Major feature contributors acknowledged

Thank you for contributing to SmartPack! 🎒✨
