import {apiPublicSdk} from 'core/ApiSdkInstance'
import {useEffect, useState} from 'react'
import {UserWithPermission} from './client/authenticate/Authenticate'

export interface LoginActionProps<F extends Function> {
  action: F
  loading?: boolean
  errorMsg?: string
}

type LoginFunction = (login: string, password: string) => Promise<UserWithPermission>
type RegisterFunction = (siret: string, token: string, email: string) => Promise<void>

export function useLoginManagement({onLogout}: {onLogout: () => void}): {
  connectedUser?: UserWithPermission
  isFetchingUserOnStartup: boolean
  logout: () => void
  login: LoginActionProps<LoginFunction>
  register: LoginActionProps<RegisterFunction>
  setConnectedUser: (_: UserWithPermission) => void
} {
  const [connectedUser, setConnectedUser] = useState<UserWithPermission | undefined>()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginError, setLoginError] = useState<string | undefined>()
  const [registerError, setRegisterError] = useState<string | undefined>()
  const [isFetchingUserOnStartup, setIsFetchingUserOnStartup] = useState(true)

  useEffect(() => {
    async function fetchUserOnStartup() {
      try {
        const user = await apiPublicSdk.authenticate.getUser()
        setConnectedUser(user)
      } catch (e) {
        console.log('User is not logged in')
      } finally {
        setIsFetchingUserOnStartup(false)
      }
    }
    fetchUserOnStartup()
  }, [])

  async function login(login: string, password: string): Promise<UserWithPermission> {
    try {
      setIsLoggingIn(true)
      const user = await apiPublicSdk.authenticate.login(login, password)
      setConnectedUser(user)
      return user
    } catch (e: any) {
      setLoginError(e)
      throw e
    } finally {
      setIsLoggingIn(false)
    }
  }

  async function register(siret: string, token: string, email: string): Promise<void> {
    try {
      setIsRegistering(true)
      await apiPublicSdk.authenticate.sendActivationLink(siret, token, email)
    } catch (e: any) {
      setRegisterError(e)
      throw e
    } finally {
      setIsRegistering(false)
    }
  }

  const logout = async () => {
    await apiPublicSdk.authenticate.logout()
    onLogout()
    setConnectedUser(undefined)
  }

  return {
    connectedUser,
    isFetchingUserOnStartup,
    login: {
      action: login,
      loading: isLoggingIn,
      errorMsg: loginError,
    },
    logout,
    register: {
      action: register,
      loading: isRegistering,
      errorMsg: registerError,
    },
    setConnectedUser,
  }
}
