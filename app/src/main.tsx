import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'
import { applyCachedContent, refreshContent } from './lib/overrides'

// Offline support: cache the app so lessons work without internet. Updates install quietly.
registerSW({ immediate: true })

// Admin content edits: show the saved copy right away, then fetch the latest in the background.
applyCachedContent()
refreshContent().catch(() => undefined)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
