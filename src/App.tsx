import React from 'react'
import {makeLoginProviderComponent} from './core/Login/LoginContext'
import {ApiClient, SignalConsoPublicSdk, SignalConsoSecuredSdk, User} from 'core/api'
import {Config} from './conf/config'
import {makeStyles} from '@material-ui/core/styles'
import {Avatar, Icon, Theme, ThemeProvider} from '@material-ui/core'
import {ReportsProvider} from './core/context/ReportsContext'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import {I18nProvider, useI18n} from './core/i18n'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateAdapter from '@date-io/date-fns'
import {ReportProvider} from './core/context/ReportContext'
import {Panel} from './shared/Panel'
import {Reports} from './feature/Reports/Reports'
import {ReportComponent} from './feature/Report/Report'
import {Btn, SidebarHeader, ToastProvider} from 'mui-extension/lib'
import {ConstantProvider} from './core/context/ConstantContext'
import {AnomalyProvider} from './core/context/AnomalyContext'
import {Layout, Sidebar, SidebarBody, SidebarHr, SidebarItem} from './core/Layout'
import {Icons} from './core/Icons'
import {muiTheme, utilsStyles} from './core/theme'
import {lightBlue} from '@material-ui/core/colors'

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
}

const baseUrl = Config.apiBaseUrl + '/api'

const apiPublicSdk = new SignalConsoPublicSdk(new ApiClient({
  baseUrl,
  headers,
}))

const makeSecuredSdk = (token: string) => ({
  public: apiPublicSdk,
  secured: new SignalConsoSecuredSdk(new ApiClient({
    baseUrl,
    headers: {...headers, 'X-Auth-Token': token},
  }))
})

export type SignalConsoApiSdk = ReturnType<typeof makeSecuredSdk>

const loginProvider = makeLoginProviderComponent<User, SignalConsoApiSdk>(apiPublicSdk.authenticate.login, makeSecuredSdk)
export const Login = loginProvider.Login
export const useLoginContext = loginProvider.useLoginContext

const useStyles = makeStyles((t: Theme) => ({
  '@global': {
    '*': {
      boxSizing: 'border-box',
    },
    '.material-icons': {
      display: 'inherit',
    },
    html: {
      fontSize: t.typography.fontSize,
    },
    body: {
      lineHeight: '1.5rem',
      fontFamily: t.typography.fontFamily,
      background: t.palette.background.paper,
      margin: 0,
      color: t.palette.text.primary,
      boxSizing: 'border-box',
    },
    ul: {
      marginTop: '.5em'
    },
    h1: t.typography.h4,
    h2: {
      ...t.typography.h6,
      marginBottom: t.spacing(2),
      marginTop: t.spacing(3),
    },
    p: {
      ...t.typography.body1,
      textAlign: 'justify',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    ':focus': {
      outline: 0,
    },
  },
}))

const App = () => {
  useStyles()
  return (
    <ThemeProvider theme={muiTheme()}>
      <I18nProvider>
        <MuiPickersUtilsProvider utils={DateAdapter}>
          <BrowserRouter>
            <ToastProvider horizontal="right">
              <Login>
                <LoggedApp/>
              </Login>
            </ToastProvider>
          </BrowserRouter>
        </MuiPickersUtilsProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

const LoggedApp = () => {
  const {apiSdk, logout} = useLoginContext()
  return (
    <ReportsProvider api={apiSdk}>
      <ReportProvider api={apiSdk}>
        <ConstantProvider api={apiSdk}>
          <AnomalyProvider api={apiSdk}>
            <Layout toggleSidebarBtnHostElementSelector="#header-actions">
              <Switch>
                <Route exact path="/test" component={Panel}/>
                <Route exact path="/reports" component={Reports}/>
                <Route exact path="/reports/:id" component={ReportComponent}/>
                <Redirect exact from="/" to="/reports"/>
              </Switch>
            </Layout>
          </AnomalyProvider>
        </ConstantProvider>
      </ReportProvider>
    </ReportsProvider>
  )
}



export default App

