import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const DarkModeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Toggle Tailwind dark mode by toggling 'dark' class on <html>
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    const newIsDark = html.classList.contains('dark');
    setIsDark(newIsDark);

    // Persist preference
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  useEffect(() => {
    // On mount, set theme from localStorage
    const theme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = theme === 'dark' || (theme === null && prefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  return (
    <button
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="min-h-[44px] min-w-[44px] px-3 py-2 text-sm font-medium text-gray-600 dark:text-blue-200 hover:text-gray-700 dark:hover:text-blue-100 bg-gray-50 dark:bg-blue-900 hover:bg-gray-100 dark:hover:bg-blue-800 rounded-md border-2 border-gray-200 dark:border-blue-700 hover:border-gray-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center justify-center"
      onClick={toggleDarkMode}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDarkMode();
        }
      }}
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};

export default DarkModeToggle;
