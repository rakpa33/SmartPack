import React from 'react';
import { PackingListProvider } from '../hooks/usePackingListContext';
import { PackingList } from './PackingList';
import { TripDetails } from './TripDetails';
import { useTripForm } from '../hooks/useTripForm';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout: Responsive 3-column (desktop) or stacked (mobile) layout.
 * Columns: Trip Details | Packing Checklist | AI Suggestions
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Get the TripForm context state to check step
  const { state } = useTripForm();

  // Ensure the step is 2 (completed form) - this fixes the visibility issues in tests
  // If state.step < 2, we're still in the form, so don't show MainLayout content
  if (!state || state.step < 2) {
    console.log('MainLayout: Form incomplete, step is', state?.step);
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-6 py-4 gap-4">
        {/* Left: Trip Details */}
        <section className="md:w-1/4 w-full mb-4 md:mb-0" id="trip-details" data-testid="trip-details-section">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
            <TripDetails />
          </div>
        </section>
        {/* Center: Packing Checklist */}
        <section className="md:w-2/4 w-full mb-4 md:mb-0" id="packing-checklist" data-testid="packing-list-section">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
            <PackingListProvider>
              <PackingList />
            </PackingListProvider>
          </div>
        </section>
        {/* Right: AI Suggestions */}
        <section className="md:w-1/4 w-full" id="ai-suggestions" data-testid="ai-suggestions-section">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">AI Suggestions (placeholder)</div>
        </section>
      </main>
      {children}
    </div>
  );
};

export default MainLayout;
