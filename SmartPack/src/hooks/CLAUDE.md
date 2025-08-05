# SmartPack Hooks Directory Navigation

## Directory Purpose
The `hooks/` directory contains custom React hooks that encapsulate business logic, state management, and side effects. Each hook follows React hooks conventions and TypeScript strict mode.

## Hook Inventory

### Context Providers
- **`TripFormContext.tsx`** - Global trip form state management
  - Manages trip creation and editing state
  - Provides form validation and submission logic
  - Handles localStorage persistence for trip data

- **`PackingListContext.tsx`** - Global packing list state management
  - Manages packing list items and categories
  - Provides CRUD operations for checklist items
  - Handles item checking/unchecking and persistence

- **`TripFormContextOnly.tsx`** - Lightweight trip form context
  - Simplified version for specific component needs
  - Reduced bundle size for focused usage

### Form and Validation Hooks
- **`useTripForm.tsx`** - Trip form logic and validation
  - Handles multi-step form navigation
  - Real-time validation with 750ms debounce
  - Form submission and error handling
  - Integration with geocoding services

- **`usePackingList.tsx`** - Packing list operations
  - Item addition, editing, and deletion
  - Category management and organization
  - Optimistic updates with error rollback
  - localStorage persistence layer

- **`usePackingListContext.tsx`** - Packing list context consumer
  - Provides access to packing list context state
  - Includes error handling for missing context
  - Type-safe context consumption

### Layout and UI Hooks
- **`useColumnLayout.tsx`** - Responsive layout management
  - Three-column desktop layout coordination
  - Mobile/desktop breakpoint handling
  - Column visibility and sizing logic
  - Integration with bottom navigation

- **`useColumnSynchronizer.tsx`** - Column state synchronization
  - Synchronizes state between layout columns
  - Handles data flow between components
  - Prevents layout conflicts and race conditions

- **`useResizable.ts`** - Resizable column functionality
  - Drag-to-resize column implementation
  - Touch and mouse event handling
  - Responsive constraints and boundaries
  - Integration with layout system

### Service Integration Hooks
- **`useWeather.ts`** - Weather data management
  - Fetches weather data based on location
  - Caches weather information locally
  - Handles API failures with fallback data
  - Integration with trip planning workflow

- **`useGeocode.ts`** - Location services and geocoding
  - Address autocomplete functionality
  - Coordinate lookup and reverse geocoding
  - Integration with trip destination selection
  - Error handling for geocoding failures

### Performance and UX Hooks
- **`usePerformance.ts`** - Performance monitoring
  - Tracks component render performance
  - Monitors bundle loading times
  - Provides performance metrics for optimization
  - Development-only performance logging

- **`useHapticFeedback.ts`** - Haptic feedback for mobile
  - Provides tactile feedback for user interactions
  - Mobile device vibration API integration
  - Fallback handling for unsupported devices
  - User preference respect (reduced motion)

## Hook Patterns

### Custom Hook Structure
```typescript
// Standard custom hook pattern
export const useCustomHook = (initialValue?: string) => {
  const [state, setState] = useState(initialValue || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performAction = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      // Async operation
      setState(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { state, loading, error, performAction };
};
```

### Context Provider Pattern
```typescript
// Context provider hook pattern
interface ContextState {
  data: DataType[];
  actions: {
    add: (item: DataType) => void;
    update: (id: string, item: Partial<DataType>) => void;
    remove: (id: string) => void;
  };
}

const Context = createContext<ContextState | undefined>(undefined);

export const useContextHook = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContextHook must be used within ContextProvider');
  }
  return context;
};
```

## Hook Dependencies

### External Dependencies
- **React**: useState, useEffect, useCallback, useMemo, useContext
- **localStorage**: Data persistence across sessions
- **API Services**: Integration with external services (weather, geocoding)
- **Browser APIs**: Geolocation, Vibration, ResizeObserver

### Internal Dependencies
- **Types**: TypeScript interfaces from `src/types/`
- **Utils**: Helper functions from `src/utils/`
- **Services**: API clients from `src/services/`

## State Management Patterns

### Context Architecture
```
TripFormContext
├── Trip data state
├── Form validation state
├── Loading/error states
└── Actions (create, update, validate)

PackingListContext
├── Items array state
├── Categories organization
├── Checked items state
└── Actions (add, edit, delete, check)
```

### Data Flow
1. **User Interaction** → Component event handler
2. **Component** → Hook function call
3. **Hook** → Context state update
4. **Context** → localStorage persistence
5. **Context** → Component re-render

## Testing Strategy

### Hook Testing Patterns
```typescript
// Standard hook test with renderHook
describe('useCustomHook', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.state).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles async operations correctly', async () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.performAction('test');
    });

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
```

### Context Testing
```typescript
// Context provider testing pattern
const TestComponent = () => {
  const { state, actions } = useContextHook();
  return (
    <div>
      <span data-testid="state">{JSON.stringify(state)}</span>
      <button onClick={() => actions.add(testData)}>Add</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <ContextProvider>
      <TestComponent />
    </ContextProvider>
  );
};
```

## Performance Considerations

### Optimization Techniques
- **useCallback**: Memoize event handlers and async functions
- **useMemo**: Memoize expensive calculations
- **Context Splitting**: Separate contexts to prevent unnecessary re-renders
- **Lazy Initialization**: Use lazy initial state for expensive computations

### Common Pitfalls
- **Missing Dependencies**: Always include all dependencies in useEffect/useCallback
- **Stale Closures**: Use functional state updates to avoid stale state
- **Infinite Loops**: Be careful with object/array dependencies
- **Context Re-renders**: Split context providers to minimize re-render scope

## Development Guidelines

### Adding New Hooks
1. **Follow naming convention**: use[HookName] pattern
2. **Define TypeScript interfaces** for parameters and return types
3. **Add comprehensive tests** including edge cases
4. **Document hook purpose** and usage examples
5. **Consider performance implications** of the hook

### Hook Architecture
- **Single Responsibility**: Each hook should have one clear purpose
- **Composable**: Hooks should work well when combined
- **Testable**: Design hooks to be easily testable in isolation
- **Type Safe**: Use TypeScript strict mode for all hooks

### Error Handling
- **Graceful Degradation**: Provide fallback behavior for hook failures
- **Error Boundaries**: Ensure hooks don't crash the application
- **User Feedback**: Provide meaningful error messages for users
- **Logging**: Log errors for debugging in development

## Integration Points

### Component Integration
- Hooks are consumed by components through standard React patterns
- Multiple hooks can be combined in single components
- Context hooks provide global state access

### Service Integration
- Hooks abstract service calls and provide consistent interfaces
- Error handling and loading states managed at hook level
- Caching and persistence logic encapsulated in hooks

### Type System Integration
- All hooks use TypeScript interfaces from `src/types/`
- Generic hooks support multiple data types
- Strict type checking enabled for all hook implementations

## Quick Reference

### Finding Hook Usage
```bash
# Find where a hook is used
grep -r "useHookName" src/

# Find hook imports
grep -r "from.*useHookName" src/
```

### Hook Testing
```bash
# Run tests for specific hook
npm test -- useHookName.test.tsx

# Run all hook tests
npm test -- src/hooks/
```

### Hook Analysis
```bash
# Check hook dependencies
npm run lint src/hooks/useHookName.tsx

# Type check specific hook
npm run type-check -- src/hooks/useHookName.tsx
```

## File Organization

### Type Definitions
- **`TripFormTypes.ts`** - Type definitions specific to trip form hooks
- Other type definitions in `src/types/` directory

### Hook Categories
- **Context Providers**: Global state management hooks
- **Business Logic**: Domain-specific logic hooks
- **UI/UX**: User interface and experience hooks
- **Service Integration**: External service wrapper hooks
- **Performance**: Optimization and monitoring hooks