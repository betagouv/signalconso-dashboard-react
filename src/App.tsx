import {CssBaseline, StyledEngineProvider, ThemeProvider} from '@mui/material'
import {QueryClientProvider} from '@tanstack/react-query'
import React, {useEffect} from 'react'
import {useNavigate} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {ToastProvider} from './alexlibs/mui-extension'
import {apiPublicSdk} from './core/ApiSdkInstance'
import {Layout} from './core/Layout'
import {ScHeader} from './core/ScHeader/ScHeader'
import {ScSidebar} from './core/ScSidebar/ScSidebar'
import {I18nProvider} from './core/i18n'
import {muiTheme} from './core/theme'
import {useToast} from './core/toast'
import {Login} from './shared/Login'
import {Provide} from './shared/Provide'
import './style.css'
import {queryClient, setQueryClientErrorHandler} from 'queryClient'
import {AppRoutes} from './AppRoutes'
import {RedirectHashRouterToBrowserRouter} from './RedirectHashRouterToBrowserRouter'

const Router: typeof BrowserRouter = BrowserRouter

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
      <RedirectHashRouterToBrowserRouter />
      <Application />
    </Provide>
  )
}

const Application = () => {
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
        return (
          <Layout header={<ScHeader />} sidebar={authResponse && <ScSidebar connectedUser={authResponse} logout={logout} />}>
            <QueryClientProvider client={queryClient}>
              <AppRoutes
                authResponse={authResponse}
                setUser={setUser}
                register={register}
                isFetchingUser={isFetchingUser}
                login={login}
                logout={logout}
              />
            </QueryClientProvider>
          </Layout>
        )
      }}
    </Login>
  )
}
