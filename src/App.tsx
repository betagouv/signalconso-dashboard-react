import {CircularProgress, CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material'
import {MutationCache, QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ApiProvider} from 'core/context/ApiContext'
import {LoginForm} from 'feature/Login/LoginForm'
import {RegisterForm} from 'feature/Login/RegisterForm'
import {WelcomePage} from 'feature/Login/WelcomePage'
import {useEffect, useMemo} from 'react'
import {useHistory, useParams} from 'react-router'
import {BrowserRouter, HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import {ToastProvider} from './alexlibs/mui-extension'
import {config} from './conf/config'
import {apiPublicSdk, makeSecuredSdk} from './core/ApiSdkInstance'
import {Layout} from './core/Layout'
import {ScHeader} from './core/ScHeader/ScHeader'
import {ScSidebar} from './core/ScSidebar/ScSidebar'
import {ApiError} from './core/client/ApiClient'
import {LoginProvider, useLogin} from './core/context/LoginContext'
import {I18nProvider} from './core/i18n'
import {Matomo} from './core/plugins/Matomo'
import {siteMap} from './core/siteMap'
import {muiTheme} from './core/theme'
import {useToast} from './core/toast'
import {AddCompanyForm} from './feature/AddCompany/AddCompanyForm'
import {Tools} from './feature/AdminTools/Tools'
import {Companies} from './feature/Companies/Companies'
import {CompaniesPro} from './feature/CompaniesPro/CompaniesPro'
import {CompanyComponent} from './feature/Company/Company'
import {CompanyAccesses} from './feature/CompanyAccesses/CompanyAccesses'
import {EmailValidation} from './feature/EmailValidation/EmailValidation'
import {JoinNewsletter} from './feature/JoinNewsletter/JoinNewsletter'
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
import {CenteredContent} from './shared/CenteredContent'
import {Login} from './shared/Login'
import {Provide} from './shared/Provide'
import './style.css'
import {UpdateEmail} from './feature/Settings/UpdateEmail'
import {queryClient, setQueryClientErrorHandler} from 'queryClient'

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
  const {toastError} = useToast()

  useEffect(() => {
    setQueryClientErrorHandler(toastError)
  }, [toastError])

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
                    <LoginProvider
                      connectedUser={authResponse}
                      setConnectedUser={setUser}
                      onLogout={logout}
                      apiSdk={makeSecuredSdk()}
                    >
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
  const {apiSdk, connectedUser} = useLogin()
  const history = useHistory()

  useEffect(
    () =>
      history.listen(_ => {
        Matomo.trackPage(`/${connectedUser.role.toLocaleLowerCase()}${_.pathname}`)
      }),
    [history],
  )

  return (
    <Provide providers={[_ => <ApiProvider api={apiSdk} children={_} />]}>
      <Switch>
        <Route path={siteMap.logged.tools} component={Tools} />
        <Route path={siteMap.logged.reportedWebsites} component={ReportedWebsites} />
        <Route path={siteMap.logged.reportedPhone} component={ReportedPhones} />
        <Route path={siteMap.logged.reportsfiltred.closed} component={() => <ReportsPro reportType="closed" />} />
        <Route path={siteMap.logged.report()} component={connectedUser.isPro ? ReportPro : ReportComponent} />
        <Route
          path={siteMap.logged.reports()}
          component={connectedUser.isPro ? () => <ReportsPro reportType="open" /> : Reports}
        />
        <Route path={siteMap.logged.users} component={Users} />
        <Route path={siteMap.logged.companies} component={Companies} />
        <Route path={siteMap.logged.companyAccesses()} component={CompanyAccesses} />
        <Route path={siteMap.logged.company(':id')} component={CompanyComponent} />
        <Route path={siteMap.logged.subscriptions} component={Subscriptions} />
        <Route path={siteMap.logged.companiesPro} component={CompaniesPro} />
        <Route path={siteMap.logged.joinInformation} component={JoinNewsletter} />
        <Route path={siteMap.logged.updateEmail(':token')} component={UpdateEmail} />
        <Route path={siteMap.logged.settings} component={Settings} />
        <Route path={siteMap.logged.modeEmploiDGCCRF} component={connectedUser.isPro ? () => null : ModeEmploiDGCCRF} />
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
