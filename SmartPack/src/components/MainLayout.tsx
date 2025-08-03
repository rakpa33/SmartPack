import React from 'react';
import { PackingListProvider } from '../hooks/usePackingListContext';
import { ColumnLayoutProvider, useColumnLayout } from '../hooks/useColumnLayout';
import { useTripForm } from '../hooks/useTripForm';
import { PackingList } from './PackingList';
import { TripDetails } from './TripDetails';
import SuggestionsPanel from './SuggestionsPanel';
import BottomNavigation from './BottomNavigation';
import DragHandle from './DragHandle';

interface MainLayoutProps {
  children?: React.ReactNode;
}

/**
 * MainLayoutContent: The inner layout that responds to column visibility
 * Optimized with React.memo to prevent unnecessary re-renders
 */
const MainLayoutContent: React.FC<MainLayoutProps> = React.memo(({ children }) => {
  const {
    columnVisibility,
    getResponsiveWidths,
    deviceType,
    getTransitionStyles
  } = useColumnLayout();

  const { state } = useTripForm();
  const { tripName, destinations, travelModes } = state;

  // Check if this is a first-time user (same logic as TripDetails)
  const isFirstTimeUser = !tripName &&
    destinations.length === 1 &&
    !destinations[0] &&
    travelModes.length === 0;

  // Give the context a moment to load from localStorage
  const [isLoading, setIsLoading] = React.useState(true);

  // Memoize expensive calculations
  const responsiveWidths = React.useMemo(() => getResponsiveWidths(), [getResponsiveWidths]);
  const isDesktop = React.useMemo(() =>
    deviceType === 'desktop' || deviceType === 'tablet',
    [deviceType]
  );

  React.useEffect(() => {
    // Allow context to initialize from localStorage
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading during initialization
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
        {children}
      </div>
    );
  }

  // Now that we start at step 2 for first-time users, always show MainLayout

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="flex-1 flex flex-col md:flex-row w-full mx-auto px-1 md:px-2 py-2 gap-2 pb-20 md:pb-2">
        {/* Left: Trip Details */}
        {columnVisibility.tripDetails && (
          <section
            className="w-full mb-4 md:mb-0"
            id="trip-details"
            data-testid="trip-details-section"
            style={{
              width: isDesktop ? `${responsiveWidths.tripDetails}px` : '100%',
              minWidth: isDesktop ? '275px' : 'auto',
              flex: 'none',
              ...getTransitionStyles('tripDetails')
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              <PackingListProvider>
                <TripDetails
                  tripName={state.tripName}
                  startDate={state.startDate}
                  endDate={state.endDate}
                  destinations={state.destinations}
                  travelModes={state.travelModes}
                  preferences={state.preferences}
                  isFirstTimeOrNewTrip={isFirstTimeUser}
                />
              </PackingListProvider>
            </div>
          </section>
        )}

        {/* Drag Handle: Trip Details <-> Packing Checklist */}
        {columnVisibility.tripDetails && columnVisibility.packingChecklist && (
          <DragHandle
            columnId="tripDetails"
            position="right"
            className="hidden md:flex"
          />
        )}

        {/* Center: Packing Checklist */}
        {columnVisibility.packingChecklist && (
          <section
            className="w-full mb-4 md:mb-0"
            id="packing-checklist"
            data-testid="packing-list-section"
            style={{
              width: isDesktop ? `${responsiveWidths.packingChecklist}px` : '100%',
              minWidth: isDesktop ? '275px' : 'auto',
              flex: 'none',
              ...getTransitionStyles('packingChecklist')
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              <PackingListProvider>
                <PackingList />
              </PackingListProvider>
            </div>
          </section>
        )}

        {/* Drag Handle: Packing Checklist <-> AI Suggestions */}
        {columnVisibility.packingChecklist && columnVisibility.suggestions && (
          <DragHandle
            columnId="packingChecklist"
            position="right"
            className="hidden md:flex"
          />
        )}

        {/* Right: AI Suggestions */}
        {columnVisibility.suggestions && (
          <section
            className="w-full"
            id="ai-suggestions"
            data-testid="ai-suggestions-section"
            style={{
              width: isDesktop ? `${responsiveWidths.suggestions}px` : '100%',
              minWidth: isDesktop ? '275px' : 'auto',
              flex: 'none',
              ...getTransitionStyles('suggestions')
            }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 relative">
              {/* Ollama Powered Badge */}
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Ollama AI</span>
                </div>
              </div>
              <PackingListProvider>
                <SuggestionsPanel />
              </PackingListProvider>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation - Mobile Only */}
      {!isFirstTimeUser && <BottomNavigation />}

      {children}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for React.memo - only re-render if children change
  return React.Children.count(prevProps.children) === React.Children.count(nextProps.children);
});

/**
 * MainLayout: Responsive 3-column (desktop) or stacked (mobile) layout.
 * Columns: Trip Details | Packing Checklist | AI Suggestions
 * Enhanced Implementation: React.memo optimization for preventing unnecessary re-renders
 */
const MainLayout: React.FC<MainLayoutProps> = React.memo(({ children }) => {
  return (
    <ColumnLayoutProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </ColumnLayoutProvider>
  );
});

export default MainLayout;
