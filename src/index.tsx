import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {I18nProvider} from './core/i18n'
import {createMuiTheme, ThemeProvider} from '@material-ui/core'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateAdapter from '@date-io/date-fns'

ReactDOM.render(
  <I18nProvider>
    <ThemeProvider theme={createMuiTheme()}>
      <MuiPickersUtilsProvider utils={DateAdapter}>
        <App/>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  </I18nProvider>
  , document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
