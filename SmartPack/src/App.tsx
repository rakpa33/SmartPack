import AppHeader from './components/AppHeader';
import MainLayout from './components/MainLayout';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import './App.css';
import { TripFormProvider } from './hooks/TripFormContext';
import { TripForm } from './components/TripForm';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <TripFormProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <AppHeader />
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-[80vh]">
              <TripForm />
            </div>
          } />
          <Route path="/MainLayout" element={
            <MainLayout>
              {/* ...existing MainLayout children... */}
              <div className="fixed bottom-4 right-4">
                <button
                  className="rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                  onClick={() => setIsModalOpen(true)}
                >
                  Open Modal
                </button>
              </div>
              <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <Dialog.Panel className="mx-auto max-w-sm rounded bg-white dark:bg-gray-800 p-6">
                    <Dialog.Title className="text-lg font-bold mb-2">Headless UI Modal</Dialog.Title>
                    <Dialog.Description className="mb-4">This is a placeholder modal for testing.</Dialog.Description>
                    <button
                      className="rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-gray-700 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </Dialog.Panel>
                </div>
              </Dialog>
            </MainLayout>
          } />
        </Routes>
      </div>
    </TripFormProvider>
  );
}

export default App;
