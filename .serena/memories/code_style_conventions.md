# SmartPack Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled (`strict: true`)
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx
- **No implicit any**: Enforced
- **No unused locals/parameters**: Enforced

## Path Aliases
The project uses path aliases for cleaner imports:
- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@utils/*` → `./src/utils/*`
- `@types/*` → `./src/types/*`
- `@pages/*` → `./src/pages/*`
- `@test-utils/*` → `./src/test-utils/*`
- `@assets/*` → `./src/assets/*`

## Code Formatting (Prettier)
- **Semicolons**: Always (`semi: true`)
- **Quotes**: Single quotes (`singleQuote: true`)
- **Trailing Commas**: Always (`trailingComma: "all"`)
- **Line Width**: Default (80 characters)

## ESLint Rules
- **Import Organization**: Enforced grouping and alphabetical ordering
- **Import Groups Order**: builtin → external → internal → parent → sibling → index
- **Newlines Between Import Groups**: Required
- **No Relative Parent Imports**: More than one level up prohibited
- **React Hooks**: Rules enforced
- **React Refresh**: Vite-specific rules applied

## React Patterns
- **Components**: Functional components only (no class components)
- **Props**: Explicit TypeScript interfaces for all props
- **Hooks**: Custom hooks for shared logic (prefix with `use`)
- **State Management**: Context API + custom hooks
- **Memo**: Use React.memo for expensive components

## TypeScript Conventions
- **Interfaces**: For object types and component props
- **Types**: For unions, primitives, and utility types
- **Naming**:
  - Interfaces: PascalCase with `I` prefix optional (e.g., `ITripData` or `TripData`)
  - Types: PascalCase (e.g., `TransportMode`)
  - Props interfaces: ComponentName + `Props` (e.g., `TripFormProps`)
- **Exports**: Named exports preferred over default exports

## File Organization
```
src/
├── components/        # React components
│   ├── ComponentName.tsx
│   └── ComponentName.test.tsx
├── hooks/            # Custom hooks
│   └── useHookName.ts
├── utils/            # Helper functions
├── types/            # TypeScript type definitions
├── services/         # API and external services
└── __tests__/        # Test files
    ├── unit/
    └── integration/
```

## Component Structure
```typescript
// Import organization (enforced by ESLint)
import React from 'react';
import { externalLib } from 'external-package';

import { InternalComponent } from '@components/InternalComponent';
import { useCustomHook } from '@hooks/useCustomHook';
import type { ComponentProps } from '@types/props';

// Props interface
interface MyComponentProps {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
}

// Component definition
export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction, 
  children 
}) => {
  // Hooks at the top
  const data = useCustomHook();
  
  // Event handlers
  const handleClick = () => {
    onAction();
  };
  
  // Render
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};
```

## CSS/Styling Conventions
- **Tailwind CSS**: Utility-first approach
- **No inline styles**: Use Tailwind classes
- **Component classes**: Use semantic class names when needed
- **Responsive**: Mobile-first with responsive modifiers (sm:, md:, lg:, xl:)
- **Dark mode**: Use dark: modifier for dark mode styles

## Testing Conventions
- **Test files**: Co-located with components (`.test.tsx`)
- **Test structure**: Arrange-Act-Assert pattern
- **Naming**: Descriptive test names explaining behavior
- **Coverage**: Aim for 80%+ coverage
- **Accessibility**: Include jest-axe tests for all components

## Git Conventions
- **Commit messages**: Clear, concise, present tense
- **Branch naming**: feature/, fix/, chore/ prefixes
- **Line endings**: LF (enforced by .gitattributes)

## Documentation
- **Comments**: Only when necessary for complex logic
- **JSDoc**: For public APIs and complex functions
- **README**: Keep updated with setup instructions
- **DEVLOG**: Document significant changes (newest first)

## Error Handling
- **Try-catch**: For async operations
- **Error boundaries**: For React component errors
- **User feedback**: Clear error messages
- **Logging**: Console errors in development only

## Performance Guidelines
- **Lazy loading**: For route components
- **Memoization**: For expensive computations
- **Debouncing**: 750ms for user inputs
- **Optimistic updates**: With rollback on error