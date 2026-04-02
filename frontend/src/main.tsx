import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyPersistedSettings } from './lib/settingsStore'

// Apply saved theme + font-size before first render to avoid flash
applyPersistedSettings()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
