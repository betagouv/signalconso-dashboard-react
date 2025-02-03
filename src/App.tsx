import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { config } from 'conf/config'
import { ToastProvider } from 'core/context/toastContext'
import { queryClient, setQueryClientErrorHandler } from 'queryClient'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { RedirectHashRouterToBrowserRouter } from './RedirectHashRouterToBrowserRouter'
import { Layout } from './core/Layout/Layout'
import { useToast } from './core/context/toastContext'
import { I18nProvider } from './core/i18n'
import { muiTheme } from './core/theme'
import { useLoginManagement } from './core/useLoginManagement'
import { Provide } from './shared/Provide'
import './style.css'

const Router: typeof BrowserRouter = BrowserRouter

export const App = () => {
  return (
    <Provide
      providers={[
        (_) => <QueryClientProvider client={queryClient} children={_} />,
        (_) => <ThemeProvider theme={muiTheme()} children={_} />,
        (_) => <StyledEngineProvider children={_} />,
        (_) => <CssBaseline children={_} />,
        (_) => (
          <Router
            children={_}
            future={{
              v7_relativeSplatPath: true,
              v7_startTransition: true,
            }}
          />
        ),
        (_) => <I18nProvider children={_} />,
        (_) => <ToastProvider children={_} />,
      ]}
    >
      <AppInsideProviders />
    </Provide>
  )
}

const AppInsideProviders = () => {
  const queryClient = useQueryClient()
  useQueryClientErrorHandlerSetup()
  const loginManagementResult = useLoginManagement(queryClient)
  return (
    <>
      <RedirectHashRouterToBrowserRouter />
      <Layout {...{ loginManagementResult }}>
        <AppRoutes {...{ loginManagementResult }} />
      </Layout>
      {config.isDev && <ReactQueryDevtools />}
    </>
  )
}

function useQueryClientErrorHandlerSetup() {
  const { toastError } = useToast()
  useEffect(() => {
    setQueryClientErrorHandler(toastError)
  }, [toastError])
}
