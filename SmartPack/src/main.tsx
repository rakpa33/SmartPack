import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestFrameworks from './pages/TestFrameworks'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestFrameworks />
  </StrictMode>,
)
