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
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
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
