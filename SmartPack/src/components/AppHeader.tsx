import React from 'react';
import DarkModeToggle from './DarkModeToggle';

const AppHeader: React.FC = () => (
  <header className="w-full bg-white dark:bg-gray-950 shadow-sm py-3 px-4 flex items-center justify-between">
    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">SmartPack</h1>
    <nav className="flex items-center gap-4">
      {/* Add nav links here if needed */}
      <DarkModeToggle />
    </nav>
  </header>
);

export default AppHeader;
