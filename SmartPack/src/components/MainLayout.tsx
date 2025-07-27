import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout: Responsive 3-column (desktop) or stacked (mobile) layout.
 * Columns: Trip Details | Packing Checklist | AI Suggestions
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2 md:px-6 py-4 gap-4">
        {/* Left: Trip Details */}
        <section className="md:w-1/4 w-full mb-4 md:mb-0" id="trip-details">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">Trip Details (placeholder)</div>
        </section>
        {/* Center: Packing Checklist */}
        <section className="md:w-2/4 w-full mb-4 md:mb-0" id="packing-checklist">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">Packing Checklist (placeholder)</div>
        </section>
        {/* Right: AI Suggestions */}
        <section className="md:w-1/4 w-full" id="ai-suggestions">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 h-full text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">AI Suggestions (placeholder)</div>
        </section>
      </main>
      {children}
    </div>
  );
};

export default MainLayout;
