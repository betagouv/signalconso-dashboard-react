import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {I18nProvider} from './core/i18n'
import {createMuiTheme, ThemeProvider} from '@material-ui/core'

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider>
      <ThemeProvider theme={createMuiTheme()}>
        <App/>
      </ThemeProvider>
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
