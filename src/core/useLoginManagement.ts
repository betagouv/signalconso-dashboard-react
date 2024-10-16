import { apiPublicSdk } from 'core/apiSdkInstances'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { User } from './client/user/User'

export type LoginManagementResult = {
  connectedUser?: User
  isFetchingUserOnStartup: boolean
  logout: () => void
  handleDetectedLogout: () => void
  login: {
    action: (login: string, password: string) => Promise<User>
    loading?: boolean
    // this is not used, in the LoginForm we do our own error handling
    errorMsg?: unknown
  }
  register: {
    action: (siret: string, token: string, email: string) => Promise<void>
    loading?: boolean
    errorMsg?: unknown
  }
  setConnectedUser: Dispatch<SetStateAction<User | undefined>>
}

export function useLoginManagement(): LoginManagementResult {
  const navigate = useNavigate()

  const [connectedUser, setConnectedUser] = useState<User | undefined>()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginError, setLoginError] = useState<unknown | undefined>()
  const [registerError, setRegisterError] = useState<unknown | undefined>()
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

  async function login(login: string, password: string): Promise<User> {
    try {
      setIsLoggingIn(true)
      const user = await apiPublicSdk.authenticate.login(login, password)
      setConnectedUser(user)
      return user
    } catch (e: unknown) {
      setLoginError(e)
      throw e
    } finally {
      setIsLoggingIn(false)
    }
  }

  async function register(
    siret: string,
    token: string,
    email: string,
  ): Promise<void> {
    try {
      setIsRegistering(true)
      await apiPublicSdk.authenticate.sendActivationLink(siret, token, email)
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
    navigate('/')
  }

  const logout = async () => {
    const user = await apiPublicSdk.authenticate.logout()
    handleDetectedLogout(user)
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
    handleDetectedLogout,
    register: {
      action: register,
      loading: isRegistering,
      errorMsg: registerError,
    },
    setConnectedUser,
  }
}
