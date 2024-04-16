import {ReactNode, useEffect, useState} from 'react'
import {UserWithPermission} from '../core/client/authenticate/Authenticate'
import {apiPublicSdk} from 'core/ApiSdkInstance'

export interface LoginActionProps<F extends Function> {
  action: F
  loading?: boolean
  errorMsg?: string
}

type LoginFunction = (login: string, password: string) => Promise<UserWithPermission>
type RegisterFunction = (siret: string, token: string, email: string) => Promise<void>

interface Props {
  onLogout: () => void
  children: (params: {
    connectedUser?: UserWithPermission
    isFetchingUser: boolean
    logout: () => void
    login: LoginActionProps<LoginFunction>
    register: LoginActionProps<RegisterFunction>
    setConnectedUser: (_: UserWithPermission) => void
  }) => ReactNode
}

export const Login = ({onLogout, children}: Props) => {
  const [connectedUser, setConnectedUser] = useState<UserWithPermission | undefined>()
  const [isLogging, setIsLogging] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginError, setLoginError] = useState<string | undefined>()
  const [registerError, setRegisterError] = useState<string | undefined>()
  const [isFetchingUser, setIsFetchingUser] = useState(true)

  useEffect(() => {
    apiPublicSdk.authenticate
      .getUser()
      .then(user => {
        setConnectedUser(user)
      })
      .catch(e => {
        console.log('User is not logged in')
      })
      .finally(() => {
        setIsFetchingUser(false)
      })
  }, [])

  const login: LoginFunction = async (...args) => {
    try {
      setIsLogging(true)
      const auth = await apiPublicSdk.authenticate.login(...args)
      setConnectedUser(auth)
      return auth
    } catch (e: any) {
      setLoginError(e)
      throw e
    } finally {
      setIsLogging(false)
    }
  }

  const register: RegisterFunction = async (...args) => {
    try {
      setIsRegistering(true)
      return apiPublicSdk.authenticate.sendActivationLink(...args)
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

  return (
    <>
      {children({
        connectedUser,
        isFetchingUser,
        login: {
          action: login,
          loading: isLogging,
          errorMsg: loginError,
        },
        logout,
        register: {
          action: register,
          loading: isRegistering,
          errorMsg: registerError,
        },
        setConnectedUser,
      })}
    </>
  )
}
