import DarkModeToggle from './components/DarkModeToggle';
import { useTripForm } from './hooks/useTripForm';
import { useNavigate } from 'react-router-dom';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

const AppHeader = () => {
  const { dispatch } = useTripForm();
  const navigate = useNavigate();

  const handleNewTrip = () => {
    // Clear all localStorage data
    localStorage.removeItem('tripForm');
    localStorage.removeItem('smartpack-column-visibility');
    localStorage.removeItem('smartpack-column-widths');
    localStorage.removeItem('packingList');

    // Reset trip form state to initial first-time user state
    dispatch({ type: 'RESET_FORM' });

    // Navigate to root to restart the app experience
    navigate('/');
  };

  return (
    <header className="w-full bg-white dark:bg-gray-950 shadow-sm py-3 px-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">SmartPack</h1>
      <nav className="flex items-center gap-4">
        <button
          onClick={handleNewTrip}
          className="min-h-[44px] px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-200 hover:text-blue-700 dark:hover:text-blue-100 bg-white dark:bg-blue-900 hover:bg-blue-50 dark:hover:bg-blue-800 rounded-md border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all flex items-center gap-2"
          title="Start a new trip"
        >
          <ArrowPathIcon className="h-4 w-4" />
          New Trip
        </button>
        <DarkModeToggle />
      </nav>
    </header>
  );
};

export default AppHeader;
