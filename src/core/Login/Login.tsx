import {useToast} from '../toast'
import React, {useEffect, useMemo, useState} from 'react'
import jwtDecode from 'jwt-decode'
import {localStorageObject} from '../helper/localStorage'

type PromiseReturn<T> = T extends PromiseLike<infer U> ? U : T

type AsynFnResult<T extends (...args: any[]) => Promise<object>> = PromiseReturn<ReturnType<T>>

export interface LoginExposedProps<F extends (...args: any[]) => Promise<object>> {
  authResponse?: AsynFnResult<F>,
  logout: () => void,
  login: (...args: Parameters<F>) => Promise<void>
  token?: string
  isLogging: boolean
  isCheckingToken: boolean
}

interface Props<F extends (...args: any[]) => Promise<object>> {
  onLogin: F
  getTokenFromResponse: (_: AsynFnResult<F>) => string
  children: ({authResponse, login, logout, token}: LoginExposedProps<F>) => any
}

export const Login = <F extends (...args: any[]) => Promise<object>>({
  onLogin,
  getTokenFromResponse,
  children
}: Props<F>) => {
  const authenticationStorage = useMemo(() => localStorageObject<AsynFnResult<F>>('AuthUserSignalConso'), [])
  const {toastError} = useToast()
  const [auth, setAuth] = useState<AsynFnResult<F>>()
  const [isLogging, setIsLogging] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(false)

  useEffect(() => {
    const storedToken = authenticationStorage.get()
    if (storedToken) {
      checkToken(storedToken)
    }
  }, [])

  const login = async (...args: Parameters<F>): Promise<void> => {
    try {
      setIsLogging(true)
      const auth = await onLogin(...args)
      authenticationStorage.set(auth as any)
      setAuth(auth as any)
    } catch (e) {
      toastError(e)
    } finally {
      setIsLogging(false)
    }
  }

  const logout = () => {
    setAuth(undefined)
    authenticationStorage.clear()
  }

  const isTokenExpired = (token: string): boolean => {
    const expirationDate = (jwtDecode(token) as {exp: number}).exp
    return new Date().getTime() > (expirationDate * 1000)
  }

  const checkToken = async (auth: AsynFnResult<F>) => {
    setIsCheckingToken(true)
    if (isTokenExpired(getTokenFromResponse(auth))) {
    } else {
      setAuth(auth)
    }
    setIsCheckingToken(false)
  }

  return children({
    authResponse: auth,
    login,
    logout,
    token: auth ? getTokenFromResponse(auth) : undefined,
    isLogging,
    isCheckingToken,
  })
}
