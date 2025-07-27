import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import AppWithProvider from './App'

if (import.meta.env.DEV) {
  window.localStorage.clear();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppWithProvider />
    </BrowserRouter>
  </StrictMode>,
)
