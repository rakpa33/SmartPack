import React from 'react';
import { Dialog } from '@headlessui/react';

export default function TestFrameworks() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Frameworks & Libraries Test</h2>
        <button
          className="rounded-lg border border-transparent mt-4 px-4 py-2 text-base font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
          onClick={() => setIsOpen(true)}
        >
          Open Headless UI Dialog
        </button>
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm rounded bg-white dark:bg-gray-800 p-8">
              <Dialog.Title className="text-lg font-bold">Headless UI Dialog</Dialog.Title>
              <Dialog.Description className="mb-4">This dialog is rendered using Headless UI.</Dialog.Description>
              <button
                className="rounded-lg border border-transparent mt-2 px-4 py-2 text-base font-medium bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded">
          <p className="font-mono text-sm text-gray-700 dark:text-gray-200">Tailwind CSS is working if this box is styled.</p>
        </div>
      </div>
    </div>
  );
}
