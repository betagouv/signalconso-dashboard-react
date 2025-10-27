import { QueryClient, useMutation } from '@tanstack/react-query'
import { publicApiSdk } from 'core/apiSdkInstances'
import React, { useRef, useState } from 'react'
import { router as appRouter } from '../../../router'
import { User } from '../../client/user/User'
import { LoginManagementContext, MaybeUser } from './loginManagementContext'

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
    const user = await publicApiSdk.authenticate.logout()
    return handleDetectedLogout(user)
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
