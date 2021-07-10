import React from 'react'
import {ApiClient, SignalConsoPublicSdk, SignalConsoSecuredSdk} from 'core/api'
import {Config} from './conf/config'
import {makeStyles} from '@material-ui/core/styles'
import {Theme, ThemeProvider} from '@material-ui/core'
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import {I18nProvider} from './core/i18n'
import {MuiPickersUtilsProvider} from '@material-ui/pickers'
import DateAdapter from '@date-io/date-fns'
import {ReportProvider} from './core/context/ReportContext'
import {Reports} from './feature/Reports/Reports'
import {ReportComponent} from './feature/Report/Report'
import {ToastProvider} from 'mui-extension/lib'
import {muiTheme} from './core/theme'
import {ReportedWebsites} from './feature/ReportedWebsites/ReportedWebsites'
import {ReportedPhones} from './feature/ReportedPhones/ReportedPhones'
import {siteMap} from './core/siteMap'
import {Companies} from './feature/Companies/Companies'
import {Users} from './feature/Users/Users'
import {ConstantProvider} from './core/context/ConstantContext'
import {AnomalyProvider} from './core/context/AnomalyContext'
import {ReportedPhonesProvider} from './core/context/ReportedPhonesContext'
import {AsyncFileProvider} from './core/context/AsyncFileContext'
import {CompaniesProvider} from './core/context/CompaniesContext'
import {ReportsProvider} from './core/context/ReportsContext'
import {Provide} from './shared/Provide/Provide'
import {UsersProvider} from './core/context/UsersContext'
import {Settings} from './feature/Settings/Settings'
import {Subscriptions} from './feature/Subscriptions/Subscriptions'
import {SubscriptionsProvider} from './core/context/SubscriptionsContext'
import {LoginPage} from './core/Login/LoginPage'
import {Layout} from './core/Layout'
import {Login} from './core/Login/Login'
import {LoginProvider, useLogin} from './core/context/LoginContext'
import {LoginLoader} from './core/Login/LoginLoader'

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
      color: t.palette.text.primary,
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

export const App = () => {
  useStyles()
  return (
    <Provide providers={[
      _ => <ThemeProvider theme={muiTheme()} children={_}/>,
      _ => <I18nProvider children={_}/>,
      _ => <MuiPickersUtilsProvider utils={DateAdapter} children={_}/>,
      _ => <BrowserRouter children={_}/>,
      _ => <ToastProvider horizontal="right" children={_}/>,
    ]}>
      <Login onLogin={apiPublicSdk.authenticate.login} getTokenFromResponse={_ => _.token}>
        {({authResponse, login, logout, isLogging, isCheckingToken}) =>
          <Layout connectedUser={authResponse ? {...authResponse.user, logout: logout} : undefined}>
            {authResponse ? (
              <LoginProvider
                connectedUser={authResponse.user}
                token={authResponse.token}
                onLogout={logout}
                apiSdk={makeSecuredSdk(authResponse.token)}
              >
                <LoggedApp/>
              </LoginProvider>
            ) : isCheckingToken ? (
              <LoginLoader/>
            ) : (
              <LoginPage isLoading={isLogging} onLogin={login}/>
            )}
          </Layout>
        }
      </Login>
    </Provide>
  )
}

const LoggedApp = () => {
  const {apiSdk} = useLogin()
  return (
    <Provide providers={[
      _ => <ReportsProvider api={apiSdk} children={_}/>,
      _ => <ReportProvider api={apiSdk} children={_}/>,
      _ => <ConstantProvider api={apiSdk} children={_}/>,
      _ => <AnomalyProvider api={apiSdk} children={_}/>,
      _ => <ReportedPhonesProvider api={apiSdk} children={_}/>,
      _ => <AsyncFileProvider api={apiSdk} children={_}/>,
      _ => <CompaniesProvider api={apiSdk} children={_}/>,
      _ => <UsersProvider api={apiSdk} children={_}/>,
      _ => <SubscriptionsProvider api={apiSdk} children={_}/>,
    ]}>
      <Switch>
        <Route path={siteMap.reportedWebsites} component={ReportedWebsites}/>
        <Route path={siteMap.reportedPhone} component={ReportedPhones}/>
        <Route path={siteMap.reports()} component={Reports}/>
        <Route path={siteMap.report()} component={ReportComponent}/>
        <Route path={siteMap.users} component={Users}/>
        <Route path={siteMap.companies} component={Companies}/>
        <Route path={siteMap.settings} component={Settings}/>
        <Route path={siteMap.subscriptions} component={Subscriptions}/>
        <Redirect exact from="/" to={siteMap.reports()}/>
      </Switch>
    </Provide>
  )
}
