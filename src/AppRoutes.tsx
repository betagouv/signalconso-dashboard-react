import {CircularProgress} from '@mui/material'
import {ApiProvider} from 'core/context/ApiContext'
import {LoginForm} from 'feature/Login/LoginForm'
import {RegisterForm} from 'feature/Login/RegisterForm'
import {WelcomePage} from 'feature/Login/WelcomePage'
import {useEffect} from 'react'
import {Navigate, Routes, useLocation} from 'react-router'
import {Route} from 'react-router-dom'
import {apiPublicSdk, makeSecuredSdk} from './core/ApiSdkInstance'
import {UserWithPermission} from './core/client/authenticate/Authenticate'
import {LoginProvider, useLogin} from './core/context/LoginContext'
import {Matomo} from './core/plugins/Matomo'
import {siteMap} from './core/siteMap'
import {AddCompanyForm} from './feature/AddCompany/AddCompanyForm'
import {Tools} from './feature/AdminTools/Tools'
import {Companies} from './feature/Companies/Companies'
import {CompaniesPro} from './feature/CompaniesPro/CompaniesPro'
import {Company} from './feature/Company/Company'
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
import {UpdateEmail} from './feature/Settings/UpdateEmail'
import {Stats} from './feature/Stats/Stats'
import {Subscriptions} from './feature/Subscriptions/Subscriptions'
import {UserActivation} from './feature/Users/UserActivation'
import {Users} from './feature/Users/Users'
import {CenteredContent} from './shared/CenteredContent'
import {LoginActionProps} from './core/useLoginManagement'
import './style.css'

export interface LoginExposedProps {
  connectedUser?: UserWithPermission
  logout: () => void
  login: LoginActionProps<(login: string, password: string) => Promise<UserWithPermission>>
  register: LoginActionProps<(siret: string, token: string, email: string) => Promise<void>>
  setConnectedUser: (_: UserWithPermission) => void
  isFetchingUser: boolean
}

export const AppRoutes = ({connectedUser, setConnectedUser, register, isFetchingUser, login, logout}: LoginExposedProps) => {
  const UserActivationComponent = () => (
    <UserActivation onActivateUser={apiPublicSdk.user.activateAccount} onFetchTokenInfo={apiPublicSdk.user.fetchTokenInfo} />
  )

  return (
    <Routes>
      <Route
        path={siteMap.loggedout.emailValidation}
        element={<EmailValidation onSaveUser={setConnectedUser} onValidateEmail={apiPublicSdk.authenticate.validateEmail} />}
      />
      <Route
        path={siteMap.loggedout.resetPassword()}
        element={<ResetPassword onResetPassword={apiPublicSdk.authenticate.resetPassword} />}
      />
      <Route path={siteMap.loggedout.activatePro()} element={<UserActivationComponent />} />
      <Route path={siteMap.loggedout.activateAdmin} element={<UserActivationComponent />} />
      <Route path={siteMap.loggedout.activateAgent} element={<UserActivationComponent />} />
      <Route path={siteMap.loggedout.consumerReview()} element={<UserActivationComponent />} />

      <Route
        path="*"
        element={
          connectedUser ? (
            <LoginProvider
              connectedUser={connectedUser}
              setConnectedUser={setConnectedUser}
              onLogout={logout}
              apiSdk={makeSecuredSdk()}
            >
              <ProtectedRoutes />
            </LoginProvider>
          ) : isFetchingUser ? (
            <CenteredContent>
              <CircularProgress />
            </CenteredContent>
          ) : (
            <Routes>
              <Route path={siteMap.loggedout.register} element={<RegisterForm {...{register}} />} />
              <Route path={siteMap.loggedout.login} element={<LoginForm {...{login}} />} />
              <Route path="/*" element={<WelcomePage />} />
            </Routes>
          )
        }
      />
    </Routes>
  )
}

const ProtectedRoutes = () => {
  const {apiSdk, connectedUser} = useLogin()

  const location = useLocation()
  useEffect(() => {
    Matomo.trackPage(`/${connectedUser.role.toLocaleLowerCase()}${location.pathname}`)
  }, [location])

  return (
    <ApiProvider api={apiSdk}>
      <Routes>
        <Route path={siteMap.logged.tools.value} element={<Tools />} />
        <Route path={siteMap.logged.reportedWebsites.value} element={<ReportedWebsites />} />
        <Route path={siteMap.logged.reportedPhone} element={<ReportedPhones />} />
        <Route
          path={siteMap.logged.reportsfiltred.closed}
          //Keep the key property unique to this route
          //When using React Router v6 and you have multiple routes pointing to the same component (here siteMap.logged.reportsfiltred.closed and siteMap.logged.report()),
          //by default, React Router does not re-render the component if it's already mounted and the route changes to another path that uses the same component.
          //We have to add a key properties to distinguish the two calls and force re-render
          element={<ReportsPro reportType="closed" key={siteMap.logged.reportsfiltred.closed} />}
        />
        <Route path={siteMap.logged.report()} element={connectedUser.isPro ? <ReportPro /> : <ReportComponent />} />
        <Route
          path={siteMap.logged.reports()}
          //Keep the key property unique to this route ( see comment above )
          element={connectedUser.isPro ? <ReportsPro reportType="open" key={siteMap.logged.reports()} /> : <Reports />}
        />
        <Route path={siteMap.logged.users.value()} element={<Users />} />
        <Route path={siteMap.logged.companies.value} element={<Companies />} />
        <Route path={siteMap.logged.company(':id').value} element={<Company />} />
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
        <Route path="/*" element={<Navigate replace to={siteMap.logged.reports()} />} />
      </Routes>
    </ApiProvider>
  )
}
