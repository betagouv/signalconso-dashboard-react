import {useEffect, useState} from 'react'
import {UserWithPermission} from '../core/client/authenticate/Authenticate'

export type Fn = (...args: any[]) => Promise<any>

export interface LoginActionProps<F extends Function> {
  action: F
  loading?: boolean
  errorMsg?: string
}

export interface LoginExposedProps<L extends Fn, R extends Fn> {
  connectedUser?: UserWithPermission
  isFetchingUser: boolean
  logout: () => void
  login: LoginActionProps<L>
  register: LoginActionProps<R>
  setConnectedUser: (_: UserWithPermission) => void
}

interface Props<L extends Fn, R extends Fn> {
  onLogin: L
  onRegister: R
  onLogout: () => void
  getUser: () => Promise<UserWithPermission>
  children: ({connectedUser, login, logout}: LoginExposedProps<L, R>) => any
}

export const Login = <L extends Fn, R extends Fn>({onLogin, onRegister, onLogout, getUser, children}: Props<L, R>) => {
  const [connectedUser, setConnectedUser] = useState<UserWithPermission | undefined>()
  const [isLogging, setIsLogging] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [loginError, setLoginError] = useState<string | undefined>()
  const [registerError, setRegisterError] = useState<string | undefined>()
  const [isFetchingUser, setIsFetchingUser] = useState(true)

  useEffect(() => {
    console.log('@@@ calling getUser')
    getUser()
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

  // @ts-ignore
  const login: L = async (...args: any[]) => {
    try {
      setIsLogging(true)
      const auth = await onLogin(...args)
      setConnectedUser(auth)
      return auth
    } catch (e: any) {
      setLoginError(e)
      throw e
    } finally {
      setIsLogging(false)
    }
  }

  // @ts-ignore
  const register: R = async (...args: any[]) => {
    try {
      setIsRegistering(true)
      return onRegister(...args)
    } catch (e: any) {
      setRegisterError(e)
      throw e
    } finally {
      setIsRegistering(false)
    }
  }

  const logout = async () => {
    await onLogout()
    setConnectedUser(undefined)
  }

  return children({
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
  })
}
