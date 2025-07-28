import React from 'react';
import App from './App';
import { TripFormProvider } from './hooks/TripFormContext';

const AppWithProvider: React.FC = () => (
  <TripFormProvider>
    <App />
  </TripFormProvider>
);

export default AppWithProvider;
