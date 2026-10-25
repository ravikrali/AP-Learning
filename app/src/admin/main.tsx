import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import './admin.css'
import { AdminApp } from './AdminApp'
import { applyCachedContent } from '../lib/overrides'
import { refreshPricing } from '../lib/pricing'

applyCachedContent()
refreshPricing().catch(() => undefined)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
)
