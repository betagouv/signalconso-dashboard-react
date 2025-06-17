import { injectMatomoScript } from 'core/plugins/Matomo'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Sentry } from './core/plugins/Sentry'
import './polyfills'
Sentry.init()
injectMatomoScript()

const container = document.getElementById('root')
if (!container) {
  throw new Error('Missing root')
}
createRoot(container).render(<App />)
