import {
  CircularProgress,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { config } from 'conf/config'
import { LoginManagementProvider } from 'core/context/loginManagement/LoginManagementProvider'
import { useLoginManagement } from 'core/context/loginManagement/loginManagementContext'
import { ToastProvider } from 'core/context/toast/ToastContextProvider'
import { queryClient, setQueryClientErrorHandler } from 'queryClient'
import { useEffect } from 'react'
import { router } from 'router'
import { publicApiSdk } from './core/apiSdkInstances'
import { I18nProvider } from './core/context/i18n/I18nProvider'
import { useToast } from './core/context/toast/toastContext'
import { muiTheme } from './core/theme'
import { CenteredContent } from './shared/CenteredContent'
import { Provide } from './shared/Provide'
import './style.css'

export const App = () => {
  const _userOnStartup = useQuery(
    {
      queryKey: ['getUser'],
      queryFn: publicApiSdk.authenticate.getUser,
    },
    queryClient,
  )
  const isFetchingUserOnStartup = _userOnStartup.isLoading
  const userOnStartup = _userOnStartup.data ?? undefined

  if (isFetchingUserOnStartup) {
    return (
      <CenteredContent>
        <CircularProgress />
      </CenteredContent>
    )
  } else {
    return (
      <Provide
        providers={[
          (_) => <QueryClientProvider client={queryClient} children={_} />,
          (_) => <ThemeProvider theme={muiTheme()} children={_} />,
          (_) => <StyledEngineProvider children={_} />,
          (_) => <CssBaseline children={_} />,
          (_) => <I18nProvider children={_} />,
          (_) => <ToastProvider children={_} />,
          (_) => (
            <LoginManagementProvider
              userOnStartup={userOnStartup}
              router={router}
              queryClient={queryClient}
              children={_}
            />
          ),
        ]}
      >
        <AppRoutes />
        {config.isDev && <ReactQueryDevtools />}
        {config.isDev && <TanStackRouterDevtools router={router} />}
      </Provide>
    )
  }
}

export const AppRoutes = () => {
  useQueryClientErrorHandlerSetup() // Must be called after ToastProvider has been defined
  const loginManagementResult = useLoginManagement()

  return <RouterProvider router={router} context={{ loginManagementResult }} />
}

function useQueryClientErrorHandlerSetup() {
  const { toastError } = useToast()
  useEffect(() => {
    setQueryClientErrorHandler(toastError)
  }, [toastError])
}
