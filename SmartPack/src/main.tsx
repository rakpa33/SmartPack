import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App'

// Only clear localStorage in development if specifically requested via URL parameter
// This allows developers to test with fresh state when needed: ?clearStorage=true
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('clearStorage')) {
  console.log('Clearing localStorage for fresh development session...');
  window.localStorage.clear();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
