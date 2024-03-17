import {CircularProgress, CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material'
import {QueryClientProvider} from '@tanstack/react-query'
import {ApiProvider} from 'core/context/ApiContext'
import {LoginForm} from 'feature/Login/LoginForm'
import {RegisterForm} from 'feature/Login/RegisterForm'
import {WelcomePage} from 'feature/Login/WelcomePage'
import React, {ReactNode, useEffect} from 'react'
import {Navigate, Routes, useLocation, useNavigate, useParams} from 'react-router'
import {BrowserRouter, HashRouter, Route} from 'react-router-dom'
import {ToastProvider} from './alexlibs/mui-extension'
import {config} from './conf/config'
import {apiPublicSdk, makeSecuredSdk} from './core/ApiSdkInstance'
import {Layout} from './core/Layout'
import {ScHeader} from './core/ScHeader/ScHeader'
import {ScSidebar} from './core/ScSidebar/ScSidebar'
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
import {ReportPro} from './feature/Report/ReportPro'
import ProtectedRoute from './routes/ProtectedRoute'
import {CompaniesRegistered} from './feature/Companies/CompaniesRegistered'
import {CompaniesToActivate} from './feature/Companies/CompaniesToActivate'
import {CompaniesToFollowUp} from './feature/Companies/CompaniesToFollowUp'

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
  const navigate = useNavigate()
  const {toastError} = useToast()

  useEffect(() => {
    setQueryClientErrorHandler(toastError)
  }, [toastError])

  const onLogout = () => {
    apiPublicSdk.authenticate.logout().then(_ => navigate('/'))
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

        // @ts-ignore
        const AuthGate = () => {
          if (isFetchingUser) {
            return (
              <CenteredContent>
                <CircularProgress />
              </CenteredContent>
            )
          } else if (authResponse) {
            return (
              <LoginProvider connectedUser={authResponse!} setConnectedUser={setUser} onLogout={logout} apiSdk={makeSecuredSdk()}>
                <AppLogged />
              </LoginProvider>
            )
          } else {
            return (
              <Routes>
                <Route path={siteMap.loggedout.register} element={<RegisterForm {...{register}} />} />
                <Route path={siteMap.loggedout.login} element={<LoginForm {...{login}} />} />
                <Route path="/" element={<WelcomePage />} />
              </Routes>
            )
          }
        }

        return (
          <Layout header={<ScHeader />} sidebar={authResponse && <ScSidebar connectedUser={authResponse} logout={logout} />}>
            <QueryClientProvider client={queryClient}>
              <Routes>
                <Route
                  path={siteMap.loggedout.emailValidation}
                  element={<EmailValidation onSaveUser={setUser} onValidateEmail={apiPublicSdk.authenticate.validateEmail} />}
                />
                <Route
                  path={siteMap.loggedout.resetPassword()}
                  element={<ResetPassword onResetPassword={apiPublicSdk.authenticate.resetPassword} />}
                />
                <Route path={siteMap.loggedout.activatePro()} element={userActivation} />
                <Route path={siteMap.loggedout.activateAdmin} element={userActivation} />
                <Route path={siteMap.loggedout.activateAgent} element={userActivation} />
                <Route path={siteMap.loggedout.consumerReview()} element={userActivation} />

                <Route
                  path="*"
                  element={
                    <AuthGate />
                    // authResponse ? (
                    //   <LoginProvider
                    //     connectedUser={authResponse}
                    //     setConnectedUser={setUser}
                    //     onLogout={logout}
                    //     apiSdk={makeSecuredSdk()}
                    //   >
                    //     <AppLogged />
                    //   </LoginProvider>
                    // ) : isFetchingUser ? (
                    //   <CenteredContent>
                    //     <CircularProgress />
                    //   </CenteredContent>
                    // ) : (
                    //   <Routes>
                    //     <Route path={siteMap.loggedout.register} element={<RegisterForm {...{register}} />} />
                    //     <Route path={siteMap.loggedout.login} element={<LoginForm {...{login}} />} />
                    //     <Route path="/" element={<WelcomePage />} />
                    //   </Routes>
                    // )
                  }
                />
              </Routes>
            </QueryClientProvider>
          </Layout>
        )
      }}
    </Login>
  )
}

const AppLogged = () => {
  const {apiSdk, connectedUser} = useLogin()
  const history = useNavigate()

  const location = useLocation()
  useEffect(() => {
    Matomo.trackPage(`/${connectedUser.role.toLocaleLowerCase()}${location.pathname}`)
  }, [location])

  return (
    <Provide providers={[_ => <ApiProvider api={apiSdk} children={_} />]}>
      <Routes>
        <Route path={siteMap.logged.tools} element={<Tools />} />
        <Route path={siteMap.logged.reportedWebsites} element={<ReportedWebsites />} />
        <Route path={siteMap.logged.reportedPhone} element={<ReportedPhones />} />
        <Route path={siteMap.logged.reportsfiltred.closed} element={<ReportsPro reportType="closed" />} />
        <Route path={siteMap.logged.report()} element={connectedUser.isPro ? <ReportPro /> : <ReportComponent />} />
        <Route path={siteMap.logged.reports()} element={connectedUser.isPro ? <ReportsPro reportType="open" /> : <Reports />} />
        <Route path={siteMap.logged.users.value()} element={<Users />} />
        <Route path={siteMap.logged.companies.value} element={<Companies />} />
        <Route path={siteMap.logged.companyAccesses()} element={<CompanyAccesses />} />
        <Route path={siteMap.logged.company(':id')} element={<CompanyComponent />} />
        <Route path={siteMap.logged.subscriptions} element={<Subscriptions />} />
        <Route path={siteMap.logged.companiesPro} element={<CompaniesPro />} />
        <Route path={siteMap.logged.joinInformation} element={<JoinNewsletter />} />
        <Route path={siteMap.logged.updateEmail(':token')} element={<UpdateEmail />} />
        <Route path={siteMap.logged.settings} element={<Settings />} />

        <Route
          path={siteMap.logged.modeEmploiDGCCRF}
          element={connectedUser.isPro ? <ReportsPro reportType="open" /> : <ModeEmploiDGCCRF />}
        />
        <Route path={siteMap.logged.stats.value} element={<Stats />} />
        <Route path={siteMap.loggedout.register} element={<AddCompanyForm />} />
        <Route path="/" element={<Navigate replace to={siteMap.logged.reports()} />} />
      </Routes>
    </Provide>
  )
}

const RedirectToWebsite = () => {
  const {reportId} = useParams<{reportId: string}>()
  window.location.href = `${config.appBaseUrl}/avis/${reportId}`
  return null
}
