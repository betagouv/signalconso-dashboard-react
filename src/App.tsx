import {CircularProgress, CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material'
import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ApiProvider} from 'core/context/ApiContext'
import {RegisterForm} from 'feature/Login/RegisterForm'
import {LoginForm} from 'feature/Login/LoginForm'
import {WelcomePage} from 'feature/Login/WelcomePage'
import {useEffect} from 'react'
import {useHistory, useParams} from 'react-router'
import {BrowserRouter, HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import {ToastProvider} from './alexlibs/mui-extension'
import {config} from './conf/config'
import {apiPublicSdk, makeSecuredSdk} from './core/ApiSdkInstance'
import {Layout} from './core/Layout'
import {ScHeader} from './core/ScHeader/ScHeader'
import {ScSidebar} from './core/ScSidebar/ScSidebar'
import {AccessesProvider} from './core/context/AccessesContext'
import {AsyncFileProvider} from './core/context/AsyncFileContext'
import {BlockedReportNotificationProvider} from './core/context/BlockedReportNotificationProviderContext'
import {CompaniesProvider} from './core/context/CompaniesContext'
import {ConstantProvider} from './core/context/ConstantContext'
import {ConsumerEmailValidationProvider} from './core/context/EmailValidationContext'
import {EventProvider} from './core/context/EventContext'
import {LoginProvider, useLogin} from './core/context/LoginContext'
import {ReportProvider} from './core/context/ReportContext'
import {ReportedPhonesProvider} from './core/context/ReportedPhonesContext'
import {ReportedWebsitesProvider} from './core/context/ReportedWebsitesContext'
import {ReportsProvider} from './core/context/ReportsContext'
import {SubscriptionsProvider} from './core/context/SubscriptionsContext'
import {UnregistredWebsitesProvider} from './core/context/UnregistredWebsitesContext'
import {UsersProvider} from './core/context/UsersContext'
import {WebsiteInvestigationProvider} from './core/context/WebsiteInvestigationContext'
import {I18nProvider} from './core/i18n'
import {Matomo} from './core/plugins/Matomo'
import {siteMap} from './core/siteMap'
import {muiTheme} from './core/theme'
import {AddCompanyForm} from './feature/AddCompany/AddCompanyForm'
import {Companies} from './feature/Companies/Companies'
import {CompaniesPro} from './feature/CompaniesPro/CompaniesPro'
import {JoinNewsletter} from './feature/JoinNewsletter/JoinNewsletter'
import {CompanyComponent} from './feature/Company/Company'
import {CompanyAccesses} from './feature/CompanyAccesses/CompanyAccesses'
import {EmailValidation} from './feature/EmailValidation/EmailValidation'
import {ModeEmploiDGCCRF} from './feature/ModeEmploiDGCCRF/ModeEmploiDGCCRF'
import {ReportComponent} from './feature/Report/Report'
import {ReportPro} from './feature/Report/ReportPro'
import {ReportedPhones} from './feature/ReportedPhones/ReportedPhones'
import {ReportedWebsites} from './feature/ReportedWebsites/ReportedWebsites'
import {Reports} from './feature/Reports/Reports'
import {ReportsPro} from './feature/ReportsPro/ReportsPro'
import {ResetPassword} from './feature/ResetPassword/ResetPassword'
import {Settings} from './feature/Settings/Settings'
import {Stats} from './feature/Stats/Stats'
import {Subscriptions} from './feature/Subscriptions/Subscriptions'
import {UserActivation} from './feature/Users/UserActivation'
import {Users} from './feature/Users/Users'
import {Login} from './shared/Login'
import {Provide} from './shared/Provide'
import './style.css'
import {CenteredContent} from './shared/CenteredContent'
import {Tools} from './feature/AdminTools/Tools'
import {useToast} from './core/toast'
import {ApiError} from './core/client/ApiClient'

const Router: typeof HashRouter = config.useHashRouter ? HashRouter : BrowserRouter

export const App = () => {
  return (
    <Provide
      providers={[
        _ => <ThemeProvider theme={muiTheme()} children={_} />,
        _ => <StyledEngineProvider children={_} />,
        _ => <CssBaseline children={_} />,
        _ => <Router children={_} />,
        _ => <I18nProvider children={_} />,
        _ => <ToastProvider horizontal="right" children={_} />,
      ]}
    >
      <AppLogin />
    </Provide>
  )
}

const AppLogin = () => {
  const history = useHistory()
  const queryClient = new QueryClient()

  const onLogout = () => {
    apiPublicSdk.authenticate.logout().then(_ => history.push('/'))
  }

  return (
    <Login
      onRegister={apiPublicSdk.authenticate.sendActivationLink}
      onLogin={apiPublicSdk.authenticate.login}
      onLogout={onLogout}
      getUser={apiPublicSdk.authenticate.getUser}
    >
      {({authResponse, login, logout, register, setUser, isFetchingUser}) => {
        const userActivation = (
          <UserActivation
            onActivateUser={apiPublicSdk.user.activateAccount}
            onFetchTokenInfo={apiPublicSdk.user.fetchTokenInfo}
          />
        )

        return (
          <Layout header={<ScHeader />} sidebar={authResponse && <ScSidebar connectedUser={authResponse} logout={logout} />}>
            <Provide providers={[_ => <QueryClientProvider client={queryClient} children={_} />]}>
              <Switch>
                <Route path={siteMap.loggedout.emailValidation}>
                  <EmailValidation onSaveUser={setUser} onValidateEmail={apiPublicSdk.authenticate.validateEmail} />
                </Route>
                <Route path={siteMap.loggedout.resetPassword()}>
                  <ResetPassword onResetPassword={apiPublicSdk.authenticate.resetPassword} />
                </Route>
                <Route path={siteMap.loggedout.activatePro()}>{userActivation}</Route>
                <Route path={siteMap.loggedout.activateAdmin}>{userActivation}</Route>
                <Route path={siteMap.loggedout.activateAgent}>{userActivation}</Route>
                <Route path={siteMap.loggedout.consumerReview()} component={RedirectToWebsite} />
                <Route path="/">
                  {authResponse ? (
                    <LoginProvider connectedUser={authResponse} onLogout={logout} apiSdk={makeSecuredSdk()}>
                      <AppLogged />
                    </LoginProvider>
                  ) : isFetchingUser ? (
                    <CenteredContent>
                      <CircularProgress />
                    </CenteredContent>
                  ) : (
                    <Switch>
                      <Route path={siteMap.loggedout.register}>
                        <RegisterForm {...{register}} />
                      </Route>
                      <Route path={siteMap.loggedout.login}>
                        <LoginForm {...{login}} />
                      </Route>
                      <Route path="/" component={WelcomePage} />
                    </Switch>
                  )}
                </Route>
              </Switch>
            </Provide>
          </Layout>
        )
      }}
    </Login>
  )
}

const AppLogged = () => {
  const {apiSdk, connectedUser, logout} = useLogin()
  const history = useHistory()
  const {toastError} = useToast()
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: error => {
        if (error instanceof ApiError) {
          toastError(error)
        }
      },
    }),
  })
  useEffect(() => history.listen(_ => Matomo.trackPage(`/${connectedUser.role.toLocaleLowerCase()}${_.pathname}`)), [history])

  return (
    <Provide
      providers={[
        _ => <QueryClientProvider client={queryClient} children={_} />,
        _ => <ApiProvider api={apiSdk} children={_} />,
        _ => <ReportsProvider api={apiSdk} children={_} />,
        _ => <ReportProvider api={apiSdk} children={_} />,
        _ => <ConstantProvider api={apiSdk} children={_} />,
        _ => <ReportedPhonesProvider api={apiSdk} children={_} />,
        _ => <AsyncFileProvider api={apiSdk} children={_} />,
        _ => <CompaniesProvider api={apiSdk} children={_} />,
        _ => <UsersProvider api={apiSdk} children={_} />,
        _ => <ConsumerEmailValidationProvider api={apiSdk} children={_} />,
        _ => <ReportedWebsitesProvider api={apiSdk} children={_} />,
        _ => <WebsiteInvestigationProvider api={apiSdk} children={_} />,
        _ => <UnregistredWebsitesProvider api={apiSdk} children={_} />,
        _ => <SubscriptionsProvider api={apiSdk} children={_} />,
        _ => <AccessesProvider api={apiSdk} children={_} />,
        _ => <BlockedReportNotificationProvider api={apiSdk} children={_} />,
        _ => <EventProvider api={apiSdk} children={_} />,
      ]}
    >
      <Switch>
        <Route path={siteMap.logged.tools} component={Tools} />
        <Route path={siteMap.logged.reportedWebsites} component={ReportedWebsites} />
        <Route path={siteMap.logged.reportedPhone} component={ReportedPhones} />
        <Route path={siteMap.logged.report()} component={connectedUser.isPro ? ReportPro : ReportComponent} />
        <Route path={siteMap.logged.reports()} component={connectedUser.isPro ? ReportsPro : Reports} />
        <Route path={siteMap.logged.users} component={Users} />
        <Route path={siteMap.logged.companies} component={Companies} />
        <Route path={siteMap.logged.companyAccesses()} component={CompanyAccesses} />
        <Route path={siteMap.logged.company(':id')} component={CompanyComponent} />
        <Route path={siteMap.logged.subscriptions} component={Subscriptions} />
        <Route path={siteMap.logged.companiesPro} component={CompaniesPro} />
        <Route path={siteMap.logged.joinInformation} component={JoinNewsletter} />
        <Route path={siteMap.logged.settings} component={Settings} />
        <Route path={siteMap.logged.modeEmploiDGCCRF} component={connectedUser.isPro ? ReportsPro : ModeEmploiDGCCRF} />
        <Route path={siteMap.logged.stats} component={Stats} />
        <Route path={siteMap.loggedout.register} component={AddCompanyForm} />
        <Redirect from="/" to={siteMap.logged.reports()} />
      </Switch>
    </Provide>
  )
}

const RedirectToWebsite = () => {
  const {reportId} = useParams<{reportId: string}>()
  window.location.href = `${config.appBaseUrl}/avis/${reportId}`
  return null
}
