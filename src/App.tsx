import React, {useEffect} from 'react'
import {ApiDetailedError, ApiError} from '@signal-conso/signalconso-api-sdk-js'
import {config} from './conf/config'
import makeStyles from '@mui/styles/makeStyles'
import {CircularProgress, StyledEngineProvider, Theme, ThemeProvider} from '@mui/material'
import {BrowserRouter, HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import {I18nProvider} from './core/i18n'
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
import {LoginPage} from './feature/Login/LoginPage'
import {headerHeight, Layout} from './core/Layout'
import {Login} from './shared/Login/Login'
import {LoginProvider, useLogin} from './core/context/LoginContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib/lib'
import {ReportsPro} from './feature/ReportsPro/ReportsPro'
import {ReportedWebsitesProvider} from './core/context/ReportedWebsitesContext'
import {CompanyAccesses} from './feature/CompanyAccesses/CompanyAccesses'
import {useHistory} from 'react-router'
import {UnregistredWebsitesProvider} from './core/context/UnregistredWebsitesContext'
import {CompaniesPro} from './feature/CompaniesPro/CompaniesPro'
import {ReportPro} from './feature/Report/ReportPro'
import {AccessesProvider} from './core/context/AccessesContext'
import {EmailValidation} from './feature/EmailValidation/EmailValidation'
import {CenteredContent} from './shared/CenteredContent/CenteredContent'
import {ResetPassword} from './feature/ResetPassword/ResetPassword'
import {UserActivation} from './feature/Users/UserActivation'
import {BlockedReportNotificationProvider} from './core/context/BlockedReportNotificationProviderContext'
import {ActivateNewCompany} from './feature/ActivateNewCompany/ActivateNewCompany'
import {ModeEmploiDGCCRF} from './feature/ModeEmploiDGCCRF/ModeEmploiDGCCRF'
import {ConsumerReview} from './feature/ConsumerReview/ConsumerReview'
import {CompanyComponent} from './feature/Company/Company'
import {CompaniesDbSyncProvider} from './core/context/CompaniesDbSyncContext'
import {EventProvider} from './core/context/EventContext'
import {CompaniesDbSync} from './feature/CompaniesDbSync/CompaniesDbSync'
import {Matomo} from './core/plugins/Matomo'
import {apiPublicSdk, makeSecuredSdk, SignalConsoApiSdk} from './core/ApiSdkInstance'
import {Stats} from './feature/Stats/Stats'
import {Admin} from './feature/Admin/Admin'

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

const Router: typeof HashRouter = config.useHashRouter ? HashRouter : BrowserRouter

export const App = () => {
  return (
    <Provide
      providers={[
        _ => <StyledEngineProvider injectFirst children={_} />,
        _ => <ThemeProvider theme={muiTheme()} children={_} />,
        _ => <I18nProvider children={_} />,
        _ => <Router children={_} />,
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
  const forgottenPassword = useFetcher<SignalConsoApiSdk['public']['authenticate']['forgotPassword'], ApiDetailedError>(
    apiPublicSdk.authenticate.forgotPassword,
  )

  return (
    <Login
      onRegister={apiPublicSdk.authenticate.sendActivationLink}
      onLogin={apiPublicSdk.authenticate.login}
      onLogout={() => history.push('/')}
      getTokenFromResponse={_ => _.token}
    >
      {({authResponse, login, logout, register, isCheckingToken, setToken}) => (
        <Layout connectedUser={authResponse ? {...authResponse.user, logout: logout} : undefined}>
          <Switch>
            <Route path={siteMap.loggedout.emailValidation}>
              <EmailValidation onSaveToken={setToken} onValidateEmail={apiPublicSdk.authenticate.validateEmail} />
            </Route>
            <Route path={siteMap.loggedout.resetPassword()}>
              <ResetPassword onResetPassword={apiPublicSdk.authenticate.resetPassword} />
            </Route>
            <Route path={siteMap.loggedout.activatePro()}>
              <UserActivation
                onActivateUser={apiPublicSdk.user.activateAccount}
                onFetchTokenInfo={apiPublicSdk.user.fetchTokenInfo}
              />
            </Route>
            <Route path={siteMap.loggedout.activateDgccrf}>
              <UserActivation
                onActivateUser={apiPublicSdk.user.activateAccount}
                onFetchTokenInfo={apiPublicSdk.user.fetchTokenInfo}
              />
            </Route>
            <Route path={siteMap.loggedout.consumerReview()}>
              <ConsumerReview onSubmit={apiPublicSdk.report.postReviewOnReportResponse} />
            </Route>
            <Route path="/">
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
                <CenteredContent offset={headerHeight}>
                  <CircularProgress />
                </CenteredContent>
              ) : (
                <LoginPage
                  login={login}
                  register={register}
                  forgottenPassword={{
                    action: (email: string) => forgottenPassword.fetch({}, email),
                    loading: forgottenPassword.loading,
                    error: forgottenPassword.error,
                  }}
                />
              )}
            </Route>
          </Switch>
        </Layout>
      )}
    </Login>
  )
}

const AppLogged = () => {
  const {apiSdk, connectedUser} = useLogin()
  const history = useHistory()
  useEffect(() => history.listen(_ => Matomo.trackPage(`/${connectedUser.role.toLocaleLowerCase()}${_.pathname}`)), [history])

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
        _ => <AccessesProvider api={apiSdk} children={_} />,
        _ => <BlockedReportNotificationProvider api={apiSdk} children={_} />,
        _ => <CompaniesDbSyncProvider api={apiSdk} children={_} />,
        _ => <EventProvider api={apiSdk} children={_} />,
      ]}
    >
      <Switch>
        <Route path={siteMap.logged.admin} component={Admin} />
        <Route path={siteMap.logged.reportedWebsites} component={ReportedWebsites} />
        <Route path={siteMap.logged.reportedPhone} component={ReportedPhones} />
        <Route path={siteMap.logged.report()} component={connectedUser.isPro ? ReportPro : ReportComponent} />
        <Route path={siteMap.logged.reports()} component={connectedUser.isPro ? ReportsPro : Reports} />
        <Route path={siteMap.logged.users} component={Users} />
        <Route path={siteMap.logged.companies} component={Companies} />
        <Route path={siteMap.logged.companyAccesses()} component={CompanyAccesses} />
        <Route path={siteMap.logged.company()} component={CompanyComponent} />
        <Route path={siteMap.logged.subscriptions} component={Subscriptions} />
        <Route path={siteMap.logged.companiesPro} component={CompaniesPro} />
        <Route path={siteMap.logged.settings} component={Settings} />
        <Route path={siteMap.logged.modeEmploiDGCCRF} component={ModeEmploiDGCCRF} />
        <Route path={siteMap.logged.companiesDbSync} component={CompaniesDbSync} />
        <Route path={siteMap.logged.stats} component={Stats} />
        <Route path={siteMap.loggedout.register} component={ActivateNewCompany} />
        <Redirect from="/" to={siteMap.logged.reports()} />
      </Switch>
    </Provide>
  )
}
