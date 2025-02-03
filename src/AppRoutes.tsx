import { CircularProgress } from '@mui/material'
import { User } from 'core/model'
import { trackPage } from 'core/plugins/Matomo'
import { LoginManagementResult } from 'core/useLoginManagement'
import { ProLoginForm } from 'feature/Login/ProLoginForm'
import { RegisterForm } from 'feature/Login/RegisterForm'
import { WelcomePage } from 'feature/Login/WelcomePage'
import React, { useEffect, useMemo } from 'react'
import { Navigate, Routes, useLocation } from 'react-router'
import { Route } from 'react-router-dom'
import { buildConnectedApiSdks } from './core/apiSdkInstances'
import {
  ConnectedContextProvider,
  useConnectedContext,
} from './core/context/ConnectedContext'
import { siteMap } from './core/siteMap'
import { AddCompanyForm } from './feature/AddCompany/AddCompanyForm'
import { Tools } from './feature/AdminTools/Tools'
import { Companies } from './feature/Companies/Companies'
import { CompaniesPro } from './feature/CompaniesPro/CompaniesPro'
import { Company } from './feature/Company/Company'
import { EmailValidation } from './feature/EmailValidation/EmailValidation'
import { Engagements } from './feature/Engagement/Engagements'
import { JoinNewsletter } from './feature/JoinNewsletter/JoinNewsletter'
import { AgentLoginForm } from './feature/Login/AgentLoginForm'
import ProConnectCallback from './feature/Login/ProConnectCallback'
import ProConnectLogoutCallback from './feature/Login/ProConnectLogoutCallback'
import { ModeEmploiDGCCRF } from './feature/ModeEmploiDGCCRF/ModeEmploiDGCCRF'
import { ReportComponent } from './feature/Report/Report'
import { ReportPro } from './feature/Report/ReportPro'
import { ReportedPhones } from './feature/ReportedPhones/ReportedPhones'
import { ReportedWebsites } from './feature/ReportedWebsites/ReportedWebsites'
import { Reports } from './feature/Reports/Reports'
import { ReportsPro } from './feature/ReportsPro/ReportsPro'
import { ResetPassword } from './feature/ResetPassword/ResetPassword'
import { Settings } from './feature/Settings/Settings'
import { UpdateEmail } from './feature/Settings/UpdateEmail'
import { Stats } from './feature/Stats/Stats'
import { Subscriptions } from './feature/Subscriptions/Subscriptions'
import { UserActivation } from './feature/Users/UserActivation'
import { Users } from './feature/Users/Users'
import { UsersPro } from './feature/Users/UsersPro'
import { CenteredContent } from './shared/CenteredContent'
import { RefreshBanner } from './shared/RefreshBanner'
import './style.css'

export const AppRoutes = ({
  loginManagementResult,
}: {
  loginManagementResult: LoginManagementResult
}) => {
  const {
    connectedUser,
    setConnectedUser,
    register,
    loginProConnect,
    startProConnect,
    handleDetectedLogout,
    isFetchingUserOnStartup,
    login,
  } = loginManagementResult

  const UserActivationComponent = () => (
    <UserActivation onUserActivated={setConnectedUser} />
  )

  return (
    <Routes>
      <Route
        path={siteMap.loggedout.emailValidation}
        element={<EmailValidation onSaveUser={setConnectedUser} />}
      />
      <Route
        path={siteMap.loggedout.resetPassword()}
        element={<ResetPassword />}
      />
      <Route
        path={siteMap.loggedout.activatePro()}
        element={<UserActivationComponent />}
      />
      <Route
        path={siteMap.loggedout.activateAdmin}
        element={<UserActivationComponent />}
      />
      <Route
        path={siteMap.loggedout.activateAgent}
        element={<UserActivationComponent />}
      />

      <Route
        path="*"
        element={
          connectedUser ? (
            <ConnectedRoutesSetup
              {...{ connectedUser, setConnectedUser, handleDetectedLogout }}
            />
          ) : isFetchingUserOnStartup ? (
            <CenteredContent>
              <CircularProgress />
            </CenteredContent>
          ) : (
            <Routes>
              <Route
                path={siteMap.loggedout.proconnect_login_callback}
                element={<ProConnectCallback {...{ loginProConnect }} />}
              />
              <Route
                path={siteMap.loggedout.proconnect_logout_callback}
                element={<ProConnectLogoutCallback />}
              />
              <Route
                path={siteMap.loggedout.register}
                element={<RegisterForm {...{ register }} />}
              />
              <Route
                path={siteMap.loggedout.login}
                element={<ProLoginForm {...{ login }} />}
              />

              <Route
                path={siteMap.loggedout.loginAgent}
                element={<AgentLoginForm {...{ login, startProConnect }} />}
              />
              <Route path="/*" element={<WelcomePage />} />
            </Routes>
          )
        }
      />
    </Routes>
  )
}

function ConnectedRoutesSetup({
  connectedUser,
  setConnectedUser,
  handleDetectedLogout,
}: {
  connectedUser: User
  setConnectedUser: LoginManagementResult['setConnectedUser']
  handleDetectedLogout: LoginManagementResult['handleDetectedLogout']
}) {
  const apiSdk = useMemo(
    () =>
      buildConnectedApiSdks({
        onDisconnected: handleDetectedLogout,
      }),
    [handleDetectedLogout],
  )
  return (
    <ConnectedContextProvider
      {...{ connectedUser, setConnectedUser, api: apiSdk }}
    >
      <ProtectedRoutes />
    </ConnectedContextProvider>
  )
}

const ProtectedRoutes = () => {
  const { connectedUser } = useConnectedContext()

  const location = useLocation()
  useEffect(() => {
    trackPage(
      `/${connectedUser.role.toLocaleLowerCase()}${location.pathname}`,
      connectedUser,
    )
  }, [location])

  return (
    <>
      <RefreshBanner />
      <Routes>
        <Route path={siteMap.logged.tools.value}>
          <Route path="*" element={<Tools />} />
        </Route>
        <Route path={siteMap.logged.reportedWebsites.value}>
          <Route path="*" element={<ReportedWebsites />} />
        </Route>
        <Route
          path={siteMap.logged.reportedPhone}
          element={<ReportedPhones />}
        />
        <Route
          path={siteMap.logged.reportsfiltred.closed}
          //Keep the key property unique to this route
          //When using React Router v6 and you have multiple routes pointing to the same component (here siteMap.logged.reportsfiltred.closed and siteMap.logged.report()),
          //by default, React Router does not re-render the component if it's already mounted and the route changes to another path that uses the same component.
          //We have to add a key properties to distinguish the two calls and force re-render
          element={
            <ReportsPro
              reportType="closed"
              key={siteMap.logged.reportsfiltred.closed}
            />
          }
        />
        <Route
          path={siteMap.logged.reportsfiltred.engagements}
          element={<Engagements />}
        />
        <Route
          path={siteMap.logged.report()}
          element={connectedUser.isPro ? <ReportPro /> : <ReportComponent />}
        />
        <Route
          path={siteMap.logged.reports()}
          //Keep the key property unique to this route ( see comment above )
          element={
            connectedUser.isPro ? (
              <ReportsPro reportType="open" key={siteMap.logged.reports()} />
            ) : (
              <Reports />
            )
          }
        />
        <Route path={siteMap.logged.users.value}>
          <Route path="*" element={<Users />} />
        </Route>
        <Route path={siteMap.logged.companies.value}>
          <Route path="*" element={<Companies />} />
        </Route>
        <Route
          path={siteMap.logged.company(':id').value}
          element={<Company />}
        />
        <Route
          path={siteMap.logged.subscriptions}
          element={<Subscriptions />}
        />
        <Route path={siteMap.logged.companiesPro} element={<CompaniesPro />} />
        <Route path={siteMap.logged.usersPro} element={<UsersPro />} />
        <Route
          path={siteMap.logged.joinInformation}
          element={<JoinNewsletter />}
        />
        <Route
          path={siteMap.logged.updateEmail(':token')}
          element={<UpdateEmail />}
        />
        <Route path={siteMap.logged.settings} element={<Settings />} />

        <Route
          path={siteMap.logged.modeEmploiDGCCRF}
          element={
            connectedUser.isPro ? (
              <ReportsPro reportType="open" />
            ) : (
              <ModeEmploiDGCCRF />
            )
          }
        />
        <Route path={siteMap.logged.stats.value}>
          <Route path="*" element={<Stats />} />
        </Route>
        <Route path={siteMap.loggedout.register} element={<AddCompanyForm />} />
        <Route
          path="/*"
          element={<Navigate replace to={siteMap.logged.reports()} />}
        />
      </Routes>
    </>
  )
}
