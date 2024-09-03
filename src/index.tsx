import StylesProvider from '@mui/styles/StylesProvider'
import createGenerateClassName from '@mui/styles/createGenerateClassName'
import { injectMatomoScript } from 'core/plugins/Matomo'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { Sentry } from './core/plugins/Sentry'
import './polyfills'
Sentry.init()
injectMatomoScript()

// https://github.com/mui-org/material-ui/issues/11843
// I think it should not be necessary. There is some miss configuration somewhere
const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true,
})

const container = document.getElementById('root')
if (!container) {
  throw new Error('Missing root')
}
createRoot(container).render(
  <StylesProvider generateClassName={generateClassName}>
    <App />
  </StylesProvider>,
)
