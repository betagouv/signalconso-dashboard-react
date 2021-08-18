import React from 'react'
import {ApiClient, ApiError, SignalConsoPublicSdk, SignalConsoSecuredSdk} from 'core/api'
import {Config} from './conf/config'
import {makeStyles} from '@material-ui/core/styles'
import {Theme, ThemeProvider} from '@material-ui/core'
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import {I18nProvider, useI18n} from './core/i18n'
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
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {ReportsPro} from './feature/ReportsPro/ReportsPro'
import {ReportedWebsitesProvider} from './core/context/ReportedWebsitesContext'
import {CompanyAccesses} from './feature/CompanyAccesses/CompanyAccesses'
import {useHistory} from 'react-router'
import {UnregistredWebsitesProvider} from './core/context/UnregistredWebsitesContext'
import {CompaniesPro} from './feature/CompaniesPro/CompaniesPro'
import {ReportPro} from './feature/Report/ReportPro'
import {BlockedReportNotificationProvider} from './core/context/BlockedReportNotificationProviderContext'

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

const baseUrl = Config.apiBaseUrl + '/api'

const apiPublicSdk = new SignalConsoPublicSdk(
  new ApiClient({
    baseUrl,
    headers,
  }),
)

const makeSecuredSdk = (token: string) => ({
  public: apiPublicSdk,
  secured: new SignalConsoSecuredSdk(
    new ApiClient({
      baseUrl,
      headers: {...headers, 'X-Auth-Token': token},
    }),
  ),
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
      marginTop: '.5em',
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
  return (
    <Provide
      providers={[
        _ => <ThemeProvider theme={muiTheme()} children={_} />,
        _ => <I18nProvider children={_} />,
        _ => <MuiPickersUtilsProvider utils={DateAdapter} children={_} />,
        _ => <HashRouter children={_} />,
        _ => <ToastProvider horizontal="right" children={_} />,
      ]}
    >
      <AppLogin />
    </Provide>
  )
}

const AppLogin = () => {
  useStyles()
  const history = useHistory()
  const forgottenPassword = useFetcher<SignalConsoApiSdk['public']['authenticate']['forgotPassword'], ApiError>(
    apiPublicSdk.authenticate.forgotPassword,
  )

  return (
    <Login onLogin={apiPublicSdk.authenticate.login} onLogout={() => history.push('/')} getTokenFromResponse={_ => _.token}>
      {({authResponse, login, logout, isLogging, isCheckingToken}) => (
        <Layout connectedUser={authResponse ? {...authResponse.user, logout: logout} : undefined}>
          {authResponse ? (
            <LoginProvider
              connectedUser={authResponse.user}
              token={authResponse.token}
              onLogout={logout}
              apiSdk={makeSecuredSdk(authResponse.token)}
            >
              <AppLogged />
            </LoginProvider>
          ) : isCheckingToken ? (
            <LoginLoader />
          ) : (
            <LoginPage
              isLogging={isLogging}
              onLogin={login}
              forgottenPassword={{
                action: (email: string) => forgottenPassword.fetch({}, email),
                loading: forgottenPassword.loading,
                errorMsg: forgottenPassword.error?.message,
              }}
            />
          )}
        </Layout>
      )}
    </Login>
  )
}

const AppLogged = () => {
  const {apiSdk, connectedUser} = useLogin()
  const {m} = useI18n()
  return (
    <Provide
      providers={[
        _ => <ReportsProvider api={apiSdk} children={_} />,
        _ => <ReportProvider api={apiSdk} children={_} />,
        _ => <ConstantProvider api={apiSdk} children={_} />,
        _ => <AnomalyProvider api={apiSdk} children={_} />,
        _ => <ReportedPhonesProvider api={apiSdk} children={_} />,
        _ => <AsyncFileProvider api={apiSdk} children={_} />,
        _ => <CompaniesProvider api={apiSdk} children={_} />,
        _ => <UsersProvider api={apiSdk} children={_} />,
        _ => <ReportedWebsitesProvider api={apiSdk} children={_} />,
        _ => <UnregistredWebsitesProvider api={apiSdk} children={_} />,
        _ => <SubscriptionsProvider api={apiSdk} children={_} />,
        _ => <BlockedReportNotificationProvider api={apiSdk} children={_} />,
      ]}
    >
      <Switch>
        <Route path={siteMap.reportedWebsites} component={ReportedWebsites} />
        <Route path={siteMap.reportedPhone} component={ReportedPhones} />
        <Route path={siteMap.report()} component={connectedUser.isPro ? ReportPro : ReportComponent} />
        <Route path={siteMap.reports()} component={connectedUser.isPro ? ReportsPro : Reports} />
        <Route path={siteMap.users} component={Users} />
        <Route path={siteMap.companies} component={Companies} />
        <Route path={siteMap.companyAccesses()} component={CompanyAccesses} />
        <Route path={siteMap.subscriptions} component={Subscriptions} />
        <Route path={siteMap.companiesPro} component={CompaniesPro} />
        <Route path={siteMap.settings} component={Settings} />
        <Redirect exact from="/" to={siteMap.reports()} />
      </Switch>
    </Provide>
  )
}
