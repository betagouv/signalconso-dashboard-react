import React, {ReactNode, useContext} from 'react'
import {SignalConsoApiSdk} from '../../App'
import {UserWithPermission} from '../api'

const LoginContext = React.createContext({} as any)

interface LoginProviderProps {
  apiSdk: SignalConsoApiSdk
  token: string
  connectedUser: UserWithPermission
  onLogout: () => void
  children: ReactNode
}

interface UseLoginProps {
  connectedUser: UserWithPermission,
  logout: () => void,
  apiSdk: SignalConsoApiSdk
  token: string
}

export const LoginProvider2 = ({
  apiSdk,
  token,
  connectedUser,
  onLogout,
  children
}: LoginProviderProps) => {
  return (
    <LoginContext.Provider value={{
      connectedUser: connectedUser,
      logout: onLogout,
      token,
      apiSdk,
    }}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLogin = (): UseLoginProps => {
  return useContext(LoginContext)
}
