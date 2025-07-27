import React from 'react';

const DarkModeToggle: React.FC = () => {
  // Toggle Tailwind dark mode by toggling 'dark' class on <html>
  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    // Optionally persist preference
    if (html.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };

  React.useEffect(() => {
    // On mount, set theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <button
      aria-label="Toggle dark mode"
      className="rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      onClick={toggleDarkMode}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleDarkMode();
        }
      }}
    >
      <span role="img" aria-label="moon/sun">🌙/☀️</span>
    </button>
  );
};

export default DarkModeToggle;
