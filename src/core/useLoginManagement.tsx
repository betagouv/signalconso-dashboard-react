import { QueryClient, useMutation } from '@tanstack/react-query'
import { publicApiSdk } from 'core/apiSdkInstances'
import React, { useContext, useRef, useState } from 'react'
import { User } from './client/user/User'
import { router as appRouter } from '../App'

type MaybeUser = User | undefined
export type LoginManagementResult = {
  connectedUser?: User
  logout: () => void
  handleDetectedLogout: () => void
  login: {
    action: (login: string, password: string) => Promise<User>
    loading?: boolean
    // this is not used, in the LoginForm we do our own error handling
    errorMsg?: unknown
  }
  loginProConnect: {
    action: (authorizationCode: string, state: string) => Promise<User>
    loading?: boolean
    errorMsg?: unknown
  }
  startProConnect: {
    action: (state: string, nonce: string) => Promise<void>
    loading?: boolean
    errorMsg?: unknown
  }
  register: {
    action: (siret: string, token: string, email: string) => Promise<void>
    loading?: boolean
    errorMsg?: unknown
  }
  setConnectedUser: (
    user: MaybeUser | ((previous: MaybeUser) => MaybeUser),
  ) => void
  isAuthenticated: () => boolean
}

export const LoginManagementContext =
  React.createContext<LoginManagementResult>({} as LoginManagementResult)

export function LoginManagementProvider({
  queryClient,
  router,
  userOnStartup,
  children,
}: {
  queryClient: QueryClient
  router: typeof appRouter
  userOnStartup?: User
  children: React.ReactNode
}) {
  const [connectedUser, setConnectedUserInternal] =
    useState<MaybeUser>(userOnStartup)
  // useRef required to redirect correctly in beforeLoad functions.
  // beforeLoad is triggered before any re-render thus, when calling setConnectedUser, connectedUser is not up to date
  // before any re-render and thus beforeLoad is called with outdated parameters first.
  const isAuthenticatedRef = useRef<boolean>(!!userOnStartup)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<unknown | undefined>()

  const isAuthenticated = () => isAuthenticatedRef.current

  const setConnectedUser = (
    user: MaybeUser | ((previous: MaybeUser) => MaybeUser),
  ) => {
    setConnectedUserInternal(user)
    if (typeof user === 'function') {
      isAuthenticatedRef.current = !!user(connectedUser)
    } else {
      isAuthenticatedRef.current = !!user
    }
  }

  const _loginProConnect = useMutation({
    mutationFn: ({
      authorizationCode,
      state,
    }: {
      authorizationCode: string
      state: string
    }) => publicApiSdk.authenticate.loginProConnect(authorizationCode, state),
    onSuccess: (user) => {
      setConnectedUser(user)
    },
    // we don't want to trigger the default toast of errors
    onError: () => {},
  })

  const isProConnectLoggingIn = _loginProConnect.isPending
  const proConnectloginError = _loginProConnect.error

  const _startProConnect = useMutation({
    mutationFn: ({ state, nonce }: { state: string; nonce: string }) =>
      publicApiSdk.authenticate.startProConnect(state, nonce),
    // we don't want to trigger the default toast of errors
    onError: () => {},
  })

  const isStartingProConnect = _startProConnect.isPending
  const isStartingProConnectError = _startProConnect.error

  const _login = useMutation({
    mutationFn: ({ login, password }: { login: string; password: string }) =>
      publicApiSdk.authenticate.login(login, password),
    onSuccess: (user) => {
      setConnectedUser(user)
    },
    // we don't want to trigger the default toast of errors
    onError: () => {},
  })

  const isLoggingIn = _login.isPending
  const loginError = _login.error

  async function register(
    siret: string,
    token: string,
    email: string,
  ): Promise<void> {
    try {
      setIsRegistering(true)
      await publicApiSdk.authenticate.sendActivationLink(siret, token, email)
    } catch (e: unknown) {
      setRegisterError(e)
      throw e
    } finally {
      setIsRegistering(false)
    }
  }

  function handleDetectedLogout(user?: User) {
    console.warn('User seems logged out.')
    setConnectedUser(user)
    router.invalidate()
    router.navigate({ to: '/' })
    return queryClient.resetQueries()
  }

  const logout = async () => {
    if (connectedUser && connectedUser.authProvider === 'ProConnect') {
      publicApiSdk.authenticate
        .logoutProConnect()
        //Need to use window.location.href to force browser to not check CORS
        .then((_) => (window.location.href = _ as string))
    } else {
      const user = await publicApiSdk.authenticate.logout()
      return handleDetectedLogout(user)
    }
  }

  return (
    <LoginManagementContext.Provider
      value={{
        connectedUser,
        login: {
          action: (login: string, password: string) => {
            return _login.mutateAsync({ login, password })
          },
          loading: isLoggingIn,
          errorMsg: loginError,
        },
        loginProConnect: {
          action: (authorizationCode: string, state: string) => {
            return _loginProConnect.mutateAsync({ authorizationCode, state })
          },
          loading: isProConnectLoggingIn,
          errorMsg: proConnectloginError,
        },
        startProConnect: {
          action: (state: string, nonce: string) => {
            return _startProConnect.mutateAsync({ state, nonce })
          },
          loading: isStartingProConnect,
          errorMsg: isStartingProConnectError,
        },
        logout,
        handleDetectedLogout,
        register: {
          action: register,
          loading: isRegistering,
          errorMsg: registerError,
        },
        setConnectedUser,
        isAuthenticated,
      }}
    >
      {children}
    </LoginManagementContext.Provider>
  )
}

export const useLoginManagement = (): LoginManagementResult => {
  return useContext(LoginManagementContext)
}
