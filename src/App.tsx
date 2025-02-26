import {
  CircularProgress,
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material'
import { QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { config } from 'conf/config'
import { ToastProvider } from 'core/context/toastContext'
import { queryClient, setQueryClientErrorHandler } from 'queryClient'
import { useEffect } from 'react'
import { useToast } from './core/context/toastContext'
import { I18nProvider } from './core/i18n'
import { muiTheme } from './core/theme'
import {
  LoginManagementProvider,
  useLoginManagement,
} from './core/useLoginManagement'
import { Provide } from './shared/Provide'
import './style.css'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { publicApiSdk } from './core/apiSdkInstances'
import { CenteredContent } from './shared/CenteredContent'
import { routeTree } from './routeTree.gen'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import qs from 'qs'

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // auth will initially be undefined
    // We'll be passing down the auth state from within a React component
    loginManagementResult: undefined!,
  },
  defaultPreload: 'intent',
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  // Legacy parsing / stringify
  // Because of potential bookmarks / links in emails, we can't use native JSON tanstack router parsing
  stringifySearch: (record) => {
    const newQueryString = qs.stringify(record)
    return newQueryString ? `?${newQueryString}` : ''
  },
  parseSearch: (searchStr) => {
    // arrayLimit raised from 20 to 200 otherwise the departments list may not be parsed correctly
    return qs.parse(searchStr.replace(/^\?/, ''), {
      arrayLimit: 200,
    })
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

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
