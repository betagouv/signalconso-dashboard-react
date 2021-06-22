import React, {ReactNode, useContext, useEffect, useState} from 'react'
import {LoginLoader} from './LoginLoader'
import {LoginForm} from './LoginForm'
import {localStorageObject} from '../helper/localStorage'
import {useToast} from '../toast'
import jwtDecode from 'jwt-decode'

export interface LoginSdk<User extends {token: string}> {
  login: (email: string, password: string) => Promise<User>
}

export interface LoginProps {
  children: ReactNode
}

export interface LoginContextProps<User, ApiSdk> {
  apiSdk: ApiSdk
  logout: () => void
  connectedUser: User
}

export interface AuthRespone<User> {
  token: string
  user: User
}

export const makeLoginProviderComponent = <User, ApiSdk>(
  apiLogin: (email: string, password: string) => Promise<AuthRespone<User>>,
  makeSdk: (token: string) => ApiSdk
) => {
  const authenticationStorage = localStorageObject<AuthRespone<User>>('AuthUserSignalConso')
  const LoginContext = React.createContext<LoginContextProps<User, ApiSdk>>({} as any)

  const LoginProvider = ({
    token,
    connectedUser,
    onLogout,
    children
  }: {
    token: string,
    connectedUser: User,
    onLogout: () => void,
    children: ReactNode
  }) => {
    return (
      <LoginContext.Provider value={{
        connectedUser: connectedUser,
        logout: onLogout,
        apiSdk: makeSdk(token)
      }}>
        {children}
      </LoginContext.Provider>
    )
  }

  const useLoginContext = () => {
    return useContext<LoginContextProps<User, ApiSdk>>(LoginContext)
  }

  const Login = ({children}: LoginProps) => {
    const {toastError} = useToast()
    const [auth, setAuth] = useState<AuthRespone<User>>()
    const [isLoggining, setIsLoggining] = useState(false)
    const [isCheckingToken, setIsCheckingToken] = useState(false)

    useEffect(() => {
      const storedToken = authenticationStorage.get()
      if (storedToken) {
        checkToken(storedToken)
      }
    }, [])

    const login = async (email: string, password: string) => {
      try {
        setIsLoggining(true)
        const auth = await apiLogin(email, password)
        authenticationStorage.set(auth)
        setAuth(auth)
      } catch (e) {
        toastError(e)
      } finally {
        setIsLoggining(false)
      }
    }

    const logout = () => {
      setAuth(undefined)
      authenticationStorage.clear()
    }

    const isTokenExpired = (token: string): boolean => {
      const expirationDate = (jwtDecode(token) as {exp: number}).exp
      return new Date().getTime() > expirationDate
    }

    const checkToken = async (auth: AuthRespone<User>) => {
      setIsCheckingToken(true)
      if (isTokenExpired(auth.token)) {
      } else {
        setAuth(auth)
      }
      setIsCheckingToken(false)
    }

    if (auth) {
      return (
        <LoginProvider token={auth.token} connectedUser={auth.user} onLogout={logout}>
          {children}
        </LoginProvider>
      )
    }
    if (isCheckingToken) {
      return (
        <LoginLoader/>
      )
    }
    return (
      <LoginForm isLoading={isLoggining} onLogin={login}/>
    )
  }

  return {Login, useLoginContext}
}

