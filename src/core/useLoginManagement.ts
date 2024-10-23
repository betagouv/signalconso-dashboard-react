import { useMutation, useQuery } from '@tanstack/react-query'
import { publicApiSdk } from 'core/apiSdkInstances'
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

  const _userOnStartup = useQuery({
    queryKey: ['getUser'],
    queryFn: publicApiSdk.authenticate.getUser,
  })
  const isFetchingUserOnStartup = _userOnStartup.isLoading
  const userOnStartup = _userOnStartup.data
  useEffect(() => {
    if (userOnStartup) {
      setConnectedUser(userOnStartup)
    }
  }, [userOnStartup])

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

  const [isRegistering, setIsRegistering] = useState(false)
  const [registerError, setRegisterError] = useState<unknown | undefined>()

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
    navigate('/')
  }

  const logout = async () => {
    const user = await publicApiSdk.authenticate.logout()
    handleDetectedLogout(user)
  }

  return {
    connectedUser,
    isFetchingUserOnStartup,
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
  }
}
